require('dotenv').config();
var path= require('path');
var express=require("express");
var request=require("request");
const https=require("https");
const fs=require("fs");
const session=require("express-session");
const ejs=require("ejs");
const passport=require("passport");
const url=require("url");
const passportLocal=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
var app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const { Http2ServerRequest } = require('http2');
const multer=require("multer");
const router=express.Router();
const { func } = require('assert-plus');
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const bycrpt=require('bcrypt');
const { userInfo } = require('os');
const Razorpay=require('razorpay');
const otp =require('otp-generator');
const { ecNormalize } = require('sshpk');
const { Db } = require('mongodb');
const axios=require('axios');

const randomstring=require('randomstring');
const cors=require('cors');
const nodemailer=require('nodemailer');
const config=require('./config');
const { features, send } = require('process');
const { UserBindingPage } = require('twilio/lib/rest/ipMessaging/v2/service/user/userBinding');
const { ConnectAppContext } = require('twilio/lib/rest/api/v2010/account/connectApp');
const { ShortCodeContext } = require('twilio/lib/rest/proxy/v1/service/shortCode');
// const twilio = require('twilio');



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()) ;



// const { stringify } = require('querystring');
app.use(express.static("public"));
var Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/uploads");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"--"+file.originalname);
    },
});

var upload=multer({
    storage:Storage,
    

})
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb+srv://Ritesh:Ritesh143@cluster0.yfty6qr.mongodb.net/newhomesDB" ,{
    useNewUrlParser:true,
    // useFindAndModify: false, 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
},err=>{
    if(err) throw err;
    console.log('Connected to MongoDB!!!')
});

const registerSchema=new mongoose.Schema({
    
    email:String,
    
    password:String,
    token:{
        type:String,
        default:''
    }
  
    // Password:Password

});
const searchSchema=new mongoose.Schema({
    city:Array,
    state:Array,
    land:Array,
    propertytype:String,
})



const userSchema=new mongoose.Schema({
    
    mobileno:String,
    email:String,
    payment:String,
    verification:{type: Boolean, default: false}

   

})
const moredetailsSchema=new mongoose.Schema({
    companyname:String,
    email:String,
    address:String,
    description:String,
    facebook:String,
    instagram:String,   
    website:String,
    profile:String,
    officelatitude:String,
    officelongitude:String,
    phoneno:String

    
})
const propertySchema=new mongoose.Schema({
    email:String,
    submitpropertytype:{
        type:String,
        uppercase:true,
    },
    submittransaction:{
        type:String,
        uppercase:true
    },
    submitprice:String,
    submitarea:String,
    submitbedroom:String,
    submitbathroom:String,
    submitmessage:{
        type:String,
        uppercase:true
    },
    submitcity:{
        type:String,
        uppercase:true
    },
    landmark:{
        type:String,
        uppercase:true
    },
    submitregion:{
        type:String,
        uppercase:true
    },
    submitstate:{
        type:String,
        uppercase:true
    },
    latitude:String,
    longitude:String,
    price:String,
    submitparking:String,
    submitavailability:String,
    date: {
        type: Date,
        default: Date.now()
    },
   
    
    // PropertyLocality:String,
    image:{
        type:Array,
        required:true
    }
    
});

registerSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User", userSchema);
const Detail=new mongoose.model("Detail",registerSchema);
const Property=mongoose.model("Property",propertySchema);
const Moredetail=mongoose.model("Moredetail",moredetailsSchema);
const Searchproperty=mongoose.model("Searchproperty",searchSchema);

