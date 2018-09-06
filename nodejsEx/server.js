/*var http = require("http");
//모듈을 불러올때 require명령어를 사용한다.
//http모듈을 불러오고 반환되는 http인스턴스를 변수에 저장

http.createServer(function(require,response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("Hello World \n");
}).listen(8081);

console.log("Server running at http://127.0.0.1:8081");
*/
/*
var http = require('http');
var fs = require('fs');
var url = require('url');


// 서버 생성
http.createServer( function (request, response) {  
   // URL 뒤에 있는 디렉토리/파일이름 파싱
   var pathname = url.parse(request.url).pathname;
   
   
   console.log("Request for " + pathname + " received.");
   
   // 파일 이름이 비어있다면 index.html 로 설정
   if(pathname=="/"){
       pathname = "./index.html";
       //경로 잡을때 앞에 .을 붙여줘야된다.
       //폴더 밖에 있는거 잡을때 .. 을 붙인다.
   }
   
   // 파일을 읽기
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         // 페이지를 찾을 수 없음
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else{	
         // 페이지를 찾음	  
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': 'text/html'});	
         
         // 파일을 읽어와서 responseBody 에 작성
         response.write(data.toString());		
      }
      // responseBody 전송
      response.end();
   });   
}).listen(8081);
console.log('Server running at http://127.0.0.1:8081/');*/
//http 모듈 사용 안하고 express 사용

// var express = require('express');
// var app = express();
// var server = app.listen(3000,function(){
//     console.log("Express server has started on port 3000");
// })

// app.get('/',function(request,response){
//     response.send('Hello World')
// })

// module.exports = function(app){
//     app.get('/',function(request,response){
//         response.render('index.html');
//     });
//     app.get('/',function(request,response){
//         response.render('about.html');
//     });
// }

// var express = require('express');
// var app = express();
// var router = require('./router/main')(app);

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

// var server = app.listen(3000, function(){
//     console.log("Express server has started on port 3000")
// });
// app.use(express.static('public'));

//Express 프레임 워크 응용하기

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var session = require('express-session');
var fs = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

app.use(express.static('public'));

app.use(bodyparser.json());

//Express적용
app.use(bodyparser.urlencoded());
app.use(session({
    secret: '!@#!@#$!@$@#!@#$@!#$@',
    resave:false,
    saveUninitialized:true
}));

var router= require('./router/main')(app,fs);

//서버를 맨 나중에 열어주던가 콜백함수로 제어 해야된다.
var server = app.listen(3000,function(){
    console.log('Express server has started on port 3000')
});


