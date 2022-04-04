import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from "../../app.component";
// import * as Highcharts from 'highcharts';

import * as Highcharts from "highcharts";
import * as Highstocks from "highcharts/highstock";
import IndicatorsCore from 'highcharts/indicators/indicators';
import VBP from 'highcharts/indicators/volume-by-price';
IndicatorsCore(Highcharts);
IndicatorsCore(Highstocks);
VBP(Highcharts);
VBP(Highstocks);

// const server_prefix:string = "http://127.0.0.1:3080";
const server_prefix:string = "";

interface Alert {
  type: string;
  message: string;
}

// import HC_exporting from 'highcharts/modules/exporting';
// HC_exporting(Highstocks);
// IndicatorsCore(Highstocks)
import {arrow} from "@popperjs/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {stringify} from "@angular/compiler/src/util";

declare var $: any;
declare var chart: any;
@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css'],
})
export class TickerComponent implements OnInit {

  // @Input() ticker: string|undefined;
  cert : number = 0;
  private ticker:string = "";
  @Input() tb1: any;
  @Input() tb2: any;
  @Input() tb3: any;
  @Input() tb4: any;
  @Input() tb5: any;
  @Input() tb6: any;
  @Input() tb7: any;
  @Input() tb8: any;
  @Input() tb9: any;
  ticker_in_following = false;
  now_time = 0;
  now_time_string = "";
  Market_state:any = false;
  updateFlag = false;
  stockUpdateFlag = false;
  recommendationUpdateFlag = false;
  epsUpdateFlag = false;
  ohlc:any= [];
  volume:any = [];
  displayedColumns: string[] = [];
  socal_sentiments:any = [];
  following : any = [];
  closeResult = '';
  account : any = {};
  buy_error_hint = false;
  sell_error_hint = false;
  error_msg = '';
  cur_news:any = {};
  alerts:Alert[] = [];
  true_name = false;
  show_spinner:boolean|any;
  @Input() valid_ticker2 = true;
  private valid_ticker1 = true;
  @Input()
  set valid_ticker(tf:boolean){
    // console.log('set valid_ticker as',tf);
    this.valid_ticker1 = tf;
  }
  get valid_ticker(){
    // console.log('get valid_ticker as',this.valid_ticker1);
    return this.valid_ticker1;
  }

  @Input()
  set cur_ticker(ticker:string){
    if(ticker=='' || ticker == this.cur_ticker || ticker == null){
     return;
    }
    var cert = Math.random();
    this.show_spinner = true;
    $.getJSON(server_prefix + "/get_4p1",{'ticker':ticker,'cert':cert},(result: any)=>{
      // alert('valid:'+cert)
      // console.log(result);
      this.true_name = false;
      this.show_spinner = true;
      if(result.hasOwnProperty('Truename')){
        this.alerts = [];
        this.ticker=ticker;
        console.log('set localstore curticker ',ticker)
        localStorage.setItem('curticker',ticker);
        this.update_time();
        // AppComponent.tb1 = result;
        this.tb1=result;
        // console.log('4p1:',result)
        if(this.following.includes(ticker))
          this.ticker_in_following = true;
        else
          this.ticker_in_following = false;
        // history.pushState({}, '', '/search/'+ticker)
        this.update_ticker_data();

        console.log('show_spinner',this.show_spinner);

        // this.show_spinner = false;
        // this.true_name = true;
        setTimeout(()=>{
          this.show_spinner = false;
          this.true_name = true;
        },500)
      }
      else{
        // alert('not valid:'+cert +'ticker:'+ticker)
        this.true_name = false;
        this.valid_ticker = false;
        console.log('fake name');
        this.show_spinner = false;
      }
    });
    this.show_spinner = false;
    setTimeout(()=>{
      $('#input_seach').val(ticker)
    },100);
  }
  get cur_ticker(){
    return this.ticker;
  }