passport.use(Detail.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

const verificationotp=async(phn,pinphn)=>{
    try{
  
        const accountSid = process.env.ACCOUNT_SID;
        const authToken = process.env.AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

client.messages
.create({body: 'Hi User your OTP is '+pinphn+'', from: '+15512104179', to: phn})
.then(message => console.log(message.sid));
    }
    catch(error){
        console.log(error);
    }
}

  const sendresetpasswordmail=async(email,token)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }


        })
        const mailOptions={
            from:config.emailUser,
            to:email,
            subject:'For Reset Password',
            html:'<h1>Hii , please click here to <a href="http://localhost:3000/resetpassword?name='+token+'">Reset </a>your password </h1>'
        }
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
        });
    }
    catch(error){
        console.log(error);
    }
}
  const mailverification=async(email,otp)=>{
    
    try{
        console.log(email,otp);
        // let transport = nodemailer.createTransport({
        //     host: 'smtp.mailtrap.io',
        //     port: 2525,
        //     auth: {
        //       user:config.emailUser,
        //       pass:config.emailPassword
        //     }
        //  });
        let transport=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            tls:{rejectUnauthorized: false},
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }


        })
        ejs.renderFile(__dirname +"/views/email.ejs", { email, otp },(err,data)=>{
            if(err){
                console.log(err);
            }
            else{
                var mailOptions={
                    from:config.emailUser,
                    to:email,
                    subject:'Email verification',
                    html:data
                }
                transport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log(info);
                    }
                });
            }
        });
       
        

    }
    catch(error){
        console.log(error);
    }
}
const sendMail=async(email,companyname,phoneno,message,name,email2)=>{
    try{
        let transport=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            tls:{rejectUnauthorized: false} ,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }


        })
        ejs.renderFile(__dirname +"/views/email2.ejs", {email,companyname,phoneno,message,name,email2 },(err,data)=>{
            if(err){
                console.log(err);
            }
            else{
                var mailOptions={
                    from:config.emailUser,
                    to:email,
                    subject:'Enquiry raised',
                    html:data
                }
                transport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log(info);
                    }
                });
            }
        });
       

    }
    catch(error){
        console.log(error);
    }
}
const sendMail1=async(email,companyname,phoneno,message,name,email2)=>{
    try{
        let transport=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            tls:{rejectUnauthorized: false} ,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }


        })
        ejs.renderFile(__dirname +"/views/emailtemplate.ejs", {email,companyname,phoneno,name,email2 },(err,data)=>{
            if(err){
                console.log(err);
            }
            else{
                var mailOptions={
                    from:config.emailUser,
                    to:email,
                    subject:'Enquiry raised',
                    html:data
                }
                transport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log(info);
                    }
                });
            }
        });
       

    }
    catch(error){
        console.log(error);
    }
}


