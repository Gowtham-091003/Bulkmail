const express=require("express")
const cors=require("cors")
const app=express()
const nodemailer=require("nodemailer")
const mongoose=require("mongoose")
require("dotenv").config();

app.use(express.json())
app.use(cors())

// Connecting backend server with the database.
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Creating models to acces the datas from the database:
const credential = mongoose.model("credential",{},"bulkmail")
credential.find().then(function(data) {
    console.log(data)
}).catch(function(error) {
    console.log(error)
})

// CREATING AN API:
app.post("/sendmail", (req, res) => {

    var message = req.body.msg
    var emaillists = req.body.emaillists

credential.find().then((item)=> {
    console.log("Using email:", item[0].toJSON().user)
    console.log("Password length:", item[0].toJSON().pass.length)
// PAVING A WAY TO SEND:
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:item[0].toJSON().user,
        pass:item[0].toJSON().pass
    }
})
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "pesid983@gmail.com",
//         pass: "yomvzuqhaqfnkayu"
//     }
// });

transporter.verify((error, success) => {
    if (error) {
        console.log("Gmail authentication failed");
        console.log(error);
    } else {
        console.log("Gmail authentication successful");
    }
});
    new Promise(async function(resolve, reject) {

        try {

            for (i = 0; i < emaillists.length; i++) {

                await transporter.sendMail({
                    from: "ganeshgowtham983@gmail.com",
                    to: emaillists[i],
                    subject: "A message from Gowtham",
                    text: message
                })

            }

            resolve("success")

        }

        catch (error) {

            reject("failed")
            console.log(error)
        }

    }).then(function() {
        res.send(true)
    }).catch(function(error) {
        console.log(error)
        res.send(false)
    })
})
.catch((error)=> {
    console.log(error)
})

})

app.listen(5000,()=> {
    console.log("Server started")
})