  Highcharts: typeof Highcharts = Highcharts;
  Highcharts_1: typeof Highstocks = Highstocks;
  Highcharts_2: typeof Highcharts = Highcharts;
  highChart1: Highcharts.Chart | undefined;
  chartOptions: Highcharts.Options = {
    tooltip: {
      split: true,
    },
    legend:{
      enabled:false,
    },
    title: {
      text: ''
    },
    plotOptions:{
      spline:{
        marker: {
          enabled: false
        },
      }
    }, xAxis: {
      //表示为时间，注意大小写
      type: 'datetime',
      //间距，时间戳，以下表示间距为1天，如果想表示间距为1周，就这么写
      //7*24*3600*1000
      tickInterval: 60 * 60 * 1000,
      //格式化时间，day,week....
      dateTimeLabelFormats: {
        day: '%H:%S'
      }
    },
    yAxis:{
      title:{
        text:undefined
      },
      opposite:true
    },
    series: [{
      data: [],
      type: "spline",
      color: '#ff0000'
    }]
  };

  groupingUnits: any = [[
    'week',                         // unit name
    [1]                             // allowed multiples
  ], [
    'month',
    [1, 2, 3, 4, 6]
  ]]

  stockOptions : Highcharts.Options = {

    rangeSelector: {
      enabled: true,
      inputEnabled: true,
      buttons:[{
        type: 'month',
        count: 1,
        text: '1m',
      },{
        type: 'month',
        count: 3,
        text: '3m'
      },{
        type: 'month',
        count: 6,
        text: '6m'
      },{
        type: 'ytd',
        text: 'YTD'
      }, {
        type: 'year',
        count: 1,
        text: '1y'
      }, {
        type: 'all',
        text: 'All'
      }],
      selected: 5,
    },

    title: {
      text: ''
    },

    subtitle: {
      text: 'With SMA and Volume by Price technical indicators'
    },

    yAxis: [{
      startOnTick: false,
      endOnTick: false,
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'OHLC'
      },
      height: '60%',
      lineWidth: 2,
      resize: {
        enabled: true
      }
    }, {
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'Volume'
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2
    }],
    //
    // tooltip: {
    //   split: true
    // },

    // plotOptions: {
    //   series: {
    //     dataGrouping: {
    //       units: this.groupingUnits
    //     }
    //   }
    // },

