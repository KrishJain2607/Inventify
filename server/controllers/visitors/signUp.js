const dbConfigs = require('../../configs/dbConnect')
const bcrypt = require('bcrypt')

async function signUp(req, res) {
    try {
        const {fname, phoneno, email, fpasswd, spasswd} = req.body
        if(!fname || !phoneno || !email || !fpasswd || !spasswd) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if(fpasswd !== spasswd) {
            return res.status(400).json({
                success: false,
                message: "Password doesn't match"
            })
        } 

        try {
            const client = dbConfigs.getClient
            const dbo = client.db("Inventify")
            const listCollections = await dbo.listCollections().toArray()
            const collections = listCollections.map((collectionName) => collectionName.name)

            var flag = true
            for(const coll in collections) {
                if(collections[coll] == 'Users') flag = false
            }

            if(flag) {
                dbo.createCollection("Users", (err, res) => {
                    if(err) throw err
                    console.log("Users collection created")
                })
            }
            else {
                const records = await dbo.collection("Users").find({}).toArray()
                records.forEach(obj => {
                    if(obj.email === email) {
                        flag = true                            
                    }
                });
                if(flag) {
                    return res.status(400).json({
                        success: false,
                        message: "User already exist"
                    })
                }
            }

            const hashPassword = await bcrypt.hash(fpasswd, 10)

            dbo.collection("Users").insertOne(
                {
                    "name": fname,
                    "email": email,
                    "phoneno": phoneno,
                    "pass": hashPassword,
                    "role": "retailer"
                }
            )
            return res.status(200).json({
                success: true,
                data: {fname, phoneno, email, hashPassword}
            })
            
        } catch (err) {
            console.log(err.stack)
            return res.status(500).json({
                success: false,
                message: "Something went wrong in db Connection",
                error: err
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while signing up",
            error: error
        })
    }
}

module.exports = signUp