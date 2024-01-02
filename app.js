const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/signup.html");
});

app.post("/", function(req, res){
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  // console.log(fname, lname, email);

var data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }
  ]
};

const JsonData = JSON.stringify(data);

const url = "https://us10.api.mailchimp.com/3.0/lists/e49da4c5b9";

const options = {
  method: "POST",
  auth: "usman:ccacafb00157be864f9852837719f62e-us10"

}

const request = https.request(url,options, function(response){
  
  response.on("data", function(data){

    if((response.statusCode === 200) && (JSON.parse(data).error_count === 0)){
      res.sendFile(__dirname + "/success.html");
    }
    else if((response.statusCode != 200) || (JSON.parse(data).error_count != 0)){
      // else{
        res.sendFile(__dirname + "/failure.html")
      }
      
      console.log(JSON.parse(data));
  })

}); 

request.write(JsonData);
request.end();

});


app.post("/failure.html", function(req,res){
  res.redirect("/");
})

app.post("/success.html", function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is up and running on port 3000");
});
