const {MongoClient} = require('mongodb')

// TODO: Authentication
const uri = "mongodb://" +
	//process.env.DB_USER + ":" + process.env.DB_PASS +
	//"@" +
	process.env.DB_HOST + ":" + process.env.DB_PORT +
	"/" + process.env.DB_DATABASE;

class ZooDatabase {
	constructor() {
		this.connected = false

		this.client = new MongoClient(uri)
		this.uri = uri
		this.run()
	}

	async run() {
		try {
			await this.client.connect()

			await this.client.db("admin").command({ ping: 1 })
			console.log("Successfully connected to the MongoDB server");

			this.db = this.client.db("zoo")

			// Convenience accessors
			this.animals = this.db.collection("animals")
			//this.users = this.client.db("users")

			this.connected = true
		} finally {
			//await this.client.close()
		}
	}
}

module.exports = new ZooDatabase();