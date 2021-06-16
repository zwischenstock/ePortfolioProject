const db = require('../database')

// TODO: Proper typechecking and validation of passed arguments.
class AnimalModel {
	constructor() {
	}

	// Adds an animal, callback gives successful add as a bool
	add(animal, callback) {
		if (!callback) // Simpler than making checks before every call
			callback = () => {}

		db.animals.findOne({tracking: animal.tracking}, function(err, result) {
			if (err) {
				callback(false, 'Database error')
				return
			}

			if (!result) {
				db.animals.insertOne(animal, function(err2, result2) {
					if (err2 || result2 == null) {
						callback(false, 'Error inserting animal')
						return
					}

					callback(true)
				})
			} else {
				callback(false, "Animal already exists!")
			}
		})
	}

	remove(animal, callback) {
		if (!callback)
			callback = () => {}

		
	}
}

module.exports = new AnimalModel()