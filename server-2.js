var express= require("express");

var app=express();

app.listen(2003,function(){
    console.log("Server Started");
});

app.get("/hello",function(req,resp)
{
        resp.contentType("text/html");
        resp.write("Hello<br>");
        resp.write("Hi<br>");
        resp.write("Bye<br>");
        resp.end();
       
})