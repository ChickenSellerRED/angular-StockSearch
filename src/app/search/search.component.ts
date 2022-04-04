import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params,Router } from '@angular/router';
import {Location, PlatformLocation} from '@angular/common';
import {TickerComponent} from "./ticker/ticker.component";
import {FormControl} from '@angular/forms';
import {map, Observable, startWith} from "rxjs";
import { MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {Global} from '../global';
import {AppComponent} from "../app.component";

// const server_prefix:string = "http://127.0.0.1:3080";
const server_prefix:string = "";
declare var $: any;
var a = ""

interface Alert {
  type: string;
  message: string;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  // @Input() ticker: string|undefined;
  ticker="";
  myControl = new FormControl();
  // auto_options : object[]= [{'p1':'0','p2':''}];
  auto_options:any;
  filteredOptions: Observable<object[]>|undefined;
  valid_ticker = true;
  // tb1 = {};
  // tb2 = {};
  // tb3 = {};
  // tb4 = {};
  // tb5 = {};
  // tb6 = {};
  // tb7 = {};
  // tb8 = {};
  // tb9 = {};
  tem_ticker = 0;
  alerts:Alert[]=[];
  auto_compelete_spinner = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router:Router,
    private planform: PlatformLocation


  ) {}
  ngOnInit(): void {
    console.log(this.router.url)
    this.route.params.subscribe(data=>this.ticker=data['ticker']);//传给ticker组件的参数
    // setTimeout(()=>{
    //   },3000);
  }


  do_auto_complete(event:any) : void{
    if(event.key ===('Enter')){
      this.get_result();
      return;
    }
    this.auto_options = [];
    this.auto_compelete_spinner = true;
    var cur_ticker:String = (<HTMLInputElement>document.getElementById('input_seach')).value;
    if(cur_ticker == ''){
      return;
      this.auto_compelete_spinner = false;
    }
    console.log('auto compelete ',cur_ticker)
    $.getJSON(server_prefix + "/get_auto_complete",{'cur_ticker':cur_ticker},(result:any)=>{
      console.log('auto compelete=',result);
      var len = result['count'];
      // console.log('len=',len);
      if(len>100) len = 100;
      this.auto_options = [];
      for(var i=0;i<len;i++){
        var json= {'p1':result['result'][i]['symbol'],'p2':result['result'][i]['description']}
        if(i==0)
          this.auto_compelete_spinner = false;
        this.auto_options.push(json);
      };
    })
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   map(value => this._filter(value)),
    // );
  }
  get_result(){
    this.auto_options = [];
    this.auto_compelete_spinner = false;
    var ticker:string = (<HTMLInputElement>document.getElementById('input_seach')).value;
    if(ticker == '' || ticker.includes('.')) {
      var tem: Alert = {
        type: 'danger',
        message: "Please enter a valid ticker"
      }
      this.alerts = [];
      this.alerts.push(tem);
      setTimeout(() => {
        if (this.alerts.length != 0)
          this.alerts = [];
      }, 5000);
      return;
    }
    localStorage.setItem('curticker',ticker);

    console.log(ticker);
    this.ticker=ticker;
    this.router.navigateByUrl('/search/'+ticker);
  }
  clear_result():void{
    $('#input_seach').val('');
    console.log('clear!')
    this.valid_ticker = true;
    this.router.navigateByUrl('/search/');
  }

  close(alert: Alert) {
    this.alerts = [];
  }
}
