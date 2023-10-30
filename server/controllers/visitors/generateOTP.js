const otpGenerator = require('otp-generator')
const sendMail = require('../../configs/sendMail')


// Flow
// 1.User enters name, contact, email, createPass, confirmPass
// 2.OTP is send to user on it's mail. User details are not stored in DB
// 
// 
// 

function generateOTP(req, res) {
    const userEmail = req.email
    var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    return res.status(200).json({
        
    })
}