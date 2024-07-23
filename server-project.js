var express=require("express");
var mysql2=require("mysql2");
var fileuploader=require("express-fileupload");
const http=require("http");
const nodemailer=require("nodemailer");
let app=express();
app.listen(2005,function()
{
    console.log("Server started");
})
app.use(express.static("public"));
app.use(express.urlencoded("true"));
app.use(fileuploader());
let config={
    host:"127.0.0.1",
    user:"root",
    password:"#mycomputer@123",
    database:"project",
    dateStrings:true
}
var mysql=mysql2.createConnection(config);
mysql.connect(function(err){
    if(err==null)
        console.log("Database connected successfully");
    else
    console.log(err.message);
})
app.get("/",function(req,resp)
{
    let path=__dirname+"/public/index.html";
    resp.sendFile(path);
})
app.get("/insert-user-details",function(req,resp)
{
    console.log(req.query);
    mysql.query("insert into users values(?,?,?,?)",[req.query.txtemail,req.query.txtpwd,req.query.select,1],function(err){
        if(err==null)
            resp.send("Inserted successfully");
        else
        resp.send(err.message);
    })
})
app.get("/login-process",function(req,resp)
{
    console.log(req.query);
    mysql.query("select * from users where email=? and pwd=?",[req.query.email,req.query.pwd],function(err,result){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        if(result.length==0){
            resp.send("Invalid ID or password");
            return;
        }
        if(result[0].status==1){
            resp.send(result[0].utype);
            return;
        }
        else{
            resp.send("Blocked");
            return;
        }
    })
})
app.get("/infl-dash",function(req,resp)
{
    let path=__dirname+"/public/infl-dash.html";
    resp.sendFile(path);
})
app.get("/inf-profile",function(req,resp)
{
    let path=__dirname+"/public/inf-profile.html";
    resp.sendFile(path);
})
app.post("/save-profile",function(req,resp)
{
    let fileName="";
    if(req.files!=null)
    {
        fileName=req.files.ippic.name;
        let path=__dirname+"/public/uploads/"+fileName;
        req.files.ippic.mv(path);
    }
    else
    fileName="nopic.jpg";

    iemail=req.body.iemail;
    inames=req.body.inames;
    igender=req.body.igender;
    idob=req.body.idob;
    iaddress=req.body.iaddress;
    icity=req.body.icity;
    icontact=req.body.icontact;
    ifield=req.body.ifield;
    iinsta=req.body.iinsta;
    ifb=req.body.ifb;
    iyt=req.body.iyt;
    iinfo=req.body.iinfo;
    ipwd=req.body.ipwd;
    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[iemail,inames,igender,idob,iaddress,icity,icontact,ifield.toString(),iinsta,ifb,iyt,iinfo,fileName,ipwd],function(err){
        if(err==null)
            resp.send("Congratulations");
        else
        resp.send(err.message);
    })
})
app.post("/update-profile",function(req,resp)
{
    console.log(req.body);
    let fileName="";
    if(req.files!=null){
        fileName=req.files.ippic.name;
        let path=__dirname+"/public/uploads/"+fileName;
        req.files.ippic.mv(path);
    }
    else
    fileName=req.body.hdn;

    iemail=req.body.iemail;
    inames=req.body.inames;
    igender=req.body.igender;
    idob=req.body.idob;
    iaddress=req.body.iaddress;
    icity=req.body.icity;
    icontact=req.body.icontact;
    ifield=req.body.ifield;
    iinsta=req.body.iinsta;
    ifb=req.body.ifb;
    iyt=req.body.iyt;
    iinfo=req.body.iinfo;
    ipwd=req.body.ipwd;
    mysql.query("update iprofile set iname=?,gender=?,dob=?,address=?,city=?,contact=?,fields=?,insta=?,fb=?,youtube=?,others=?,picpath=?,pwd=? where email=?",[inames,igender,idob,iaddress,icity,icontact,ifield,iinsta,ifb,iyt,iinfo,fileName,ipwd,iemail],function(err,result){
        if(err==null){
            if(result.affectedRows>=1)
                resp.send("Updated");
            else
            resp.send("Invalid email ID");
        }
        else
        resp.send(err.message);
    })
})
app.get("/search-profile",function(req,resp)
{
    let email=req.query.iemail;
    mysql.query("select * from iprofile where email=?",[email],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    })
})
app.get("/save-booking",function(req,resp)
{
    console.log(req.query);
    mysql.query("insert into events values(null,?,?,?,?,?,?)",[req.query.bemail,req.query.btitle,req.query.bdate,req.query.btime,req.query.bcity,req.query.bvenue],function(err){
        if(err==null)
            resp.send("Saved successfully");
        else
        resp.send(err.message);
    })
})
app.get("/update-setting",function(req,resp){
    console.log(req.query);
    mysql.query("Update users set pwd =? where email =?",[req.query.txtNew,req.query.txtemail],function(err,result){
        if(err==null){
            if(result.affectedRows>=1)
                resp.send("Updated");
            else
            resp.send("Invalid email ID");
        }
        else
        resp.send(err.message);
    }) 
})
var mail;
app.get("/forgot-pwd",function(req,resp)
{
    console.log(req.query);
    let retPwd;
    mail=req.query.mail;
    mysql.query("select pwd from users where email=?",[req.query.mail],function(err,result){
        if(err==null)
        {
            console.log(result[0].pwd);
            retPwd=result[0].pwd;
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "mehakmeenkaur@gmail.com",
                    pass: 'ydqd txll xnyq pjgq'
                }
            });
            var mailOptions = {
                from: 'mehakmeenkaur.com',
                to: req.query.mail,
                subject: 'Sending Email using Node.js',
                html: "Thank you For placing your order <br>Visit again "+retPwd,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            resp.send("password retrieved");
        }
        else
        resp.send(err.message);      
    })
})
app.get("/admin-dash",function(req,resp)
{
    let path=__dirname+"/public/admin-dash.html";
    resp.sendFile(path);
})
app.get("/admin-users",function(req,resp)
{
    let path=__dirname+"/public/admin-users.html";
    resp.sendFile(path);
})
app.get("/fetch-all",function(req,resp)
{
    mysql.query("select * from users",function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/del-one",function(req,resp)
{
    mysql.query("delete from users where email=?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
         resp.send("Deleted");
    })
})
app.get("/all-influ",function(req,resp)
{
    let path=__dirname+"/public/all-influ.html";
    resp.sendFile(path);
})
app.get("/show-all",function(req,resp)
{
    mysql.query("select * from iprofile",function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/block-one",function(req,resp){
    console.log(req.query);
    mysql.query("Update users set status=? where email =?",[0,req.query.email],function(err,result){
        if(err==null){
            if(result.affectedRows>=1)
                resp.send("Blocked");
            else
            resp.send("Invalid email ID");
        }
        else
        resp.send(err.message);
    }) 
})
app.get("/resume-one",function(req,resp){
    console.log(req.query);
    mysql.query("Update users set status=? where email =?",[1,req.query.email],function(err,result){
        if(err==null){
            if(result.affectedRows>=1)
                resp.send("Unblocked");
            else
            resp.send("Invalid email ID");
        }
        else
        resp.send(err.message);
    }) 
})
app.get("/influ-finder",function(req,resp)
{
    let path=__dirname+"/public/influ-finder.html";
    resp.sendFile(path);
})
app.get("/find-influ",function(req,resp)
{
    mysql.query("select * from iprofile where fields like ?",["%"+req.query.fields+"%"],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/do-find",function(req,resp)
{
    mysql.query("select * from iprofile where fields like ? && city=?",["%"+req.query.fields+"%",req.query.city],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);  
    })
})
app.get("/do-findbyiname",function(req,resp){
    console.log("heyy");
    mysql.query("select*from iprofile where iname like ?",["%"+req.query.iname+"%"],function(err,resultJsonAry){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/fetch-event",function(req,resp)
{
    mysql.query("select * from events where doe>=current_date()",function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/events-manager",function(req,resp)
{
    let path=__dirname+"/public/events-manager.html";
    resp.sendFile(path);
})
app.get("/del-one-event",function(req,resp)
{
    mysql.query("delete from events where email=?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
         resp.send("Deleted");
    })
})
app.get("/client-profile",function(req,resp)
{
    let path=__dirname+"/public/client-profile.html";
    resp.sendFile(path);
})
app.get("/save-client",function(req,resp)
{
    cemail=req.query.cemail;
    cname=req.query.cname;
    ccity=req.query.ccity;
    ccontact=req.query.ccontact;
    corg=req.query.corg;
    mysql.query("insert into cprofile values(?,?,?,?,?)",[cemail,cname,ccity,ccontact,corg],function(err){
        if(err==null)
            resp.send("Congratulations");
        else
        resp.send(err.message);
    })
})
app.get("/update-client",function(req,resp)
{
    cemail=req.query.cemail;
    cname=req.query.cname;
    ccity=req.query.ccity;
    ccontact=req.query.ccontact;
    corg=req.query.corg;
    mysql.query("update cprofile set cname=?,city=?,contact=?,org=? where email=?",[cname,ccity,ccontact,corg,cemail],function(err,result){
        if(err==null){
            if(result.affectedRows>=1)
                resp.send("Updated");
            else
            resp.send("Invalid email ID");
        }
        else
        resp.send(err.message);
    })
})
app.get("/search-client",function(req,resp)
{
    let cemail=req.query.cemail;
    mysql.query("select * from cprofile where email=?",[cemail],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    })
})
app.get("/client-dash",function(req,resp)
{
    let path=__dirname+"/public/client-dash.html";
    resp.sendFile(path);
})