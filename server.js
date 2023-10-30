const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

// Industry standard - Add all your constant variables in .env (Environment variable) 
const dotenv = require('dotenv')

// To access varibales in .env file, use dotenv.config() which loads env var in process.env object
dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))


// Connecting to Atlas
const dbConfigs = require('./server/configs/dbConnect')
dbConfigs.dbConnect()

// Import middlware
const auth = require('./server/middleware/auth') 
const authN = auth.authN
const isManager = auth.isManager

// ejs is a template engine which is a markup language and is converted into html file later on.
// ejs is similar to html but has superpower of calculations

// Folder structure as per industry standard - 
// A. For html pages i.e ejs files
// 1. npm i ejs
// 2. In server.js, add app.set("view engine", "ejs")
// 3. In views folder, add ejs files
// 4. Instead of send use render and add ejs file name in it.

app.set("view engine", "ejs")

// B. For static files => (images, js, css)
// 1. create a public folder
// 2. Create 3 folders inside it, images, css, javascript
// 3. Configure express static in server.js
// 4. **Understand the naming of path directory of static files in ejs
// For Exmample => In login.ejs 
// INCORRECT => <link rel="stylesheet" href="../public/css/login.css"> 
// because it is already specified that Express should serve static files from the 'public' directory. Line no. 41 in server.js 
// CORRECT => <link rel="stylesheet" href="../css/login.css">

app.use(express.static('./public'))

// -------------------------- P R O T E C T E D - R O U T E S ----------------------------------

// -------------------------- V I S I T O R S ----------------------------------

app.get('/', (req, res) => {
    res.render('homepage')
})

app.get('/homepage', (req, res) => {
    res.render('homepage')
})

app.get('/aboutus', (req, res) => {
    res.render('aboutus')
})

app.get('/contactus', (req, res) => {
    res.render('contactus')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

// -------------------------- M A N A G E R ----------------------------------

function decodeUser(req) {
    var token = req.cookies.token || req.header("authorization").replace("Bearer ", "")
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const managerInURL = req.params.username
    return managerInURL === decode.username 
} 

function decodeUserDetails(req) {
    var token = req.cookies.token || req.header("authorization").replace("Bearer ", "")
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    return decode
}

app.get('/manager-dashboard/:username', authN, isManager, (req, res) => {
    if(decodeUser(req) === true) return res.render('manager-dashboard', {manager_username: req.params.username})
    else return res.render('page_not_found')
})

const getUserDetails = require('./server/controllers/common/getUserDetails')
app.get('/manager-profile/:username', authN, isManager, async(req, res) => {
    if(decodeUser(req) === true) {
        let decode = decodeUserDetails(req)
        let userDetails = await getUserDetails(decode.email)
        console.log(userDetails)
        // full name => (userDetails[0].firstName+userDetails[0].lastName).replace(/\s/g, ''),
        return res.render('manager-profile', {
            manager_username: userDetails[0].username,
            manager_firstName: userDetails[0].firstName,
            manager_lastName: userDetails[0].lastName,
            manager_email: userDetails[0].email,
            manager_contact: userDetails[0].contact,
            manager_gender: userDetails[0].gender,
            manager_doj: userDetails[0].dateOfJoining
        }
        )
    }
    else return res.render('page_not_found')
})

const updateProfile = require('./server/controllers/manager/updateProfile')
app.post('/update-profile', authN, isManager, updateProfile)

const getStaffDetails = require('./server/controllers/manager/getStaffDetails')
app.get('/get-staff-details/:username', authN, isManager, async(req, res) => {
    if(decodeUser(req) === true) {
        try {
            const staff_records = await getStaffDetails(req)
            if(staff_records.success) res.render('get-staff-details', {
                    manager_username: req.params.username, 
                    staff_data: staff_records.data
                }
            )
            return res.render('get-staff-details')
        } catch (error) {
            console.log("Error while fetching staff details")
        }
    }
    else return res.render('page_not_found')
})

//-------------------------- A D M I N  ----------------------------------





// -------------------------- R E T A I L E R  ----------------------------




// -------------------------------------------------------------------------------

// -------------------------- A P I ------------------------------------------

const loginHandler = require('./server/controllers/visitors/login')
app.post('/login', loginHandler)




  
// -------------------------- E R R O R - 4 0 4 ----------------------------------

app.get('*', (req, res) => {
    res.render('page_not_found')
})

app.listen(PORT, () => {
    console.log("Server activated on PORT", PORT)
})
