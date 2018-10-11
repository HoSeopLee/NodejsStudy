var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');


var mySqlClient = mysql.createConnection({
	host : 'localhost',
    user : 'root',  //유저 이름은 root 패스워드는 지정이 안되어잇어서안해줘도 된다
    password : '',
    port : 3306 , //MYSQL은 포트 번호가 3306 이다.
    database : 'my_db'
});

//로그인 세션 구현
app.use(session({
	secret: '!$%^&@!^&&(!^$(*&!#@(*$#&@(!*#',
	resave : false,
	saveUninitialized:true
}));

var app = express();
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//나타내기
app.get( '/', function(req, res){
	
	fs.readFile('list.html', 'utf8', function(error, data){
		if(error){
			console.log('readFile Error');
		}
		else{	
			mySqlClient.query('select * from persons2', function(error, results){
				if(error){
					console.log('error : ', error.message);
				}else{
					res.send( ejs.render(data, {
						prodList : results
					}));
				}
			});
		}
	})
});
//검색 기능
app.post('/read',function(req,res){
	var body= req.body;
	console.log(body);
	fs.readFile('list.html', 'utf8', function(error, data){
		if(body.sel === 'age'){
			mySqlClient.query('select * from persons2 where age LIKE "%"?"%"',
			[body.con],function(error, results){
				if(error){
					console.log('error : ', error.message);
				}else{
					console.log(body.age);
					res.send( ejs.render(data, {
						prodList : results
					}));
				}
			});
		}else if(body.sel ==='id'){
			mySqlClient.query('select * from persons2 where id LIKE "%"?"%"',
			[body.con],function(error, results){
				if(error){
					console.log('error : ', error.message);
				}else{
					console.log(body.id);
					res.send( ejs.render(data, {
						prodList : results
					}));
				}
			});
		}else if (body.sel === 'name'){
			mySqlClient.query('select * from persons2 where name LIKE "%"?"%"',
			[body.con],function(error, results){
				if(error){
					console.log('error : ', error.message);
				}else{
					console.log(body.id);
					res.send( ejs.render(data, {
						prodList : results
					}));
				}
			});
		}
	})
})

//삭제(ID 기본키를 찾아서 그 대상을 삭제 )
app.get('/delete/:id', function(req, res){
	mySqlClient.query('delete from persons2 where id = ?', [req.params.id], 
			function(error, result){
				if(error){
					console.log('delete Error');
				}else{
					console.log('delete id = %d', req.params.id);
					res.redirect('/');				
				}
			});
});


//데이터 삽입
app.get('/insert', function(req, res){
	fs.readFile('insert.html', 'utf8', function(error, data){
		if(error){
			console.log('readFile Error');
		}else{
			res.send(data);
		}
	})
});
//수정할 데이터 읽어 오기
app.get( '/edit/:id', function(req, res){
	fs.readFile( 'edit.html', 'utf8', function(error, data){
		mySqlClient.query('select * from persons2 where id = ?', [req.params.id], 
				function(error, result){
					if(error){
						console.log('readFile Error');
					}else{
						res.send( ejs.render(data, { 
							product : result[0] 
						}));
					}
				});
	});
});

app.get( '/viewContents/:id', function(req, res){
	fs.readFile( 'viewContents.html', 'utf8', function(error, data){
		mySqlClient.query('select * from persons2 where id = ?', [req.params.id], 
				function(error, result){
					if(error){
						console.log('readFile Error');
					}else{
						res.send( ejs.render(data, { 
							product : result[0] 
						}));
					}
				});
	});
});
//데이터 삽입
app.post( '/insert', function(req, res){
	var body = req.body;
	
	mySqlClient.query( 'insert into persons2(name, age, contents) values(?, ?, ?)',
			[ body.name, body.age, body.contents], 
			function(error, result){
				if(error){
					console.log('insert error : ', error.message );
				}else{
					res.redirect('/');
				}
	});
});

//읽어온 데이터를 수정 할 값으로 변경하여 저장
app.post( '/edit/:id', function(req, res){
	// 변수를 선언합니다.
    var body = req.body;
    // 데이터베이스 쿼리를 실행합니다.
    mySqlClient.query('update persons2 SET name=?, age=?, contents=? WHERE id=?'
		, [body.name, body.age, body.contents, body.id], 
			function(error, result){
				if(error){
					console.log('update error : ', error.message );
				}else{
					res.redirect('/');
				}
    });
});


app.post( '/viewContents/:id', function(req, res){
	// 변수를 선언합니다.
    var body = req.body;
    // 데이터베이스 쿼리를 실행합니다.
    mySqlClient.query('update persons2 SET name=?, age=?, contents=? WHERE id=?'
		, [body.name, body.age, body.contents ,body.id ], 
			function(error, result){
				if(error){
					console.log('update error : ', error.message );
				}else{
					res.redirect('/');
				}
    });
});


//회원가입 
app.get('/signup', function(req, res){

	fs.readFile('signup.html', 'utf8', function(error, data){
		if(error){
			console.log('readFile Error');
		}else{
			res.send(data);
		}
	})
});
//회원가입 정보 DB에 입력
app.post( '/signup', function(req, res){
	var body = req.body;
	mySqlClient.query( 'insert into signup(id, password, name, address) values(?, ?, ?, ?)',
			[ body.id, body.password, body.name, body.address], 
			function(error, result){
				if(error){
					console.log('insert error : ', error.message );
				}else{
					res.redirect('/');
				}
	});
});

//로그인 페이지 확인
app.get('/login', function(req, res){

	fs.readFile('login.html', 'utf8', function(error, data){
		if(error){
			console.log('readFile Error');
		}else{
			res.send(data);
		}
	})
});


//로그인 DB 값비교 하여 로그인 확인 하기 
app.post('/login',function(req,res){
	var body = req.body;
	mySqlClient.query('select * from signup where id =? AND password =?',
	[body.loginID,body.loginPW],
	function(error, results){
		console.log(results);
		if( !results) {
			// 아이디가 틀린거 비밀번호가 틀린거
			console.log("실패");			
		}  else {
			//정상적일때.
			console.log("성공");
		}
		res.send("asd");
	});
});





app.listen(8000,function(){
	console.log('Server running at http://127.0.0.1:8000');
});