app.get ('/', function(req,res){
    
    // const search=new Searchproperty({
    //     city:"city1",
    //     land:"region1",
    //     state:"state1",
    //     propertytype:"HOUSE"
    // })
    // search.save();
    var hs=[];
    var hc=[];
    var hr=[];
    var ls=[];
    var lc=[];
    var lr=[];
    var as=[];
    var ac=[];
    var ar=[];
    var cs=[];
    var cc=[];
    var cr=[];
    var featured=[];
    var newlisting=[];
    var profile=[];
 
  
   
    // console.log(req);
    Searchproperty.find({},function(err,docs){
        // console.log(docs)
        docs.forEach(element=>{
            if(element.propertytype=="HOUSE"){
                // console.log(element.city);
                hs.push(element.state);
                hc.push(element.city);
                hr.push(element.land);
                

            }
            else if(element.propertytype=="LAND"){
                ls.push(element.state);
                lc.push(element.city);
                lr.push(element.land);
            }
            else if(element.propertytype=="COMMERCIAL"){
                cs.push(element.state);
                cc.push(element.city);
                cr.push(element.land);
            }
            else if(element.propertytype=="APARTMENT"){
                as.push(element.state);
                ac.push(element.city);
                ar.push(element.land);
            }
            else{

            }
            
        })
    
        Property.find({price:"2699"}).sort([['date', -1]]).exec (function(err,element){
            if(element){
            for(var i=0;i<=4;i++){

                featured.push(element[i]);
            }
        }
        Property.find({}).sort([['date', -1]]).exec (function(err,element){
            if(element){
                for(var i=0;i<=6;i++){
                    newlisting.push(element[i]);
                }
           
        }
        Moredetail.find({},function(err,docs){
            if(docs){
                profile.push(docs);
            }
        })
        console.log(featured);
        res.render("index",{
           verify:false, profile:profile, HouseCity:hc, ApartmentCity:ac, LandCity:lc, CommercialCity:cc, HouseRegion:hr, ApartmentRegion:ar, LandRegion:lr, CommercialRegion:cr, HouseState:hs, ApartmentState:as, LandState:ls, CommercialState:cs, featured:featured, newlisting:newlisting
        }) 
        })

           
        })
       
        // console.log(ac);
        // console.log(hc);
        
       
        
        

    })  
    
    
    // console.log(house);
    // console.log(land);
    // console.log(apartment);
    // console.log(commercial);
})
app.get("/facebookadd",function(req,res){
    console.log(req.query.name);
  

        var image=[];
            var companyname=[];
        var facebook=[];
        var instagram=[];
        var mobile=[];
       

      
      
        
        Property.findOne({_id:req.query.name},function(err,docs){
            
        
            if(err){
                console.log(err);
    
            }
            else{
               var emailid=docs.email;
                docs.image.forEach(element=>{
                    image.push(element);
                })
               
                var c=0;
              image.forEach(element=>{
                c=c+1;
              })
                var s=(10-c);
                if(c<=10){
                    while(s--){
                        image.push('No_Image_Available.jpg');
                    }
                    
                }
               
                
            }
            Moredetail.findOne({email:emailid }, function (err, docs1) {
               
                if (err){
                    console.log(err);
                }
                else{   
                    companyname.push(docs1.companyname);
                    facebook.push(docs1.facebook);  
                    instagram.push(docs1.instagram); 
                    User.findOne({email:emailid},function(err,docs2){
                
                        mobile.push(docs2.mobileno);
                      
                            User.findOne({email:emailid},function(err,docs4){
                                sendMail(req.body.email,"Sir",docs4.mobileno," ",docs4.email);
                            })
                            if(req.isAuthenticated()){
                        res.render("typesofpayment",{notsigned:false,every:docs, image:image, phone:mobile, companyname:companyname, facebook:facebook, instagram:instagram});
                            }
                            else{
                                res.render("typesofpayment",{notsigned:true,every:docs, image:image, phone:mobile, companyname:companyname, facebook:facebook, instagram:instagram});
                            }
                       
                    
                })
            
                   
                }
                
            });
            
             
        
            
        });
    
   

    
})
app.get("/readredirect",function(req,res){
        // const search=new Searchproperty({
    //     city:"city1",
    //     land:"region1",
    //     state:"state1",
    //     propertytype:"HOUSE"
    // })
    // search.save();
    var hs=[];
    var hc=[];
    var hr=[];
    var ls=[];
    var lc=[];
    var lr=[];
    var as=[];
    var ac=[];
    var ar=[];
    var cs=[];
    var cc=[];
    var cr=[];
    var featured=[];
    var newlisting=[];
    var profile=[];
    var verify;
 
  
   
    // console.log(req);
    Searchproperty.find({},function(err,docs){
        // console.log(docs)
        docs.forEach(element=>{
            if(element.propertytype=="HOUSE"){
                // console.log(element.city);
                hs.push(element.state);
                hc.push(element.city);
                hr.push(element.land);
                

            }
            else if(element.propertytype=="LAND"){
                ls.push(element.state);
                lc.push(element.city);
                lr.push(element.land);
            }
            else if(element.propertytype=="COMMERCIAL"){
                cs.push(element.state);
                cc.push(element.city);
                cr.push(element.land);
            }
            else if(element.propertytype=="APARTMENT"){
                as.push(element.state);
                ac.push(element.city);
                ar.push(element.land);
            }
            else{

            }
            
        })
    
        Property.find({price:"2699"}).sort([['date', -1]]).exec (function(err,element){
            if(element){
            for(var i=0;i<=4;i++){
                featured.push(element[i]);
            }
        }
        Property.find({}).sort([['date', -1]]).exec (function(err,element){
            if(element){
                for(var i=0;i<=6;i++){
                    newlisting.push(element[i]);
                }
           
        }
        Moredetail.find({},function(err,docs){
            if(docs){
                profile.push(docs);
            }
        })
        if(req.isAuthenticated()){
      
         verify=false;
        }else{
            verify=true;
        }
        
        res.render("index",{
           verify:verify, profile:profile, HouseCity:hc, ApartmentCity:ac, LandCity:lc, CommercialCity:cc, HouseRegion:hr, ApartmentRegion:ar, LandRegion:lr, CommercialRegion:cr, HouseState:hs, ApartmentState:as, LandState:ls, CommercialState:cs, featured:featured, newlisting:newlisting
        }) 
        })

           
        })
       
        // console.log(ac);
        // console.log(hc);
        
       
        
        

    })  
    
})
app.get('/my-profile',function(req,res){
    if(req.isAuthenticated()){
      
        // res.render("my-profile");
    }else{
        res.redirect("/login");
    }
    
});
app.get('/packgaedetails',function(req,res){
    if(req.isAuthenticated()){
        res.render("packgaedetails");
    }else{
        res.redirect("/login");
    }
})
app.get('/search',function(req,res){

})
app.post('/search',function(req,res){
    const transaction=req.body.transaction1;
    var finaltransaction;
    
    if(transaction==undefined){
        res.redirect("/");
    }
    else{
        finaltransaction=transaction.slice(1,transaction.length);
    }
    console.log(req.body.city);
    
    
    if(transaction.toString().charAt(0)=="A"){
        Property.find({submitpropertytype:"APARTMENT"}).sort({price:-1, date:-1}).exec (function (err, element) {
            if (err){
                console.log(err)
            }
            else{
                
                var item=[]
                element.forEach(docs=>{
                    
                    if(docs.submitcity==req.body.city1 && docs.submitstate==req.body.state1){
                        console.log(docs);
                            item.push(docs);
                    }

                    // else{
                    //     res.send("no Upload");
                    // }
                
                })
               
                res.render("search",{myData:item});
               
                  
         
            }
        });
    }
    else if(transaction.toString().charAt(0)=="H"){
        Property.find({submitpropertytype:"HOUSE"},function (err, element) {
            if (err){
                console.log(err)
            }
            else{
                var item=[]
                element.forEach(docs=>{
                    
                    if(docs.submitcity==req.body.city2 && docs.submitstate==req.body.state2){
                            item.push(docs);
                    }
                   
                      
                })
                res.render("search",{myData:item});
              
                
         
            }
        });
    }
    else if(transaction.toString().charAt(0)=="L"){
        Property.find({submitpropertytype:"LAND"},function (err, element) {
            if (err){
                console.log(err)
            }
            else{
                
                var item=[]
                element.forEach(docs=>{
                    
                    if(docs.submitcity==req.body.city3 && docs.submitstate==req.body.state3){
                            item.push(docs);
                    }
                   
                      
                })
                res.render("search",{myData:item});
                
                    
         
            }
        });
    }
    else if(transaction.toString().charAt(0)=="C"){
        Property.find({submitpropertytype:"COMMERCIAL"},function (err, element) {
            if (err){
                console.log(err)
            }
            else{
                var item=[]
                element.forEach(docs=>{
                    
                    if(docs.submitcity==req.body.city4 && docs.submitstate==req.body.state4){
                            item.push(docs);
                    }
                   
                      
                })
                res.render("search",{myData:item});
                
            
                    
         
            }
        });
    }
    else{
        res.send("we are working on it");
    };
   
        
    
});
    
 
    
   
   
