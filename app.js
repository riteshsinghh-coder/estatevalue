
var path= require('path');
var express=require("express");
var request=require("request");
const https=require("https");
const fs=require("fs");
const session=require("express-session");
const passport=require("passport");
const passportLocal=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
var app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const { Http2ServerRequest } = require('http2');
const multer=require("multer");
const router=express.Router();
const { func } = require('assert-plus');
const bycrpt=require('bcrypt');
const { userInfo } = require('os');
const Razorpay=require('razorpay');
const otp =require('otp-generator');
const { ecNormalize } = require('sshpk');
const { Db } = require('mongodb');
const randomstring=require('randomstring');
const cors=require('cors');
const nodemailer=require('nodemailer');
const config=require('./config');

// const accountSid =SK286bea8861fd728ef84d7116f9d807e1;
// const authToken = X6IvgmKoYXXY6D4mGGgOXSp4OFyQ3jTy
// const client = require('twilio')(accountSid, authToken);

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
    secret:"Our little secret.",
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

 

  const sendresetpasswordmail=async(email,token)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"onlyvee10@gmail.com",
                pass:"fseffijmlssaugsh"
            }


        })
        const mailOptions={
            from:config.emailUser,
            to:email,
            subject:'For Reset Password',
            html:'<h1>Hii , please click here to <a href="http://127.0.0.1:3000/api/resetpassword?token='+token+'">Reset </a>your password</h1>'
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
            auth:{
                user:"onlyvee10@gmail.com",
                pass:"fseffijmlssaugsh"
            }


        })
        const mailOptions={
            from:config.emailUser,
            to:email,
            subject:'Email verification',
            html:'<h1>Hii, your otp is '+otp+'</h1>'
        }
        transport.sendMail(mailOptions, function(err, info) {
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
const sendMail=async(email,companyname,phoneno,message,name,email2)=>{
    try{
        let transport=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"onlyvee10@gmail.com",
                pass:"fseffijmlssaugsh"
            }


        })
        const mailOptions={
            from:config.emailUser,
            to:email,
            subject:'Enquiry',
            html:'<p>Hii'+companyname+' ,'+name+' having a question "'+message+'" . <br>'+phoneno+'<br> '+email2+' </p>'
        }
        transport.sendMail(mailOptions, function(err, info) {
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
        // console.log(ac);
        // console.log(hc);
        
        
        res.render("index",{
            HouseCity:hc, ApartmentCity:ac, LandCity:lc, CommercialCity:cc, HouseRegion:hr, ApartmentRegion:ar, LandRegion:lr, CommercialRegion:cr, HouseState:hs, ApartmentState:as, LandState:ls, CommercialState:cs,
        })
        

    })    
    // console.log(house);
    // console.log(land);
    // console.log(apartment);
    // console.log(commercial);
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
    console.log(req.body.transaction, req.body.state, req.body.city, req.body.location, req.body.type);
    
        Property.find({submitcity:req.body.city},function (err, element) {
            if (err){
                console.log(err)
            }
            else{

                
                    var length=element.length;
                    var item=[]
                    element.forEach(docs => {
                        item.push(docs);
                    });
                    res.render("search",{myData:item});
         
            }
        });
    
   
   
})
app.get('/read',function(req,res){

})
app.post('/read',function(req,res){
    if(req.isAuthenticated()){
        var mobile=[];
        var companyname=[];
        var facebook=[];
        var instagram=[];

       
       
        User.findOne({email:req.body.email},function(err,docs){
                mobile.push(docs.mobileno);
        })
        Moredetail.findOne({email:req.body.email }, function (err, docs) {
            if (err){
                console.log(err);
            }
            else{
                companyname.push(docs.companyname);
                facebook.push(docs.facebook);  
                instagram.push(docs.instagram); 
            }

        });
        Property.findOne({_id:req.body._id},function(err,docs){
            if(err){
                console.log(err);
    
            }
            else{
                var image=[];
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
            
                res.render("typesofpayment",{every:docs, image:image, phone:mobile, companyname:companyname, facebook:facebook, instagram:instagram})
            }
        });

   
}else{
 res.redirect("/register");
}
    
})
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
        })
        Moredetail.findOne({email:req.body.email }, function (err, docs) {
            if (err){
                console.log(err);
            }
            else{
                companyname.push(docs.companyname);
              
            }
            sendMail(req.body.email,companyname,mobile,req.body.message,req.body.fname, req.user.username);
            console.log(mobile,companyname);
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
app.get('/register',function(req,res){
    res.render("register");
})
app.get('/login',function(req,res){
    res.render("login");
})

app.post('/register',function(req,res){
   
    const newUser=new User({
        // companyname:req.body.firstname,
        email:req.body.username,
        mobileno:req.body.mobile,

        // password:req.body.password
    })
    const email=req.body.username;
    const me=new User({
        mobileno:req.body.mobile,
        email:email

    })
    me.save();
   
    if(req.body.password==req.body.repeatpassword){
        const pin=otp.generate(6, { upperCaseAlphabets: false, specialChars: false });
        mailverification(email,pin);
        Detail.register({username:req.body.username},req.body.password,function(err,detail){
            if(err){
                console.log(err);
                res.redirect("/register");
            }
            else{
                console.log("done");
                passport.authenticate('local')(req,res, function(){
                    res.render("otp",{pin:pin , email:req.body.username});
                })
            }
        })    
    }   
    else{
        res.send("Password didnot matched with each other");
        return;
    }
})
app.post('/otp',function(req,res){
    if(req.body.mailpin==req.body.verifypin){

        const emailstore=new Moredetail({
            email:req.body.email
        })
        emailstore.save();
        User.findOneAndUpdate({email:req.user.username},{$set:{verification:true}}).exec()
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
            console.log(hc,hs,ac,as);
            res.render("my-profile",{ Item:0,companyname:"" ,email:req.body.email ,address:"", description:"", facebook:"", instagram:"", website:"", HouseCity:hc, ApartmentCity:ac, LandCity:lc, CommercialCity:cc, HouseRegion:hr, ApartmentRegion:ar, LandRegion:lr, CommercialRegion:cr, HouseState:hs, ApartmentState:as, LandState:ls, CommercialState:cs});
        })
        
       
    
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
                res.render('register');
            }
            else{
                res.redirect('/moredetails')
            }
        });

       
               
       

      });
    }
  });

  
});
app.get('/api/resetpassword',function(req,res){
    
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
app.post("/order",(req,res)=>{
    var instance = new Razorpay({
        key_id: 'rzp_test_sAcIf5YjC4R3TX',
        key_secret:'O7RxSXjdxWfTF1rYzlxeRVXB',
    });
    var options= {
        amount: (req.body.amount*100),  
        currency: "INR",
        receipt: "rcpt1"
      };
      instance.orders.create(options,function(err,order){
        console.log(order);
        res.json(order);
      })

})

app.post("/resetpassword",function(req,res){
    const token=req.query.token;
    console.log(token);
    // const password=req.body.password;
    Detail.findOneAndUpdate({token:token},{$set:{password:req.body.password , token:''}}).exec();
    res.redirect("/")
   
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
    
        const currentuser=req.user.username;
       
        
        
        const newRegister= new Property({
            email:currentuser,
            submitprice:req.body.submitprice,
            submitarea:req.body.submitarea,
            submitbedroom:req.body.submitbedrooms,
            submitbathroom:req.body.submitbathrooms,
            submitmessage:req.body.submitmessage,
            submitcity:req.body.submitcity,
            landmark:req.body.landmark,
            submittransaction:req.body.submittransaction,
            submitpropertytype:req.body.submitpropertytype,
            submitregion:req.body.submitregion,
            submitstate:req.body.state,
            image:ig
            
        
        });
       
        console.log(newRegister.image[0]);
        newRegister.save();
        res.redirect("/packgaedetails")

       
       
    }else{
        res.render("login");
    }
   
   

    

})


app.post('/my-profile',function(req,res){
    if(req.isAuthenticated()){
         
        res.render("my-profile");
      
    }else{
        res.redirect("/login");
    }
    
   

});
app.get("/moredetails",function
    (req,res){
        if(req.isAuthenticated()){
            var property=[]
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
    })
        // console.log(ac);
        // console.log(hs,hc,hr);
        Property.find({email:req.user.username},function (err, element) {
                if (err){
                    console.log(err)
                }
                else{
                   
                    element.forEach(docs => {
                        property.push(docs);
                      
        
                    });
                }
            });
            
        
        Moredetail.findOne({email:req.user.username }, function (err, docs) {
            if (err){
                console.log(err);
            }
            else{
                if(property==null){
                    property=0
                }
                // console.log(docs.companyname);

            res.render("my-profile",{Item:property, companyname:docs.companyname ,email:req.user.username ,address:docs.address, description:docs.description, facebook:docs.facebook, instagram:docs.instagram, website:docs.website,  HouseCity:hc, ApartmentCity:ac, LandCity:lc, CommercialCity:cc, HouseRegion:hr, ApartmentRegion:ar, LandRegion:lr, CommercialRegion:cr, HouseState:hs, ApartmentState:as, LandState:ls, CommercialState:cs});
            }

        });
       
    }
})


app.post('/moredetails',function(req,res){
    if(req.isAuthenticated()){
        Moredetail.findOneAndUpdate({email:req.user.username},{$set:{companyname:req.body.name, address:req.body.address, description:req.body.description, instagram:req.body.instagram, website:req.body.website, facebook:req.body.facebook}}).exec()
    //     const moredetail=new Moredetail({
    //         companyname:req.body.name,
    //         email:req.user.username,
    //         address:req.body.address,
    //         description:req.body.description,
    //         instagram:req.body.instagram,
    //         facebook:req.body.facebook,
    //         website:req.body.website
    // }) 
    // moredetail.save();
        res.redirect("/moredetails");
          
    
        
    }else{
        res.redirect("/login");
    }
  
    
   
    
});
app.post('/header',function(req,res){
    if(req.isAuthenticated()){
        res.render("submit-property");
    }else{
        res.redirect("/login");
    }
})
app.get('/estate-details-right-sidebar.html',function(req,res){
    res.sendFile(__dirname+"/estate-details-right-sidebar.html");
})

app.listen (process.env.PORT,function(){
    console.log("server started on port 3000");
})
