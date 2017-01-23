/* โหลด Express มาใช้งาน */
var app = require('express')();
var users = require('./user');
var bodyParser = require('body-parser');

var mongojs = require('mongojs');
var db = mongojs('appexpress', ['users']);
db.on('error', function() {
  console.log('we had an error.');
});

/* ใช้ port 7777 หรือจะส่งเข้ามาตอนรัน app ก็ได้ */
var port = process.env.PORT || 7777;

// parse application/json  เอามาเพื่อแก้ให้อ่านข้อมูลใน body ได้
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Routing zone

app.get('/', function (req, res) {
    db.users.count(function (err, result) {
        if (result <= 0) {
            // ถ้าหากไม่มีข้อมูล ให้ insert ข้อมูล ใน user.js ลงไป
            db.users.insert(users.findAll(), function (err, docs) {
                // insert new data
            });
        }
        res.send('<h1>Hello node js</h1>');
    });
});

app.get('/user', function (req, res) {
    db.users.find(function (err, docs) {
        res.json(docs);
    });
});

app.get('/user/:id', function (req, res) {
    var id = parseInt(req.params.id);
    db.users.findOne({ id: id }, function (err, docs) {
        res.json(docs);
    });
});

app.post('/newuser', function (req, res) {
    var json = req.body; // ให้ json เป็นข้อมูลใน body ที่ post มา
    var user = {
        username: json.username,
        name: json.name,
        position: json.position
    };
    // ให้ user รับค่าจาก json

    // insert ข้อมูลลงไปใน database
    db.users.insert(user, function (err, docs) {
        res.send('Add new ' + json.name + ' Completed!');
    });
});

app.listen(port, function () {
    console.log('Starting node.js on port ' + port);
});