app.get('/register',function(req,res){
    res.render("register");
})
app.get('/individual',function(req,res){
    var image=[];
    var companyname=[];
var facebook=[];
var instagram=[];
var mobile=[];
console.log(req.query._id)
console.log(req.query.email)




Property.findOne({_id:req.query._id},function(err,docs){
    

    if(err){
        console.log(err);

    }
    else{
       
        docs.image.forEach(element=>{
            image.push(element);
        })
       
        var c=0;
      image.forEach(element=>{
        c=c+1;
      })
        var s=(10-c);
        if(c<=10){
            while(s--){
                image.push('No_Image_Available.jpg');
            }
            
        }
       
        
    }
    Moredetail.findOne({email:req.query.email }, function (err, docs1) {
       
        if (err){
            console.log(err);
        }
        else{   
            companyname.push(docs1.companyname);
            facebook.push(docs1.facebook);  
            instagram.push(docs1.instagram); 
            User.findOne({email:req.query.email},function(err,docs2){
        
                mobile.push(docs2.mobileno);
              
                    User.findOne({email:req.user.username},function(err,docs4){
                        sendMail(req.body.email,"Sir",docs4.mobileno," ",docs4.email);
                    })
                res.render("typesofpayment",{notsigned:false,every:docs, image:image, phone:mobile, companyname:companyname, facebook:facebook, instagram:instagram});
               
               
            
        })
    
           
        }
        
    });
    
     

    
});
})
app.post('/read',function(req,res){
    if(req.isAuthenticated()){
        var mobile=[];
        var companyname=[];

        User.findOne({email:req.user.username},function(err,docs){
            mobile.push(docs.mobileno);
            // console.log(docs.mobileno);
            Moredetail.findOne({email:req.body.email }, function (err, docs) {
                if (err){
                    console.log(err);
                }
                else{
                    companyname.push(docs.companyname);
                  
                }
                sendMail1(req.body.email,companyname,mobile,req.user.username);
                
            })
        })
        res.redirect('http://localhost:3000/individual?_id='+req.body._id+'&email='+req.body.email+'');
      
    }
    else{
        res.redirect("/readredirect")
    }

});

