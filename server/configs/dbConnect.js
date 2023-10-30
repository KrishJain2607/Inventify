const { MongoClient, ObjectId } = require("mongodb")
const dotenv = require('dotenv')

dotenv.config()
// Replace the following with your Atlas connection string                                                                                                                                        
const url = process.env.DATABASE_URL

// Connect to your Atlas cluster
const client = new MongoClient(url)

async function dbConnect() {
    try {
        await client.connect()
        console.log("Successfully connected to Atlas")
    } catch (err) {
        console.log(err.stack)
    }
}

module.exports = {
    dbConnect,
    getClient: client,
};
