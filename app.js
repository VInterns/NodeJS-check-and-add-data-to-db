const express     = require('express');
const app         = express();
const port        = 3050;
const MongoClient = require('mongodb').MongoClient;
const url         = "mongodb://localhost:27017/nodejsDB";
var bodyParser = require('body-parser')
var dataa = [];
var userStatus = null;
//communcating with express to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//create variable for db
var ddb = null;

//add data to db
function addData(dataa,res) {
ddb.collection("userss").insertMany(dataa,function(err){
  if (err) throw err;
  console.log(dataa[0].name); 
  res.send(dataa[0].name +" added to Database");
});
}
//function to test given data to the stored data in the db
function compare(username,password,res){
  var userStatus = null;
  var query = {name : username , password : password};
  ddb.collection("userss").find(query).toArray(function(err,result){
    if (err) {throw err;};
    if(typeof result[0] !=='undefined'){
    res.send('Welcome => ' +username);
  }
    else{
      userStatus = "Rejected";
      res.send("This data dosn't exist");
      }
  });
}
app.post('/',function(req,res){
MongoClient.connect(url,function(err,db){
        if(err){ throw err; }
        ddb = db.db("nodejsDB");
        username = req.body.username;
        password = req.body.password;
        addTodb = req.body.addTodb;
        adminUser = req.body.adminUser;
        adminPassword = req.body.adminPassword

        if(addTodb =='1'){
          if(adminUser == 'Admin' && adminPassword =='Admin'){
          addData([{name :username ,password:password}],res);
        }else{
          res.send("Invalid username or password")
        }
        }
        else{
        compare(username,password,res);
        }
        console.log(req.body);
        db.close();
      });
});
app.listen(port,()=> console.log(`listening to port: ${port}`))