app.post("/map",function(req,res){
    Property.find({},function(err,docs){
        if(docs){
            res.render("map",{myData:docs});
        }
    })
});

app.get("typesofpayment",function(req,res){
    if(req.isAuthenticated()){
        res.render("typesofpayment");
    }
    else{
        res.render("register");
    }
})
app.post("/sendmail",function(req,res){
   
       
    if(req.isAuthenticated()){
        var mobile=[];
        var companyname=[];

        User.findOne({email:req.user.username},function(err,docs){
            mobile.push(docs.mobileno);
            // console.log(docs.mobileno);
            Moredetail.findOne({email:req.body.email }, function (err, docs) {
                if (err){
                    console.log(err);
                }
                else{
                    companyname.push(docs.companyname);
                  
                }
                sendMail(req.body.email,companyname,mobile,req.body.message,req.body.clientname,req.user.username);
                
            })
        })
       
        res.render("mailsent");
        
      
    }

    
})



app.get('/header',function(req,res){
    if(req.isAuthenticated()){
        res.render("/submit-property");
    }else{
        res.redirect("/login");
    }
   
});

app.get('/login',function(req,res){
    res.redirect("/");
})


app.post('/register',function(req,res){
   
    const newUser=new User({
        // companyname:req.body.firstname,
        email:req.body.username,
        mobileno:req.body.mobile,

        // password:req.body.password
    })
    const countrycode="91";
    const mobileno=req.body.mobile;
    const email=req.body.username;
    var newmobileno;
    const me=new User({
        mobileno:req.body.mobile,
        email:email

    })
    me.save();

    if(mobileno.length==10){
        newmobileno=countrycode.concat(mobileno);
    }
    else{
        newmobileno=mobileno;
    }
    console.log(newmobileno);
        const pinemail=otp.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const pinphn=otp.generate(6, { upperCaseAlphabets: false, specialChars: false });
        mailverification(email,pinemail);
        
        Detail.register({username:req.body.username},req.body.password,function(err,detail){
            if(err){
                console.log(err);
                res.redirect("/register");
            }
            else{
                console.log("done");
                passport.authenticate('local')(req,res, function(){
                    res.render("otp",{pinemail:pinemail , email:req.body.username, pinphn:pinphn, phoneno:req.body.mobile});
                })
            }
        })    
})
app.post('/otp',function(req,res){
    if(req.body.mailpin==req.body.verifypin ){
            const emailstore=new Moredetail({
                email:req.body.email,
                phoneno:req.body.mobile,
                companyname:"",
                address:"",
                description:"",
                facebook:"", 
                instagram:"", 
                website:"",
                image:""

            })
            emailstore.save();
            User.findOneAndUpdate({email:req.user.username},{$set:{verification:true}}).exec();
           
            res.redirect("/readredirect");
            
            
           
        
        
       

    } 
    else{
        res.send("Invalid Otp");
        return;
    }

       
})

app.post('/login',function(req,res){
   const user=new Detail({
    username:req.body.username,
    password:req.body.password
   })

req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
    
      passport.authenticate("local")(req, res, function(){
        Detail.findOne({email:req.user.username }, function (err, docs) {
            if (err){
                // req.flash("User credentails not vaild!!");
                res.send("User credentials not valid!");
            }
            else{
                res.render("submit-property",{notsigned:false});
                
            }
        });


       
               
       

      });
    }
  });


  
});
app.get('/resetpassword',function(req,res){
    
    res.render("request");
});

