const db = require('../database')
const { Animal, Species } = require('../animal')

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
				callback(false, 'Animal already exists!')
			}
		})
	}

	remove(animal, callback) {
		if (!callback)
			callback = () => {}

		db.animals.deleteOne({tracking: animal.tracking}, function(err, result) {
			if (err || result == null) {
				callback(false, 'Failed to delete')
				return
			}

			callback(true)
		})
	}

	update(animal, newFields, callback) {
		if (!callback)
			callback = () => {}

		db.animals.updateOne({tracking: animal.tracking}, {$set: newFields}, function(err, result) {
			if (err || result == null) {
				callback(false, 'Failed to update animal record')
				return
			}

			callback(true)
		})
	}

	get(tracking, callback) {
		if (!callback)
			callback = () => {}

		db.animals.findOne({tracking: tracking}, function(err, result) {
			if (err || result == null) {
				callback(false, 'Failed to find animal')
				return
			}

			// TODO: Create new animal object here to return and filter out the _id field
			callback(false, null, result)
		})
	}
}

module.exports = new AnimalModel()