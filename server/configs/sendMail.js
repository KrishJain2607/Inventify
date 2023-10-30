const nodemailer = require('nodemailer')

function sendMail() {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "testerjain3575@gmail.com",
          pass: "tiuy uczf uusb qzos"
        }
    })
    
    let mailOptions = {
        from: "testerjain3575@gmail.com",
        to: users,
        subject: 'Inventify Project',
        html: `<div>Hello From Inventify !</div>`,
    }
    
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    })
}

sendMail()

module.exports = sendMail