app.post("/forgetpassword",function(req,res){
    const email=req.body.email;
    const userData= Detail.findOne({email:email});
    // console.log(userData);
    if(userData){
       const randomString=randomstring.generate();
       Detail.findOneAndUpdate({username:email},{$set:{token:randomString}}).exec();
       sendresetpasswordmail(email,randomString);

       res.status(200).send({success:true,msg:"Please check your inbox of"})
    }
    else{
        res.status(200).send({success:true,msg:"this email does not exists"})
    }
})
app.post("/order1",(req,res)=>{
    var instance = new Razorpay({
        key_id:process.env.API_KEY,
        key_secret:process.env.API_SECRET,
    });
    var options= {
        amount: (req.body.amount1*100),  
        currency: "INR",
        receipt: "rcpt1"
      };
      instance.orders.create(options,function(err,order){
        console.log(order);
        res.json(order);
      })

})
// app.post("/order2",(req,res)=>{
//     var instance = new Razorpay({
//         key_id:process.env.API_KEY,
//         key_secret:process.env.API_SECRET,
//     });
//     var options= {
//         amount: (req.body.amount*100),  
//         currency: "INR",
//         receipt: "rcpt1"
//       };
//       instance.orders.create(options,function(err,order){
//         console.log(order);
//         res.json(order);
//       })

// })
// app.post("/order3",(req,res)=>{
//     var instance = new Razorpay({
//         key_id:process.env.API_KEY,
//         key_secret:process.env.API_SECRET,
//     });
//     var options= {
//         amount: (req.body.amount*100),  
//         currency: "INR",
//         receipt: "rcpt1"
//       };
//       instance.orders.create(options,function(err,order){
//         console.log(order);
//         res.json(order);
//       })

// })
app.post("/api/payment/verify",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256',process.env.API_SECRET)
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });
   
 
   

app.post("/resetpassword",function(req,res){
    const token=req.query.name;
    res.json({token:token});
    // console.log(req);
    // console.log(req.params);
    // const password=req.body.password;
    Detail.findOneAndUpdate({token:token},{$set:{password:req.body.password , token:''}}).exec();
    // res.redirect("/")
   
})

// Property.findOne({email:req.user.username }, function (err, prop) {
//     if (err){
//         console.log(err)
//     }
//     else{
//         var c=[]
//         prop.forEach(element=>{
//             c.push(element);
//         })

//         res.render("my-profile",{companyname:docs.companyname, email:docs.email, phone:docs.mobileno});
//     }
// });


app.post('/submit-property',upload.array("myfiles",10),function(req,res){
    var a=req.files;
    var ig=[];
    a.forEach(elment=>{
        ig.push(elment.filename);
    })
    console.log(ig);
    if(req.isAuthenticated()){
        const submitprice=req.body.submitprice;
        
        Moredetail.findOne({email:req.user.username},function(err,docs){
            console.log(docs.companyname, docs.address);
            if(docs.companyname!=undefined && docs.address!==undefined){
                const currentuser=req.user.username;
                const newRegister= new Property({
                    email:currentuser,
                    submitprice:new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(submitprice),
                    submitarea:req.body.submitarea,
                    submitbedroom:req.body.submitbedrooms,
                    submitbathroom:req.body.submitbathrooms,
                    submitmessage:req.body.submitmessage,
                    submitcity:req.body.submitcity,
                    landmark:req.body.landmark,
                    submittransaction:req.body.submittransaction,
                    submitpropertytype:req.body.submitpropertytype,
                    submitregion:req.body.submitregion,
                    submitparking:req.body.submitparking,
                    submitavailability:req.body.submitavailability, 
                    submitstate:req.body.state,
                    latitude:req.body.latitude,
                    longitude:req.body.longitude,
                   
                    image:ig,
                    price:"2699",
                    date:Date.now()
                });
                console.log(newRegister.image[0]);
                newRegister.save();
                User.findOne({email:currentuser},function(err,docs){
                    res.render("packgaedetails",{email:currentuser,phoneno:docs.mobileno});
                })
               
            }
            else{
                res.redirect("/moredetails")
            }
        })
    
       

       
       
    }else{
        res.redirect("/login");
    }
   
   

    

});
app.post("/payroute",function(req,res){
    User.findOne({email:req.body.email},function(err,docs){
        res.render("packgaedetails",{email:req.body.email,phoneno:docs.mobileno});
    })
})
app.get("/agencie",function(req,res){
    if(req.isAuthenticated()){
        Moredetail.find({},function(err,docs){
            if (err){
                console.log(err);
            }
            else{
                var only=[];
                docs.forEach(element=>{
                    console.log(element.
                        address
                        );
                    if(element.address && element.description && element.companyname){
                       only.push(element);
                       
                     }
                    
                    
                })
                console.log(only);
                res.render("agencie",{details:only});
                
                
               
            }
        })
        
    }
    else{
        res.redirect("/readredirect");
    }
    
});

