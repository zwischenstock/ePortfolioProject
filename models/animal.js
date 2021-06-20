const db = require('../database')
const { Animal, Species } = require('../animal')
const escape = require('escape-html')
const util = require('../util')

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
				callback(false, 'Tracking number already exists!')
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

		newFields = processFields(newFields)
		if (!newFields) {
			callback(false, 'Invalid parameters')
			return
		}

		if (animal.tracking != newFields.tracking) {
			db.animals.findOne({tracking: newFields.tracking}, function(err, result) {
				if (err) {
					callback(false, 'Failed checking for existing animals with new tracking number')
					return
				}

				if (result) {
					callback(false, 'An animal already has that tracking number!')
					return
				}

				db.animals.updateOne({tracking: animal.tracking}, {$set: newFields}, function(err, result) {
					if (err || result == null) {
						callback(false, 'Failed to update animal record')
						return
					}

					callback(true)
				})
			})
		} else {
			db.animals.updateOne({tracking: animal.tracking}, {$set: newFields}, function(err, result) {
				if (err || result == null) {
					callback(false, 'Failed to update animal record')
					return
				}

				callback(true)
			})
		}
	}

	get(tracking, callback) {
		if (!callback)
			callback = () => {}

		db.animals.findOne({tracking: tracking}, function(err, result) {
			if (err || result == null) {
				callback(false, 'Failed to find animal')
				return
			}

			callback(true, new Animal((
				result.tracking,
				result.name,
				result.species,
				result.animal,
				result.eggs,
				result.nursing == 'true')), result)
		})
	}

	processFields(fields, completeAnimal) {
		return processFields(fields, completeAnimal)
	}
}

// Requires a tracking number
function processFields(fields, completeAnimal) {
	var anim = {}

	if (!fields.tracking)
		return null
	else
		anim.tracking = util.getPositiveInt(fields.tracking)

	if (fields.name && typeof fields.name == 'string')
		anim.name = escape(fields.name)

	if (fields.species && typeof fields.species == 'string' && Species[fields.species])
		anim.species = fields.species

	if (fields.animal && typeof fields.animal == 'string')
		anim.animal = escape(fields.animal)

	if (fields.eggs != null)
		anim.eggs = util.getPositiveInt(fields.eggs)

	if (fields.nursing == 'true' || fields.nursing == 'false')
		fields.nursing = fields.nursing == 'true'
	if (fields.nursing == 'Yes' || fields.nursing == 'No')
		fields.nursing = fields.nursing == 'Yes'

	if (fields.nursing != null && typeof fields.nursing == 'boolean')
		anim.nursing = fields.nursing

	if (completeAnimal) {
		if (anim.name == null || anim.species == null || anim.animal == null || anim.eggs == null || anim.nursing == null) {
			return null
		}

		return new Animal(anim.tracking, anim.name, anim.species, anim.animal, anim.eggs, anim.nursing)
	}

	return anim
}

module.exports = new AnimalModel()