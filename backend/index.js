import dotenv from "dotenv";
const mongoose=require("mongoose")
const express=require('express')
const cors=require('cors')

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors());
const nodemailer = require("nodemailer");

//database mangoose
mongoose.connect(MANGO_URI).then(function(){
    console.log('db connected')
}).catch(function(data){
    console.log('failed connected')
    console.log(data)
})

const crediential=mongoose.model('crediential',{},'bulkmail')



app.post('/sendmail',function(req,res){
    var msg=req.body.msg
    var emaillist=req.body.emaillist
    console.log(emaillist)

    crediential.find().then(function(data){
        console.log(data[0].toJSON())
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
              user: data[0].toJSON().user,
              pass: data[0].toJSON().pass,
            },
          });
    
          new Promise(async function(resolve,reject){
            try{
                for (var i=0;i<emaillist.length;i++){
                    await transporter.sendMail(
                        {
                            from:'aswin.s2101@gmail.com',
                            to:emaillist[i],
                            subject:'A message from Bul mail App',
                            text:msg
                        }
                       
                    )
                    console.log('email sent to :'+emaillist[i])
    
                }
                resolve('sucess')
    
            }
            catch(error){
                  reject('failed')
            }
        }).then(function(){
            res.send(true)
            }) .catch(function(){
                res.send(false)
        })
    
        
    }).catch(function(error){
        console.log(error)
    })
    
})

app.listen(process.env.PORT,function(){
    console.log('server started.......')
})