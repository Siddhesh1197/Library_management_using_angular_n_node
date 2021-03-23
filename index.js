var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const https = require('https');
const dbConfig = require('./config/dbConfig.js');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
dbConfig.connectdb();


app.get("/", (req, res)=>{
    res.send("Successful");
})

require('./routes/router.js')(app);
app.listen(9090, ()=>{
    console.log("Server is up and running on port: 9090:::::::")
})