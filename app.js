require('dotenv').config();
const express=require("express")
const mongoose=require("mongoose")
const bodyparser=require("body-parser")
var encrypt = require('mongoose-encryption');

const app=express();
app.set('view engine','ejs')
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/favouritedb")
const favschema=mongoose.Schema({
    username:String,
    password:String,
    movie:String,
    series:String,
    course:String,
    book:String
})

favschema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const favuser=mongoose.model("favuser",favschema)



app.get("/",function(req,res){
    res.render("home")

    })


    

app.post("/login",function(req,res){
res.render("login")
})



app.post("/register",function(req,res){
    res.render("register")
    })

app.post("/",function(req,res){
        res.render("home")
        })

app.post("/newuser",function(req,res){
    const user=req.body.uname;
    const pass=req.body.pass;
    const u1=new favuser({
        username:user,
        password:pass
    })
    u1.save()
    favuser.find({}).then(
        (all)=>{
            console.log("regitser sucess")
            res.render("favourite",{answer:all,username:user,password:pass})
    
        }
    ).catch((err)=>{
        console.log(err)
    })
    })

    app.post("/favourite",function(req,res){
        const user=req.body.uname;
        const pass=req.body.pass;
        favuser.findOne({username:user}).then((resu)=>{
            if(resu.password==pass)
            {
                favuser.find({}).then(
                    (all)=>{
                        console.log("login sucess")
                        
                        res.render("favourite",{answer:all,username:user,password:pass})
                        
                    }
                ).catch((err)=>{
                    console.log(err)
                })
            }
            else
            console.log("please check yourpassword")
            // res.render("login")
        }).catch((err)=>{
            console.log(err)
        })
        })

    app.post("/post",function(req,res){
        const username=req.body.username;
        const password=req.body.password;
        const movie=req.body.mname;
        const series=req.body.sname;
        const course=req.body.cname;
        const book=req.body.bname;
        console.log(movie)
        if(movie==undefined&& series==undefined&&course==undefined&&book==undefined){
            favuser.updateOne({username:username},{ $set: { movie: movie, series: series,course:course,book:book } }).then(
                (all)=>{
                    console.log("inside if")
                    
                    res.render("favourite",{answer:all,username:username,password:password})
                    
                }
            ).catch((err)=>{
                console.log(err)
            })
        }
        else{
            const u1=new favuser({
                username:username,
                password:password,
                movie:movie,
                series:series,
                course:course,
                book:book
              })
              u1.save().then(()=>{
                  favuser.find({}).then(
                      (all)=>{
                          console.log("details printing")
                          
                          res.render("favourite",{answer:all,username:username,password:password})
                          
                      }
                  ).catch((err)=>{
                      console.log(err)
                  })
              }).catch((err)=>{
                  console.log(err)
              })
        }
        
    })

app.listen(3000,function(){
    console.log("server started on part 3000")

})