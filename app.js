var express    = require('express'),
    http       = require('http'),
    bodyParser = require('body-parser'),
    mongodb    = require('mongodb'),
    app        = express();

var questions, answer;

//app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/view'));
app.use(bodyParser.json());

app.listen(3000);
console.log("server starting....");

//
// MongoDBへの接続
mongodb.MongoClient.connect('mongodb://localhost:27017/mydb',
  function(err, database) {
    questions = database.collection('questions');
    answer = database.collection('answer');
});


//
// トップ画面
app.get('/', function(req, res){
  res.sendfile('/view/index.html');
});

//
//
app.get('/public/:name?', function(req, res){
  if ( req.params.name ) {
    res.sendfile(__dirname + '/public/' + req.params.name + '.js');
  } else {
    res.send('File not found.');
  }
});

//
//
app.get('/view/:name?', function(req, res){
  if ( req.params.name ) {
    res.sendfile(__dirname + '/view/' + req.params.name + '.html');
  } else {
    res.send('File not found.');
  }
});

/* -------------------------------------------------
  質問項目の検索

 --------------------------------------------------- */
app.get('/api/list', function(req, res, next){
  var members;
  questions.find().toArray(function(err, items) {
    console.log('items = ');
    console.log(items);
    res.send(items);
  });
  // console.log(members);
});

/* -------------------------------------------------
  回答データの登録

   クライアント側からコールされたら、MongoDBに値を登録する。
   値はJSON形式の配列で受取り、1レコード分ずつMongoDBの
   saveメソッドをコールする。
 --------------------------------------------------- */
app.post('/api/answer', function(req, res){
  // JSONのsend_objの中身を取得する。
  var answer_val = JSON.parse(req.body['send_obj']);

  for (var i = 0; i < answer_val.length; i++) {
    console.log('answer_val[' + String(i) + '] = ');
    console.log(answer_val[i]);
    answer.save(answer_val[i], function() {});
  }
  res.send('insert');  // この行の意味が・・・？

});
