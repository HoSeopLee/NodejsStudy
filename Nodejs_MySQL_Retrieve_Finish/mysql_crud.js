var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var mySqlClient = mysql.createConnection({
	host : 'localhost',
    user : 'root',  //유저 이름은 root 패스워드는 지정이 안되어잇어서안해줘도 된다
    password : '',
    port : 3306 , //MYSQL은 포트 번호가 3306 이다.
    database : 'my_db'
});

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
	fs.readFile('list.html', 'utf8', function(error, data){
		mySqlClient.query('select * from persons2 where age LIKE "%"?"%"',
		[body.age],function(error, results){
			if(error){
				console.log('error : ', error.message);
			}else{
				console.log(body.age);
				res.send( ejs.render(data, {
					prodList : results
				}));
			}
		});
	})

})


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



app.get('/insert', function(req, res){
	fs.readFile('insert.html', 'utf8', function(error, data){
		if(error){
			console.log('readFile Error');
		}else{
			res.send(data);
		}
	})
});

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
app.listen(8000,function(){
	console.log('Server running at http://127.0.0.1:8000');
})

// http.createServer(app).listen(8000, function(){
	
// });