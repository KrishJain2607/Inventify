const jwt = require("jsonwebtoken")

function signUpWithGoogle(req, res) {
    try {
        const {credential} = req.body
        // console.log("Google jwt => ", credential)
        const decodedMsg = jwt.decode(credential)
        console.log(decodedMsg)
        res.status(200).json({
            success: true,
            message: "Sign Up with google successful"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while signing up with google",
            err: error
        })
    }
}

module.exports = signUpWithGoogle