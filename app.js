// npm install --python=python2.7
require("@tensorflow/tfjs-node");

var express = require("express");
var app = express();
var tf = require("@tensorflow/tfjs");
var model = require("./models/model.json");
var cors = require("cors");

app.use(cors());

app.get("/wildfires", function(req, res) {
    async function run() {
        try {
            const model = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
            const prediction = model.predict(tf.tensor(["CA","63","40.03694444","-121.00583333","9.0","33","1300","33","1730"]));
            console.log("prediction ", prediction);  
        } catch(err) {
            console.log(err);
        }
    }  
    run();
});

app.listen(8080, function(){
	console.log("server app running port 8080");
});

app.get("/wildfire.json", function(req, res) {
    return res.send(model);
});