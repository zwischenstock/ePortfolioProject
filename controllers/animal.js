const db = require('../database')
const animal_model = require('../models/animal')

exports.setup = function(app, util) {
	app.get('/zoo', util.userView, function(req, res) {
		db.animals.find({}).toArray(function(err, result) {
			for(var animal of result) {
				animal._id = null
				animal.nursing = animal.nursing == 'true'
			}

			util.render(req, res, 'zoo/index', {animals: result, canAdd: true})
		})
	})

	// Add an animal
	app.get('/zoo/new', util.adminView, function(req, res) {
		util.render(req, res, 'zoo/new', {})
	})
	app.post('/zoo/new', function(req, res) {
		if (!util.isAdmin(req)) {
			res.redirect('/')
			return
		}

		var animal = animal_model.processFields(req.body, true)
		if (!animal) {
			util.alert(req, 'Invalid parameters')
			return
		}

		animal_model.add(animal.toObject(), function(success, err) {
			if (!success)
				util.alert(req, 'Failed to add animal')
			else
				util.notice(req, 'Successfully added animal!')

			res.redirect('/zoo')
		})
	})

	// Remove an animal (this should be accessible on the animal's information page)
	app.post('/zoo/delete', function(req, res) {
		if (!util.isAdmin(req))
			return res.redirect('/')

		if (req.body == null || req.body.tracking == null) {
			util.alert(req, 'No tracking ID specified')
			res.redirect('/zoo')
			return
		}

		var id = util.getPositiveInt(req.body.tracking)
		if (id == null) {
			util.alert(req, 'Invalid tracking ID provided')
			res.redirect('/zoo')
			return
		}

		animal_model.remove({tracking: id}, function(success, err) {
			if (!success)
				util.alert(req, err)
			else
				util.notice(req, 'Successfully deleted animal #' + id)

			res.redirect('/zoo')
		})
	})

	// Modify animal information (again, accessible on the animal's information page)
	app.post('/zoo/modify', function(req, res) {
		if (!util.isAdmin(req)) {
			res.redirect('/zoo')
			return
		}

		var newFields = animal_model.processFields(req.body)
		if (!newFields) {
			util.alert(req, 'Invalid fields specified')
			res.redirect('/zoo')
			return
		}

		animal_model.update({tracking: newFields.tracking}, newFields, function(success, err) {
			if (!success)
				util.alert(req, err)
			
			res.redirect('/zoo')
		})
	})

		// Display information about a specific animal
	app.get('/zoo/animal/:id', util.userView, function(req, res) {
		if (req.params.id == null) {
			res.redirect('/zoo')
			return
		}

		var id = util.getPositiveInt(req.params.id)
		if (id == null) {
			res.redirect('/zoo')
			return
		}

		animal_model.get(id, function(success, err, animal) {
			if (!success) {
				res.redirect('/zoo')
				return
			}

			util.render(req, res, 'zoo/animal', {animal: animal})
		})
	})
}