app.post("/trusted",function(req,res){
    console.log(req.body.email);
    Moredetail.findOne({email:req.body.email},function(err,docs){
       
        res.render("trusted-company",{individual:docs});
    })
    
});
app.post("/agencie",function(req,res){
    res.redirect("/agencie");
});

app.post('/my-profile',function(req,res){
    if(req.isAuthenticated()){
         
        res.render("my-profile");
      
    }else{
        res.redirect("/login");
    }
    
   

});
app.post("/myproperty",function
    (req,res){
        if(req.isAuthenticated()){
        Property.find({email:req.user.username},function(err,docs){
            if(docs){
                console.log(docs);
                res.render("editsearch",{myData:docs})
            }
        })

        }
    }
)
app.post("/editread",function(req,res){
    if(req.isAuthenticated()){
        var image=[];
            var companyname=[];
        var facebook=[];
        var instagram=[];
        var mobile=[];

       
    
        Property.findOne({_id:req.body._id},function(err,docs){
            
        
            if(err){
                console.log(err);
    
            }
            else{
               console.log(docs.image);
                docs.image.forEach(element=>{
                    image.push(element);
                })
                var c=0;
              image.forEach(element=>{
                c=c+1;
              })
                var s=(10-c);
                if(c<=10){
                    while(s--){
                        image.push('No_Image_Available.jpg');
                    }
                    
                }
            
                
            }
            console.log(image);
        
            Moredetail.findOne({email:req.body.email }, function (err, docs1) {
               
                if (err){
                    console.log(err);
                }
                else{
                    companyname.push(docs1.companyname);
                    facebook.push(docs1.facebook);  
                    instagram.push(docs1.instagram); 
                }
                User.findOne({email:req.body.email},function(err,docs2){
                    
                    mobile.push(docs2.mobileno);
                    res.render("everyproperty",{every:docs, image:image, phone:mobile, companyname:companyname, facebook:facebook, instagram:instagram})
            });
            });
             
        
            
        });

   
}else{
 res.redirect("/register");
}
    
})
app.post("/blog",function(req,res){
    
    res.render("archive-grid");
})

app.get("/moredetails",function
    (req,res){
        if(req.isAuthenticated()){
            var featuredprofile=[];
           
        Moredetail.findOne({email:req.user.username }, function (err, docs) {
            if (err){
                console.log(err);
            }
            else{
                console.log(docs.companyname);
              
                Property.find({price:"2699"}).sort([['date', -1]]).exec (function(err,element){
                    if(element){
                    for(var i=0;i<=7 ;i++){
                        featuredprofile.push(element[i]);
                    }
                    res.render("my-profile",{featured:featuredprofile, companyname:docs.companyname ,email:req.user.username ,address:docs.address, description:docs.description, facebook:docs.facebook, instagram:docs.instagram, website:docs.website, image:docs.profile });
                }})
                // console.log(featuredprofile);
          
            }

        });
       
    }
})


app.post('/moredetails',upload.single("myfiles"), function(req,res){
    if(req.isAuthenticated()){
        var profile=[];
        if(typeof req.file=='undefined'){
            Moredetail.findOne({email:req.user.username},function(err,docs){
                if(docs){
                    profile.push(docs.profile);
                }
                
            })
           
        }
        else{
            profile.push(req.file.filename);
        }
        
        Moredetail.findOneAndUpdate({email:req.user.username},{$set:{companyname:req.body.name, address:req.body.address, description:req.body.description, instagram:req.body.instagram, website:req.body.website, facebook:req.body.facebook, profile:profile[0], officelatitude:req.body.latitude, officelongitude:req.body.longitude}}).exec();
        res.redirect("/moredetails");    
    }else{
        res.redirect("/login");
    }
  
    
   
    
});
app.post('/header',function(req,res){
    if(req.isAuthenticated()){
        Moredetail.findOne({email:req.user.username},function(err,docs){
            if(docs.companyname!=undefined && docs.address!==undefined){
            res.render("submit-property",{notsigned:false});
            }
            else{
                res.redirect("/moredetails");
            }
        })
    }else{
        res.render("submit-property",{notsigned:true});
    }
})
app.get('/estate-details-right-sidebar.html',function(req,res){
    res.sendFile(__dirname+"/estate-details-right-sidebar.html");
})

app.listen (process.env.PORT || 3000,function(){
    console.log("server started on port 3000");
})
