import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';


declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'my-app';
  // 后面要做localstorage
  static cur_stock_ticker: string = "";
  static tb1 = {};
  static tb2 = {};
  static tb3 = {};
  static tb4 = {};
  static tb5 = {};
  static tb6 = {};
  static tb7 = {};
  static tb8 = {};
  static tb9 = {};
  static following:string[] = [];
  constructor(
    private router:Router
  ){}
  ngOnInit():void {
    if(localStorage.getItem('following')===null)
      localStorage.setItem('following',JSON.stringify([]));
    if(localStorage.getItem('account')===null){
      var account: any = {};
      account.saving = 25000;
      account.own_stock = {};
      localStorage.setItem('account',JSON.stringify(account));
    }
  }
  turnToSearch():void{
    this.router.navigateByUrl('/search/');
  }
  turnToSearchticker(): void {
    this.clear_active();
    $('#a_1').addClass('active')

    var local_ticker = localStorage.getItem('curticker')
    if(local_ticker!==null)
      this.router.navigateByUrl('/search/'+local_ticker)
    else
      this.router.navigateByUrl('/search/')
  }
  turnToWatchlist(): void{
    this.clear_active();
    $('#a_2').addClass('active')
    this.router.navigateByUrl('/watchlist')
  }
  turnToPortfolio(): void{
    this.clear_active();
    $('#a_3').addClass('active')
    this.router.navigateByUrl('/portfolio')
  }
  clear_active(){
    $('#a_1').removeClass('active')
    $('#a_2').removeClass('active')
    $('#a_3').removeClass('active')
  }


}

// document.getElementById('input_seach').addEventListener('keyup', event =>{
//   console.log(event.keyCode);
//   if(event.keyCode === 13){
//     console.log('key_enter');
//   }
// });