    series: [{
      type: 'candlestick',
      name: '',
      id: 'candle',
      zIndex: 2,
      data: this.ohlc
    }, {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: this.volume,
      yAxis: 1
    }, {
      type: "vbp",
      linkedTo: 'candle',
      params: {
        volumeSeriesID: 'volume'
      },
      dataLabels: {
        enabled: false
      },
      zoneLines: {
        enabled: false
      }
    }, {
      type: 'sma',
      linkedTo: 'candle',
      zIndex: 1,
      marker: {
        enabled: false
      }
    }]
  }

  recommendationOptions:any = {
    chart:{
      type:'column'
    },
    title:{
      text:'Recommendation Trends'
    },
    xAxis: {
      categories:[]//wait update
    },
    yAxis: {
      min: 0,
      title: {
        text: '#Analysis'
      }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true
        }
      },
      series: {
        stacking: "normal"
      }
    },
    series:[]
  }

  epsOptions: any = {
    tooltip:{
      shared:true
    },
    title:{
      text:''
    },
    chart: {
      type: 'spline',
    },
    xAxis: {
      categories: []
    },
    series: [{
      name: 'Actual',
      data: [1]
    },
      {
        name: 'Estimate',
        data: [2]
      }],
    yAxis: {
      title: {
        text: 'Quarterly EPS'
      },
    }
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router:Router,
  ) {}

  ngOnInit(): void {
    console.log('ticker_init:')
    this.cert = Math.random();
    this.alerts = [];
    this.buy_total_price = '0';
    $('#buy_stock').attr('disabled',true);
    $('#sell_stock').attr('disabled',true);

    console.log('ticker: get account')
    this.account = JSON.parse( <string><any>localStorage.getItem('account'));
    this.following = [];

    console.log('ticker: get following')
    this.following = JSON.parse(<string>localStorage.getItem('following'));
    // var tem_following = localStorage.getItem('following');
    // if(tem_following !== null)
    //   this.following = JSON.parse(tem_following)
    // else
    //   localStorage.setItem('following',JSON.stringify([]));

    // console.log('ticker: get curticker')
    // var tem = JSON.parse(<string>localStorage.getItem('curticker'));
    // console.log('curticker',tem);
    // this.cur_ticker = tem;


    // this.route.params.subscribe(data=>this.cur_ticker=data['ticker']);//传给ticker组件的参数
  }

  sub_unsub():void{
    //获取关注列表

    //如果已经关注，则删除，否则添加进去
    if(this.following.includes(this.ticker)){
      this.following.splice(this.following.indexOf(this.ticker),1);
      var tem: Alert = {
        type: 'danger',
        message: this.cur_ticker + ' removed from Watchlist'
      }
      this.alerts = [];
      this.alerts.push(tem);
      setTimeout(() => {
        if (this.alerts.length != 0)
          this.alerts = [];
      }, 5000);
    }
    else{
      // added to Watchlist
      this.following.push(this.ticker);
      var tem: Alert = {
        type: 'success',
        message: this.cur_ticker + ' added to Watchlist'
      }
      this.alerts = [];
      this.alerts.push(tem);
      setTimeout(() => {
        if (this.alerts.length != 0)
          this.alerts = [];
      }, 5000);
    }
    localStorage.setItem('following',JSON.stringify(this.following));
    this.outputFollowing();
    this.ticker_in_following = !this.ticker_in_following;
  }
  update_time():void{
    var date = new Date();
    this.now_time_string=''
    this.now_time_string+=date.getFullYear()+'-'
    this.now_time_string += date.getMonth() + 1 + '-'; //获取当前月份（0——11）
    this.now_time_string += date.getDate() + ' ';
    if(date.getHours()<10)
      this.now_time_string +='0'
    this.now_time_string += date.getHours() + ':';
    if(date.getMinutes()<10)
      this.now_time_string +='0'
    this.now_time_string += date.getMinutes() + ':';
    if(date.getSeconds()<10)
      this.now_time_string +='0'
    this.now_time_string += date.getSeconds();
    this.now_time = date.getTime();
  }
  unix102ymd(stamp:number):string{
    var d = new Date(stamp*1000);
    var ans = "";
    ans+=d.getFullYear()+'-'
    if(d.getMonth()<11)
      ans+='0'
    ans += d.getMonth() + 1 + '-'; //获取当前月份（0——11）
    if(d.getDate()<10)
      ans+='0'
    ans += d.getDate() ;
    return ans;
  }
  get_2year_data(t_start:number,t_end:number,ticker:string,resolution:string):void{
    this.ohlc = [];
    $.getJSON(server_prefix+ "/get_4p2",{'ticker':ticker,'from':t_start,'to':t_end,'resolution':resolution},(result: any)=>{
      // 获取2年四维数据
      console.log(t_start,t_end);
      console.log('chart',result)
      for(var i=0;i<result.c.length;i++){
        this.ohlc.push([result['t'][i]*1000,
          result['o'][i],
          result['h'][i],
          result['l'][i],
          result['c'][i],
        ]);
        this.volume.push([result['t'][i]*1000,
          result['v'][i]
        ]);
      }
      (Object)(this.stockOptions).title.text = ticker + ' Historical';
      (Object)(this.stockOptions).series[0].name = ticker;
      (Object)(this.stockOptions).series[0].data = this.ohlc;
      (Object)(this.stockOptions).series[1].data = this.volume;
      console.log(this.stockOptions);
      this.stockUpdateFlag = true;
      // chart.reflow();
    })
  }
  click_on_Charts(e:any):void{
    // if(this.stockUpdateFlag == false)
    // if(e.index === 2){
    //
    //   // this.stockUpdateFlag = false;
    //   console.log(this.stockOptions);
    //   this.stockUpdateFlag = true;
    // }
      // console.log('update')
      // console.log(e)
  }
  outputFollowing():void{
    var tem_following = localStorage.getItem('following');
    if(tem_following != null)
       console.log(JSON.parse(tem_following));
  }

  open(content:any) {
    this.buy_total_price  = '0.00';
    this.sell_total_price = '0.00';
    this.buy_error_hint   = false;
    this.sell_error_hint  = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
  buy_total_price:string = '0';
  cur_buy_quantity:number = 0;
  get_error_hint_buy(event:any):void{
    if(event.target.value == '')this.cur_buy_quantity=0;
    else this.cur_buy_quantity = parseInt(event.target.value,10);
    this.buy_total_price = (event.target.value * this.tb3.c).toFixed(2);

    if( this.cur_buy_quantity < 1){
      $('#buy_stock').attr('disabled',true);
      this.buy_error_hint = false;
      return;
    }
    if(event.target.value * this.tb3.c > this.account.saving){
      this.error_msg = 'No enough money in wallet!';
      this.buy_error_hint = true;
      // (<HTMLButtonElement>(document.getElementById("buy_stock"))).disabled=true;
      $('#buy_stock').attr('disabled',true);
    }
    else{
      this.error_msg = '';
      this.buy_error_hint = false;
      $('#buy_stock').attr('disabled',false);
    }
  }

  buy_func(event:any){
    this.modalService.dismissAll();
    var ticker = this.cur_ticker;
    var quantity:number = this.cur_buy_quantity;
    this.account.saving -= this.tb3.c*quantity;//扣钱
    if(this.account.own_stock.hasOwnProperty(ticker)){
      this.account.own_stock[ticker].total_cost += this.tb3.c*quantity;//增加总花费
      this.account.own_stock[ticker].quantity +=quantity; // 增加数量
      this.account.own_stock[ticker].avg_cost = this.account.own_stock[ticker].total_cost / this.account.own_stock[ticker].quantity;//计算平均花费
    }
    else{
      this.account.own_stock[ticker]={
        'total_cost': this.tb3.c*quantity,
        'quantity': quantity,
        'avg_cost': this.tb3.c
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


  sell_total_price:string = '0';
  cur_sell_quantity:number = 0;
  get_error_hint_sell(event:any):void{

    if(event.target.value == '') this.cur_sell_quantity=0;
    else this.cur_sell_quantity = parseInt(event.target.value,10);
    this.sell_total_price = (this.cur_sell_quantity * this.tb3.c).toFixed(2);

    if(this.cur_sell_quantity < 1){
      $('#sell_stock').attr('disabled',true);
      this.sell_error_hint = false;
      return;
    }if(this.cur_sell_quantity > this.account.own_stock[this.ticker].quantity){
      this.error_msg = 'You cannot sell the stocks that you don\'t have';
      this.sell_error_hint = true;
      $('#sell_stock').attr('disabled',true);
    }
    else{
      this.error_msg = '';
      this.sell_error_hint = false;
      $('#sell_stock').attr('disabled',false);
    }
  }

  sell_func(event:any):void{
    this.modalService.dismissAll();
    var ticker = this.cur_ticker;
    var quantity:number = this.cur_sell_quantity;
    this.account.saving += this.tb3.c*quantity;//加钱
    if(this.account.own_stock.hasOwnProperty(ticker)){
      this.account.own_stock[ticker].quantity -=quantity;
      this.account.own_stock[ticker].total_cost -= quantity * this.account.own_stock[ticker].avg_cost;
    }
    if(this.account.own_stock[ticker].quantity == 0)
      delete this.account.own_stock[ticker];
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

  interval = setInterval(() =>{
    if(this.Market_state){
      console.log('cert',this.cert)
      this.update_ticker_data_1();
    }
    // clearInterval(interval); //清除定时器
    // console.log("时间到")
  }, 15000);

  update_ticker_data_1():void{
    var ticker = this.ticker;
    $.getJSON(server_prefix + "/get_4p3",{'ticker':ticker},(result: any)=>{
      this.tb3 = result;
      this.Market_state = Math.abs(this.tb3.t * 1000 - this.now_time) <= 5 * 60 * 1000;
      this.update_time();
      var t_end = Math.floor(this.now_time/1000);
      if(!this.Market_state)
        t_end = this.tb3.t;
      // console.log(this.tb3.t)
      // console.log(this.tb3.t1)
      var t_start = t_end - 6*60*60;
      // console.log('from',t_start,'to',t_end);
      (Object)(this.chartOptions).series[0].color=this.tb3.d>0?'#28A745':'#DC3545';
      (Object)(this.chartOptions).series[0].name = this.cur_ticker;
      (Object)(this.chartOptions).title.text = this.cur_ticker + ' Hourly Price Variation';
      $.getJSON(server_prefix + "/get_4p2",{'ticker':ticker,'from':t_start,'to':t_end,'resolution':'5'},(result: any)=>{
        this.tb2 = result;
        // console.log('4p2:',result)
        var data = [];
        for(var i=0;i<result.c.length;i++){
          var tem = [];
          tem = [(result['t'][i] -7*3600)*1000, result['c'][i]];
          data.push(tem);
        }
        (Object)(this.chartOptions).series[0].data = data;
        // console.log(data);
        // console.log(this.chartOptions)
        this.updateFlag = true;
      })
    });
  }

  update_ticker_data():void{
    var ticker = this.ticker;
    console.log('update_ticker_data')
    $.getJSON(server_prefix + "/get_4p3",{'ticker':ticker},(result: any)=>{
      // AppComponent.tb3 = result;
      console.log('4p3:',result)
      this.tb3 = result;
      this.Market_state = Math.abs(this.tb3.t * 1000 - this.now_time) <= 5 * 60 * 1000;
      var t_end = Math.floor(this.now_time/1000);
      if(!this.Market_state)
        t_end = this.tb3.t;
      // console.log(this.tb3.t)
      // console.log(this.tb3.t1)
      var t_start = t_end - 6*60*60;
      // console.log('from',t_start,'to',t_end);
      (Object)(this.chartOptions).series[0].color=this.tb3.d>0?'#28A745':'#DC3545';
      (Object)(this.chartOptions).series[0].name = this.cur_ticker;
      (Object)(this.chartOptions).title.text = this.cur_ticker + ' Hourly Price Variation';
      $.getJSON(server_prefix + "/get_4p2",{'ticker':ticker,'from':t_start,'to':t_end,'resolution':'5'},(result: any)=>{
        this.tb2 = result;
        // console.log('4p2:',result)
        var data = [];
        for(var i=0;i<result.c.length;i++){
          var tem = [];
          tem = [(result['t'][i] -7*3600)*1000, result['c'][i]];
          data.push(tem);
        }
        (Object)(this.chartOptions).series[0].data = data;
        // console.log(data);
        // console.log(this.chartOptions)
        this.updateFlag = true;
      })
      t_end = Math.round(this.now_time/1000)
      t_start = t_end - 2*365*24*60*60;
      // console.log('kaishi',t_start)
      // console.log ('jieshu',t_end)
      // console.log('ok')
      this.get_2year_data(t_start,t_end,ticker,'D');
      // console.log('ok2')
    })
    $.getJSON(server_prefix + "/get_4p6",{'ticker':ticker},(result: any)=> {
      this.tb6 = result;
      // console.log('4p6',result);
      var xA:any = [];
      for(var i=0;i<this.tb6.length;i++)
        xA.push((this.tb6[i].period).substring(0,7))
      console.log('xA',xA)
      this.recommendationOptions.xAxis.categories = xA;
      var item_name = ['Strong Buy','Buy','Hold','Sell','Strong Sell'];
      var varable_name = ['strongBuy','buy','hold','sell','strongSell'];
      var temp:any = [];
      this.recommendationOptions.series = [];
      var color = ['#176F37','#1DB954','#B98B1D','#F45B5B','#813131']
      for(var i=0;i<5;i++){
        var json:any ={
          'name':'',
          data:temp,
          color:color[i]
        };
        json.data=[];
        json.name=item_name[i];
        for(var j=0;j<this.tb6.length;j++){
          if(i==0)json.data.push(this.tb6[j].strongBuy);
          if(i==1)json.data.push(this.tb6[j].buy);
          if(i==2)json.data.push(this.tb6[j].hold);
          if(i==3)json.data.push(this.tb6[j].sell);
          if(i==4)json.data.push(this.tb6[j].strongSell);
        }
        this.recommendationOptions.series.push(json);
      }
      // console.log('recommendationOptions',this.recommendationOptions);
      this.recommendationUpdateFlag = true;
    });
    $.getJSON(server_prefix + "/get_4p9",{'ticker':ticker},(result: any)=> {
      this.tb9 = result;
      // console.log('4p9:', result);
      this.epsOptions.title.text = "Historical EPS Surprises";
      this.epsOptions.series[0].data   = [];
      this.epsOptions.series[1].data   = [];
      this.epsOptions.xAxis.categories = [];
      for(var i=0;i<this.tb9.length;i++){
        this.epsOptions.series[0].data.push(this.tb9[i].actual);
        this.epsOptions.series[1].data.push(this.tb9[i].estimate);
        this.epsOptions.xAxis.categories.push(this.tb9[i].period + '<br>Surprise: ' + this.tb9[i].surprise)

      }
      this.epsUpdateFlag = true;
    })
    $.getJSON(server_prefix + "/get_4p7",{'ticker':ticker,'from':"2022-01-01"},(result: any)=> {
      this.tb7 = result;
      // console.log('4p7:', result)
      this.displayedColumns = [];
      this.displayedColumns = ['summaryName', 'Reddit', 'Twitter' ];
      var sentiment_sum = [0,0,0,0,0,0];
      for(var i=0;i<this.tb7.reddit.length;i++){
        sentiment_sum[0] += this.tb7.reddit[i].mention;
        sentiment_sum[1] += this.tb7.reddit[i].positiveMention;
        sentiment_sum[2] += this.tb7.reddit[i].negativeMention;
      }
      for(var i=0;i<this.tb7.twitter.length;i++){
        sentiment_sum[3] += this.tb7.twitter[i].mention;
        sentiment_sum[4] += this.tb7.twitter[i].positiveMention;
        sentiment_sum[5] += this.tb7.twitter[i].negativeMention;
      }

      this.socal_sentiments = [
        {'summaryName': 'Total Mentions', 'Reddit': sentiment_sum[0], 'Twitter': sentiment_sum[3]},
        {'summaryName': 'Positive Mentions', 'Reddit': sentiment_sum[1], 'Twitter': sentiment_sum[4]},
        {'summaryName': 'Negative Mentions', 'Reddit': sentiment_sum[2], 'Twitter': sentiment_sum[5]}
      ];
    })
    $.getJSON(server_prefix + "/get_4p8",{'ticker':ticker},(result: any)=>{
      this.tb8 = result;
      // console.log('4p8:',result)
    })
    var t_end = this.now_time/1000;
    var t_start = t_end - 7*24*60*60;
    var t_end_string = this.unix102ymd(t_end), t_start_string = this.unix102ymd(t_start);
    $.getJSON(server_prefix + "/get_4p5",{'ticker':ticker,'from':t_start_string,'to':t_end_string},(result: any)=>{
      this.tb5 = [];
      console.log('news:',result)
      let news_cnt = 0;
      for(var i=0;i<result.length;i++){
        if(result[i].image=="")
          continue;
        this.tb5.push(result[i]);
        if(++news_cnt == 20)
          break;
      }
      console.log('tb5',this.tb5)

    })
  }

  get_facebook_share(str:string):string{
    return "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(str)+"&amp;src=sdkpreparse";
  }

  close(alert: Alert) {
    this.alerts = [];
  }

  arrow_color(){
    let d:number = this.tb3.d;
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

  ngOnChanges(changes: SimpleChanges) {
    console.log('change',changes)
    // console.log('cur_ticker',this.cur_ticker);
    // if(changes['cur_ticker']){
    //   this.ngOnInit()
    //   console.log('set cur_ticker:',changes['cur_ticker'].currentValue);
    //   this.cur_ticker = changes['cur_ticker'].currentValue;
    // }
    // if(changes['valid_ticker']){
    //   console.log(changes['valid_ticker'])
    // }
    // changes.prop contains the old and the new value...
  }


  onResize(event:any) {
    console.log(event.target.innerWidth);
  }
  ngAfterViewInit(){
  }


  chartRef1: Highcharts.Chart|any;
  chartRef2: Highcharts.Chart|any;
  chartRef3: Highcharts.Chart|any;
  chartRef4: Highcharts.Chart|any;
  chartCallback1: Highcharts.ChartCallbackFunction = (chart): void => {
    this.chartRef1 = chart;
    setTimeout(() => {
      this.chartRef1.reflow();
      console.log('123onload')
    }, 1000)
  };
  chartCallback2: Highcharts.ChartCallbackFunction = (chart): void => {
    this.chartRef2 = chart;
    setTimeout(() => {
      this.chartRef2.reflow();
      console.log('123onload')
    }, 3000)
  };
  chartCallback3: Highcharts.ChartCallbackFunction = (chart): void => {
    this.chartRef3 = chart;
    setTimeout(() => {
      this.chartRef3.reflow();
      console.log('123onload')
    }, 1)
  };
  chartCallback4: Highcharts.ChartCallbackFunction = (chart): void => {
    this.chartRef4 = chart;
    setTimeout(() => {
      this.chartRef2.reflow();
      console.log('123onload')
    }, 7000)
  };

  buy_check_enter(event:any){
    if(event.key ===('Enter')){
      console.log('buy_func')
      this.buy_func(event);
    }
    return;
  }
  sell_check_enter(event:any){
    if(event.key ===('Enter')){
      console.log('sell_func')
      this.sell_func(event);
    }
    return;
  }
  turnToPeer(peer:string){
    this.router.navigateByUrl('/search/'+peer);
  }
}
