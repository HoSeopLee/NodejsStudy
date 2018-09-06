// var fs = require("fs");

// var data = fs.readFileSync('input.txt');

// console.log(data.toString());
// console.log("adfadfasfasdf");
// //callback 

// var fs = require("fs");

// fs.readFile('input.txt',function(err,data){
//     if(err) return console.error(err);
//     console.log(data.toString());
// });
// //파일을 읽어오는걸 기다리지 않고 그다음 실행문을 실행 시킨다.
// //만약 읽어오는 파일보다 다음 실행문이 읽어오는 파일보다 실행 시간이 길어지면 먼저 호출된다.
// console.log('잘하셨습니다.');

/*
//events 모듈 사용
var events = require('events');
//EventEmitter 객체 생성
var eventEmitter = new events.EventEmitter();

//event와 EventHandler를 연동 (bind)
//eventName 은 임의로 설정가능
// eventEmitter.on('eventName', eventHandler);
// eventEmitter.emit('eventName');

var connectHandler = function connected(){
    console.log("Connection Successful");

    //data_recevied 이벤트 발생 시키기
    eventEmitter.emit("data_received");
}
//connection 이벤트와 connectHandler 에빈트 핸들러를 연동
eventEmitter.on('connection',connectHandler);

//data_received 이벤트와 익명 함수와 연동
// 함수를 변수안에 담는 대신에 .on()메소드의 인자로 직접 함수를 전달
eventEmitter.on('data_received', function(){
    console.log("Data Received");
});

//connection 이벤트 발생시키기
eventEmitter.emit('connection');
console.log("Program has ended");
*/
// module.exports = function(app)
// {
//      app.get('/',function(req,res){
//         res.render('index.html')
//      });
//      app.get('/about',function(req,res){
//         res.render('about.html');
//     });
// }
module.exports = function(app, fs)
{

     app.get('/',function(req,res){
        var sess = req.session;


        res.render('index', {
            title: "MY HOMEPAGE",
            length: 5,
            name: sess.name,
            username: sess.username
        })
    });


    app.get('/list', function (req, res) {
       fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
       });
    });

    app.get('/getUser/:username', function(req, res){
        fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
             var users = JSON.parse(data);
             res.json(users[req.params.username]);
        });
     });


     app.post('/addUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }
            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });

    app.delete('/deleteUser/:username', function(req, res){
        var result = { };
        //LOAD DATA 데이터를 읽어라
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND 없다면? 다르면 ?
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username];
            fs.writeFile(__dirname + "/../data/user.json",JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            })
        })
    });

    app.get('/login/:username/:password', function(req, res){
        var sess;
        sess = req.session;

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};
            if(!users[username]){
                // USERNAME NOT FOUND 못읽는다 ? 비슷하다 
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if(users[username]["password"] == password){
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);

            }else{
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        })
    });
    app.get('/logout', function(req, res){
        sess = req.session;
        if(sess.username){
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            })
        }else{
            res.redirect('/');
        }
    })
    
}