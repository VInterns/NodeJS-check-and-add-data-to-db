const express     = require('express');
const app         = express();
const port        = 3050;
const MongoClient = require('mongodb').MongoClient;
const url         = "mongodb://localhost:27017/nodejsDB";
var bodyParser = require('body-parser')
//communcating with express to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//create variable for db
var ddb = null;

//add data to db
function addData(res) {
  //create array that holds data
  var dataa = [
    {name : "TEST", password:"Test"},
    {name : "TEST1", password:"Test1"},
    {name : "TEST2", password:"Test2"}
  ];
ddb.collection("userss").insertMany(dataa,function(err){
  if (err) throw err;
});
}
//function to test given data to the stored data in the db
function compare(username,password,res){
  //init user status
  var userStatus = null;
  //but data in query format to search in db
  var query = {name : username , password : password};
  //access db to search for the assigned data
  ddb.collection("userss").find(query).toArray(function(err,result){
    if (err) {throw err;};
    //checking for the data serached is it existed or not
    if(typeof result[0] !=='undefined'){
    userStatus = 'Accepted';
    res.send('Welcome => ' +username);}
    else{
      userStatus = 'Rejected';
      res.send('No data fond');
    }
  });
}
app.post('/',function(req,res){
MongoClient.connect(url,function(err,db){
        if(err){ throw err; }
        ddb = db.db("nodejsDB");
        username = req.body.username;
        password = req.body.password;
        console.log(req.body);
        addData(res);
        compare(username,password,res);
        db.close();
      });
});
app.listen(port,()=> console.log(`listening to port: ${port}`))
