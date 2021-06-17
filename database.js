const { MongoClient } = require('mongodb')

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
		this.uri = uri // This is put here so it can be used by other modules, such as MongoStore for sessions
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
			this.users = this.db.collection("users")

			this.connected = true
		} finally {
			//await this.client.close()
		}
	}
}

module.exports = new ZooDatabase();