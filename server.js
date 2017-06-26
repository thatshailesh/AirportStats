/**
 * Created by shailesh on 25/6/17.
 */
"use strict";
const express = require('express'),
  bodyParser = require('body-parser'),
  router = require('./lib/endpoints/route');

let app = express();

app.set("port", (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => res.json({message: "Welcome to our Aiports Stats App!"}));
app.use("/api", router);


// Starts the app
app.listen(app.get('port'), function () {
  console.log("Server has started and is listening on port: " + app.get('port'));
});

module.exports = app; //for testing

