const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// database mongoose
mongoose.connect(process.env.MANGO_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.log('Failed to connect', err));

const crediential = mongoose.model('crediential', {}, 'bulkmail');

app.post('/sendmail', function(req, res) {
  var msg = req.body.msg;
  var emaillist = req.body.emaillist;
  console.log(emaillist);

  crediential.find().then(function(data) {
    console.log(data[0].toJSON());
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    new Promise(async function(resolve, reject) {
      try {
        for (var i = 0; i < emaillist.length; i++) {
          await transporter.sendMail({
            from: 'aswin.s2101@gmail.com',
            to: emaillist[i],
            subject: 'A message from Bulk Mail App',
            text: msg
          });
          console.log('Email sent to :' + emaillist[i]);
        }
        resolve('success');
      } catch (error) {
        reject('failed');
      }
    }).then(function() {
      res.send(true);
    }).catch(function() {
      res.send(false);
    });
  }).catch(function(error) {
    console.log(error);
  });
});

app.listen(process.env.PORT, function() {
  console.log('Server started on port ' + process.env.PORT);
});
