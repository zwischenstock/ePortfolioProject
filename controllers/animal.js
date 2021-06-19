const db = require('../database')
const animal_model = require('../models/animal')

// TODO: Generally clean this up. In its current state, it's only meant for testing core functionality.

// TODO: Make proper views. All current ones are placeholders to test for functionality
// TODO: Proper error handling with using views
// TODO: Authentication
exports.setup = function(app) {
	// Display all animals (TODO: Pagination)
	app.get('/zoo', function(req, res) {
		db.animals.find({}).toArray(function(err, result) {
			res.render('zoo/index', {animals: result})
		})
	})

	// Add an animal
	app.get('/zoo/new', function(req, res) {
		res.render('zoo/new', {})
	})
	app.post('/zoo/new', function(req, res) {
		var animal = getAnimal(req.body)
		if (!animal) {
			console.log("Bad request")
			return
		}

		animal_model.add(animal, function(success, err) {
			if (!success)
				console.log('Error adding animal: ' + err)
			else
				console.log('Successfully added new animal!')
		})
	})

	// Remove an animal (this should be accessible on the animal's information page)
	app.post('/zoo/delete', function(req, res) {
		if (req.body == null || req.body.tracking == null) {
			console.log("Bad request")
			return
		}

		var id = getPositiveInt(req.body.tracking)
		if (id == null) {
			console.log("Bad tracking number")
			return
		}

		animal_model.remove({tracking: id}, function(success, err) {
			console.log((success ? 'Successfully deleted' : err))
		})
	})

	// Modify animal information (again, accessible on the animal's information page)
	app.post('/zoo/modify', function(req, res) {
		if (req.body == null || req.body.tracking == null) {
			console.log("Bad request")
			return
		}

		var tracking = getPositiveInt(req.body.tracking)
		if (tracking == null) {
			console.log("Bad request")
			return
		}

		// If a field of data is given to this POST, it's intended as the new data.
		// Fields: name, species, animal, eggs, nursing
		var newFields = {}

		// TODO: Make sure all of this can be safely displayed in HTML
		if (req.body.name != null)
			newFields.name = req.body.name

		if (req.body.species != null)
			newFields.species = req.body.species // TODO: Limit this to known/supported species

		if (req.body.animal != null)
			newFields.animal = req.body.animal

		// TODO: For eggs/nursing, check if they're appropriate for the species type
		if (req.body.eggs != null) {
			var eggs = getPositiveInt(req.body.eggs)
			if (eggs != null)
				newFields.eggs = eggs
		}

		if (req.body.nursing != null && typeof req.body.nursing == 'boolean')
			newFields.nursing = req.body.nursing

		animal_model.update({tracking: tracking}, newFields, function(success, err) {
			console.log((success ? 'Successfully updated' : err))
		})
	})

		// Display information about a specific animal
	app.get('/zoo/animal/:id', function(req, res) {
		if (req.params.id == null) {
			res.send("Bad input")
			return
		}

		var id = getPositiveInt(req.params.id)
		if (id == null) {
			res.send("Bad ID")
			return
		}

		animal_model.get(id, function(success, err, animal) {
			if (!success) {
				res.send('Failed to find animal')
				return
			}

			res.render('zoo/animal', {animal: animal})
		})
	})
}

function getPositiveInt(num) {
	var n = parseInt(num)
	if (typeof n != 'number' || n == NaN || n < 0)
		return null

	return n
}

// TODO: Type checking and safety checking of strings
// This extracts the animal parameters from a request body. If any are missing, it returns null.
function getAnimal(body) {
	var animal = {}

	if (body.name != null)
		animal.name = body.name

	if (body.species != null)
		animal.species = body.species

	if (body.animal != null)
		animal.animal = body.animal

	if (body.tracking != null) {
		var tracking = getPositiveInt(body.tracking)
		if (tracking != null)
			animal.tracking = tracking
	}

	if (body.eggs != null) {
		var eggs = getPositiveInt(body.eggs)
		if (eggs != null)
			animal.eggs = eggs
	}

	if (body.nursing != null && typeof body.nursing == 'boolean')
		animal.nursing = body.nursing

	if (animal.name == null || animal.species == null || animal.animal == null || animal.eggs == null || animal.nursing == null) {
		return null
	}

	return animal
}