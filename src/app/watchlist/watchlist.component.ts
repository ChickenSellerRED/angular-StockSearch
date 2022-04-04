import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";
import {Router} from "@angular/router";

// const server_prefix:string = "http://127.0.0.1:3080";
const server_prefix:string = "";

declare var $: any;
@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  following:string[] = [];
  constructor(
    private router:Router
  ) { }
  name: any = {};
  tb3: any = {};
  empty_list = false;

  ngOnInit(): void {
    var tem_following = localStorage.getItem('following');
    if(tem_following != null)
      this.following = JSON.parse(tem_following);
    console.log('following',this.following);
    this.empty_list = false;
    if(this.following.length == 0)
      this.empty_list = true;
    for(var i=0;i<this.following.length;i++){
      let ticker = this.following[i];
      console.log(ticker)
      $.getJSON(server_prefix + "/get_4p1",{'ticker':ticker},(result: any)=>{
        let cur_ticker = result.ticker;
        this.name[result.ticker] = result.name;
        $.getJSON(server_prefix + "/get_4p3",{'ticker':result.ticker},(result: any)=>{
          this.tb3[cur_ticker] = result;
        });
      });
      console.log('name',this.name)
      console.log('tb3',this.tb3)
    }
  }
  unsub(ticker:string){
    this.following.splice(this.following.indexOf(ticker),1);
    localStorage.setItem('following',JSON.stringify(this.following));
    if(this.following.length == 0)
      this.empty_list = true;
  }
  turnToDetail(ticker:string){
    this.router.navigateByUrl('/search/'+ticker)
  }

  arrow_color(d:number){
    var style:any = {
      'color': '#ff0000'
    };
    if(d>0)
      style.color='#008000'
    else if(d==0){
      style.color = '#000000';
      // style.display='none';
    }
    return style;
  }
}

