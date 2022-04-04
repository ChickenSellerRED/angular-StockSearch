//1. 导入express
const express = require('express')
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const {isRequired} = require("nodemon/lib/utils");
const hostname = '127.0.0.1'
//2. 创建web服务器
const server = express()


var finnhub_token = "c844nrqad3ide9hefd90"

// server.use(express.static(process.cwd()+"/dist/my-app/"));
server.use(express.static("./dist/my-app"));

server.get('/', (req, res) => {
    res.status(200).sendFile(process.cwd()+"/dist/my-app/index.html")
});
server.get('', (req, res) => {
  res.status(200).sendFile(process.cwd()+"/dist/my-app/index.html")
});

server.get('/hello', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

server.get('/search', (req, res) => {
    res.status(200).sendFile(process.cwd()+"/dist/my-app/index.html")
});
server.get('/watchlist', (req, res) => {
  res.status(200).sendFile(process.cwd()+"/dist/my-app/index.html")
});
server.get('/portfolio', (req, res) => {
  res.status(200).sendFile(process.cwd()+"/dist/my-app/index.html")
});

server.get('/home', (req, res) => {
  res.status(200).sendFile(process.cwd()+"/dist/my-app/index.html")
});

server.get('/search/home', (req, res) => {
    res.status(200).sendFile(process.cwd()+"../../dist/my-app/index.html")
});
server.get('/search/home2', (req, res) => {
  res.status(200).sendFile("/dist/my-app/index.html")
});

server.get('/search/:ticker', (req, res) => {
    res.status(200).sendFile(process.cwd()+"/dist/my-app/index.html")
});
server.get('/stockInfo_p1', (req, res) => {
    const ticker = req.query['ticker'];
    var json = {
        query_state: "realname"+ticker
    }
    res.send(json);
});
server.get('/get_auto_complete', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");

    const cur_ticker = req.query['cur_ticker'];
    // console.log(cur_ticker)
    var ans = {};
    $.getJSON('https://finnhub.io/api/v1/search',{
        "q":cur_ticker,
        "token":finnhub_token
    },function (result) {
        console.log('ticker:',cur_ticker,'result:',result.length);
        res.send(result)
    })
});

server.get('/verify',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    $.getJSON('https://finnhub.io/api/v1/stock/profile2',{
        "symbol": ticker,
        "token": finnhub_token
    },(result)=>{
        ans = {
            "verify":true
        }
        if(JSON.stringify(result)=='{}')
            ans.verify = false;
        res.send(ans);
    })
});



//获取stock detail第一部分 table4.1
server.get('/get_4p1',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    $.getJSON('https://finnhub.io/api/v1/stock/profile2',{
        "symbol": ticker,
        "token": finnhub_token
    },(result)=>{
        if(JSON.stringify(result)=='{}')
            result['Fakename'] = '1'
        else
            result['Truename'] = '1'
        // console.log('ticker='+ticker+'end')
        // console.log('token',finnhub_token,'result',result,'cert',req.query['cert']);
        res.send(result);

    })
});


//获取table 4.2
server.get('/get_4p2',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    const from = req.query['from'];
    const to = req.query['to'];
    const resolution = req.query['resolution'];
    $.getJSON('https://finnhub.io/api/v1/stock/candle',{
        "symbol": ticker,
        "resolution": resolution,
        "from":from,
        "to":to,
        "token": finnhub_token
    },(result)=>{
        // console.log(result)
        res.send(result);
    })
});

//获取stock detail第二部分 table4.3
server.get('/get_4p3',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    console.log('4p3:',ticker)
    $.getJSON('https://finnhub.io/api/v1/quote',{
        "symbol": ticker,
        "token": finnhub_token
    },(result)=>{
        console.log(result)
        if(result['t']!=0){
            result['t1']=timeStamp2Time((result['t']-7*3600)*1000);
        }
        res.send(result);
    })
});

//获取table 4.4
server.get('/get_4p4',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    $.getJSON('https://finnhub.io/api/v1/search',{
        "symbol": ticker,
        "token": finnhub_token
    },(result)=>{
        res.send(result);
    })
});

//获取table 4.5
server.get('/get_4p5',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    const from = req.query['from'];
    var to = req.query['to'];
    $.getJSON('https://finnhub.io/api/v1/company-news',{
        "symbol": ticker,
        "from":from,
        "to":to,
        "token": finnhub_token
    },(result)=>{
      // console.log(result)
        for(var i=0;i<result.length;i++)
            result[i]['date'] = timeStamp2Date(result[i]['datetime']*1000);
        res.send(result);
    })
});

//获取table 4.6
server.get('/get_4p6',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    $.getJSON('https://finnhub.io/api/v1/stock/recommendation',{
        "symbol": ticker,
        "token": finnhub_token
    },(result)=>{
        // console.log(result)
        res.send(result);
    })
});

//获取table 4.7

server.get('/get_4p7',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    const from = req.query['from'];
    $.getJSON('https://finnhub.io/api/v1/stock/social-sentiment',{
        "symbol": ticker,
        "from":from,
        "token": finnhub_token
    },(result)=>{
        res.send(result);
    })
});

//获取table 4.8
server.get('/get_4p8',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    $.getJSON('https://finnhub.io/api/v1/stock/peers',{
        "symbol": ticker,
        "token": finnhub_token
    },(result)=>{
        res.send(result);
    })
});

//获取table 4.9
server.get('/get_4p9',(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");  // 允许所有路径跨域
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    const ticker = req.query['ticker'];
    $.getJSON('https://finnhub.io/api/v1/stock/earnings',{
        "symbol": ticker,
        "token": finnhub_token
    },(result)=>{
        // console.log(checkNull4Json(result));
        // console.log(result);
        // res.send(checkNull4Json(result));
        res.send(result);
    })
});
//3. 启动web服务器
// server.listen(3080,hostname=>{
//     console.log('express server running at http://127.0.0.1')
// })
const PORT = parseInt(process.env.PORT) || 3080;
server.listen(PORT,()=>{
  console.log('express server running at http://127.0.0.1')
})

//检查json中的null值
function checkNull4Json(obj) {
    for (var i in obj) {
        var child = obj[i];
        if (child === null)
            obj[i] = "0";
        else if (typeof(child)=="object")
            process(child);
    }
    return obj;
}

function timeStamp2Time(stamp){
    var date = new Date(stamp);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    if(D.length===2)D='0'+D;
    if(h.length===2)h='0'+h;
    if(m.length===2)m='0'+m;
    if(s<10)s='0'+s.toString();
    return (Y+M+D+h+m+s);
}
function timeStamp2Date(stamp){
    var month_list = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var date = new Date(stamp);
    M = date.getMonth();
    D = date.getDate();
    Y = date.getFullYear();
    // console.log(stamp)
    // console.log(M,D,Y)
    return month_list[M] + " " + D + ", "+Y;
}
