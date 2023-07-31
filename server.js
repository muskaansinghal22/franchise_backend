var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql");

var app=express();

app.listen(2004,function(){
    console.log("Server Started...");
})
app.use(express.static("public"));
app.use(fileuploader());


//URL Handler
app.get("/fun",function(req,resp)
  {
    //var dir=__dirname;
    var dir=process.cwd();

    var file=__filename;
    console.log(dir+" ,  "+file);
    resp.send(dir+"   ,  "+file);
    /*resp.contentType("text/html");
    resp.write("<center><h3>Signup Here</h3></center>");
    resp.write("<br>Welcome");
    resp.end();
    //resp.send("Signup Here");
    */
 })
 app.get("/signup",function(req,resp)
  {
        resp.sendFile(process.cwd()+"/public/signup.html");
 })
 //========================
 app.get("/login",function(req,resp)
  {
    resp.contentType("text/html");
    resp.write("<center><h3>Login Here</h3></center>");
    resp.write("<br>Welcome");
    resp.end();
    //resp.send("Signup Here");
 })

 app.get("/signup-process",function(req,resp){
        //resp.send("Data Reached");
        var quali="";

        if(req.query.qualib!=undefined)//checked
            quali=req.query.qualib+",";
        
            if(req.query.qualim!=undefined)            
              quali=quali+req.query.qualim;

           if(req.query.qualib==undefined && req.query.qualim==undefined)   
              quali="No Qualification";

            if(quali.endsWith(","))
                quali=quali.substring(0,quali.length-1)  ;

          var city=req.query.comboCity;
        resp.send("Welcome="+req.query.txtEmail+" ,,,,,,  "+req.query.txtPwd+"  Qualification="+quali+" , Occupation="+req.query.occu+" City="+city);
 })

 app.get("/signup-secure",function(req,resp)
 {
       resp.sendFile(process.cwd()+"/public/signup-secure.html");
})
app.get("/",function(req,resp)
{
      resp.sendFile(process.cwd()+"/public/index.html");
})
app.get("/angular",function(req,resp)
{
      resp.sendFile(process.cwd()+"/public/angular.html");
})

app.get("/db-signup",function(req,resp)
{
      resp.sendFile(process.cwd()+"/public/DB-signup.html");
})


app.use(express.urlencoded(true));//binary to object(body) conversion
app.post("/signup-process-secure",function(req,resp)
{
  //resp.send("Data Reached");
  var quali="";

        if(req.body.qualib!=undefined)//checked
            quali=req.body.qualib+",";
        
            if(req.body.qualim!=undefined)            
              quali=quali+req.body.qualim;

           if(req.body.qualib==undefined && req.body.qualim==undefined)   
              quali="No Qualification";

            if(quali.endsWith(","))
                quali=quali.substring(0,quali.length-1)  ;

//---------------File Uploading================
 var fileName="nopic.jpg";
    if(req.files!=null)
      {
        //console.log(process.cwd());
         fileName=req.files.ppic.name;
        var path=process.cwd()+"/public/uploads/"+fileName;
        req.files.ppic.mv(path);
      }

      var city=req.body.comboCity;
      var cities=req.body.listCity.toString();
  resp.send("Welcome="+req.body.txtEmail+" <br>  "+req.body.txtPwd+"<br> Qualification="+quali+"<br> Pic Name="+fileName+"<br>  City="+city+"<br>  Cities="+cities);
  console.log(req.body);
  
})

//-=-------------------------DB Operations-------------------
//================Database Connectivity============
/*var dbConfig={
  host:"127.0.0.1",
  user:"root",
  password:"bce",
  database:"2023-jan",
  dateStrings:true
}*/
var dbConfig={
  host: "bdky7jufzyf77kd4slz6-mysql.services.clever-cloud.com",
  user: "ufwsefowzdk5a2ga",
  password: "b17FxqzJtNCZBMZeZzBU",
  database: "bdky7jufzyf77kd4slz6"
};

var dbCon=mysql.createConnection(dbConfig);
dbCon.connect(function(jasoos){
    if(jasoos==null)
        console.log("Connected Successfulllyyy...");
        else
        console.log(jasoos);
})

app.post("/db-signup-process-secure",function(req,resp)
{
  //---------------File Uploading================
  var fileName="nopic.jpg";
  if(req.files!=null)
   {
     //console.log(process.cwd());
      fileName=req.files.ppic.name;
     var path=process.cwd()+"/public/uploads/"+fileName;
     req.files.ppic.mv(path);
   }
    console.log(req.body);
    //resp.send("   File name="+fileName);

    //saving data in table
    var email=req.body.txtEmail;
    var password=req.body.txtPwd;
    var dob=req.body.dob;

         //fixed                             //same seq. as in table
    dbCon.query("insert into users2023(email,password,picname,dob) values(?,?,?,?)",[email,password,fileName,dob],function(err)
    {
          if(err==null)
            resp.send("Record Saved Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          else
            resp.send(err);
    })
})
//--------------------------------
app.post("/db-delete-process-secure",function(req,resp)
{
     //saving data in table
    var email=req.body.txtEmail;
    

         //fixed                             //same seq. as in table
    dbCon.query("delete from users2023 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

//--------------------------------
app.get("/chk-email",function(req,resp)
{
     //saving data in table
    
    
         //fixed                             //same seq. as in table
    dbCon.query("select * from users2023 where email=?",[req.query.kuchEmail],function(err,resultTable)
    {
          if(err==null)
          {
            if(resultTable.length==1)
              resp.send("Already Taken...");
            else
              resp.send("Available....!!!!");
            }
              else
            resp.send(err);
    })
})
//--------------------------------
app.get("/get-json-record",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select * from users2023 where email=?",[req.query.kuchEmail],function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
//====================================
app.post("/db-update-process-secure",function(req,resp)
{
  //---------------File Uploading================
  var fileName;
  if(req.files!=null)
   {
     //console.log(process.cwd());
      fileName=req.files.ppic.name;
     var path=process.cwd()+"/public/uploads/"+fileName;
     req.files.ppic.mv(path);
   }
   else
   {
    fileName=req.body.hdn;
   }
    console.log(req.body);
    //resp.send("File name="+fileName);

    //saving data in table
    var email=req.body.txtEmail;
    var password=req.body.txtPwd;
    var dob=req.body.dob;

         //fixed                             //same seq. as in table
    dbCon.query("update users2023 set password=?,picname=?,dob=? where email=?",[password,fileName,dob,email],function(err)
      {
          if(err==null)
            resp.send("Record Updated Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          else
            resp.send(err);
    })
})

//--------------------------------
app.get("/get-angular-all-records",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select * from users2023",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})


app.get("/do-angular-delete",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    dbCon.query("delete from users2023 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})


app.get("/get-citiess",function(req,resp)
{
         //fixed                             //same seq. as in table
    dbCon.query("select distinct city from medTableName",function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})


