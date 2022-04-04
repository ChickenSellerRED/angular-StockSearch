import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";

declare var $: any;

// const server_prefix:string = "http://127.0.0.1:3080";
const server_prefix:string = "";

interface Alert {
  type: string;
  message: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  closeResult = '';
  constructor(private modalService: NgbModal,
              private router:Router,
              public activeModal: NgbActiveModal) {}
  account: any = {};
  own_stock : any[]=[];
  tb3:any = {};
  tickerInC: string ="";
  alerts: Alert[]= [];
  modalRef: NgbModalRef|any;
  ngOnInit(): void {

    this.buy_total_price = '0'
    this.account = JSON.parse(<string><any>localStorage.getItem('account'));
    for(var ticker in this.account.own_stock){
      this.own_stock.push(ticker);
      $.getJSON(server_prefix + "/get_4p1",{'ticker':ticker},(result: any)=> {
        var cur_ticker = result.ticker;
        var cur_name = result.name;
        $.getJSON(server_prefix + "/get_4p3",{'ticker':cur_ticker},(result: any)=> {
          this.tb3[cur_ticker] = result;
          this.tb3[cur_ticker].name=cur_name;
          console.log('tb3',this.tb3)
        });
      });
    }
    console.log('own_stock',this.own_stock)
    console.log('account',this.account)
  }
  arrow_color(d:number){
    var style:any = {
      'color': ''
    };
    if(Math.abs(d)<1e-6)
      style.color = '#000000';
    else if(d>0)
      style.color='#008000';
    else if(d<0)
      style.color='#ff0000';
    return style;
  }
  arrow_svgpath(d:number):any{
    if(Math.abs(d)<1e-6)
      return "";
    else if(d>0)
      return "m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z";
    else if(d<0)
      return "M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
    return "";
  }
  open(content:any) {
    this.sell_total_price = '0.00'
    this.buy_total_price  = '0.00'
    this.buy_error_hint   = false;
    this.sell_error_hint  = false;
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cur_buy_quantity:number = 0;
  cur_sell_quantity:number = 0;
  buy_total_price:string = '0'
  sell_total_price:string = '0'
  buy_error_msg:string = '';
  sell_error_msg:string = '';
  buy_error_hint = false;
  sell_error_hint = false;
  get_buy_error_hint(event:any,ticker:string):void{


    if(event.target.value == '')this.cur_buy_quantity=0;
    else this.cur_buy_quantity = parseInt(event.target.value,10);
    this.buy_total_price = (event.target.value * this.tb3[ticker].c).toFixed(2);

    if(this.cur_buy_quantity <1){
      $('#buy_stock').attr('disabled',true);
      return;
    }if(event.target.value * this.tb3[ticker].c > this.account.saving){
      this.buy_error_msg = 'No enough money in wallet!';
      this.buy_error_hint = true;
      // (<HTMLButtonElement>(document.getElementById("buy_stock"))).disabled=true;
      $('#buy_stock').attr('disabled',true);
    }
    else{
      this.buy_error_msg = '';
      this.buy_error_hint = false;
      $('#buy_stock').attr('disabled',false);
    }
  }

  get_sell_error_hint(event:any,ticker:string):void{
    if(event.target.value == '') this.cur_sell_quantity=0;
    else this.cur_sell_quantity = parseInt(event.target.value,10);
    this.sell_total_price = (this.cur_sell_quantity * this.tb3[ticker].c).toFixed(2);

    if(this.cur_sell_quantity < 1){
      console.log('yeah')
      $('#sell_stock').attr('disabled',true);
      return;
    }

    if(this.cur_sell_quantity  > this.account.own_stock[ticker].quantity){
      this.sell_error_msg = 'You cannot sell the stocks that you don\'t have!';
      this.sell_error_hint = true;
      $('#sell_stock').attr('disabled',true);
    }
    else{
      this.sell_error_msg = '';
      this.sell_error_hint = false;
      $('#sell_stock').attr('disabled',false);
    }
  }

  buy_func(event:any,ticker:string) {

    this.modalService.dismissAll();
    var quantity: number = this.cur_buy_quantity;
    this.account.saving -= this.tb3[ticker].c * quantity;//扣钱
    if (this.account.own_stock.hasOwnProperty(ticker)) {
      this.account.own_stock[ticker].total_cost += this.tb3[ticker].c * quantity;//增加总花费
      this.account.own_stock[ticker].quantity += quantity; // 增加数量
      this.account.own_stock[ticker].avg_cost = this.account.own_stock[ticker].total_cost / this.account.own_stock[ticker].quantity;//计算平均花费
    } else {
      this.account.own_stock[ticker] = {
        'total_cost': this.tb3[ticker].c * quantity,
        'quantity': quantity,
        'avg_cost': this.tb3[ticker].c
      }
    }
    console.log('account',this.account);
    localStorage.setItem('account',JSON.stringify(this.account));
    var tem:Alert = {
      type:'success',
      message: ticker+" bought successfully."
    }
    this.alerts = [];
    this.alerts.push(tem);
    setTimeout(()=>{
      if(this.alerts.length != 0)
        this.alerts = [];
    },3000);
  }

  buy_check_enter(event:any,ticker:string){
    if(event.key ===('Enter')){
      console.log('buy_func')
      this.buy_func(event,ticker);
    }
    return;
  }
  sell_check_enter(event:any,ticker:string){
    if(event.key ===('Enter')){
      console.log('sell_func')
      this.sell_func(event,ticker);
    }
    return;
  }

  sell_func(event:any,ticker:string):void{
    this.modalService.dismissAll();
    var quantity:number = this.cur_sell_quantity;
    this.account.saving += this.tb3[ticker].c*quantity;//加钱
    if(this.account.own_stock.hasOwnProperty(ticker)){
      this.account.own_stock[ticker].quantity -=quantity;
      this.account.own_stock[ticker].total_cost -= quantity * this.account.own_stock[ticker].avg_cost;
    }
    if(this.account.own_stock[ticker].quantity == 0){
      this.own_stock.splice(this.own_stock.indexOf(ticker),1);
      delete this.account.own_stock[ticker];
    }
    localStorage.setItem('account',JSON.stringify(this.account));
    var tem:Alert = {
      type:'danger',
      message: ticker+" sold successfully."
    }
    this.alerts = [];
    this.alerts.push(tem);
    setTimeout(()=>{
      if(this.alerts.length != 0)
        this.alerts = [];
    },3000);
  }

  turnToDetail(ticker:string){
    this.router.navigateByUrl('/search/'+ticker)
  }

  close(alert: Alert) {
    this.alerts = [];
  }
}
