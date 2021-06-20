var user_model = require('../models/user')
var { Roles } = require('../user')

exports.setup = function(app, util) {
	app.post('/login', function(req, res) {
		// Something fishy is going on if they try to log in while already logged in.
		// This check ensures they don't skip any logic that might occur during the logout phase.
		if (util.isUser(req))
			return res.redirect(307, '/logout')

		var username = req.body.username
		var password = req.body.password

		if (username == null || password == null || typeof username != 'string' || typeof password != 'string')
			return util.render(req, res, 'index', {alert: "Invalid username or password"})

		user_model.tryLogin(username, password, function(success, user, err) {
			if (!success)
				return util.render(req, res, 'index', {alert: "Invalid username or password"})

			req.session.user = user.toObject()

			res.redirect('/zoo')
		})
	})

	app.post('/logout', function(req, res) {
		req.session.user = null
		res.redirect('/')
	})

	app.post('/register', function(req, res) {
		if (util.isUser(req))
			return util.render(req, res, 'index', {alert: 'Cannot register while logged in'})

		var username = req.body.username
		var password = req.body.password

		if (username == null || password == null || typeof username != 'string' || typeof password != 'string')
			return util.render(req, res, 'index', {alert: 'Invalid username or password'})

		// All users default to guest and must be manually promoted
		user_model.register(username, password, Roles.Guest, function(success, user, err) {
			if (!success)
				return util.render(req, res, 'index', {alert: err})

			// This is all 'logging in' means.
			req.session.user = user.toObject()

			res.redirect('/zoo')
		})
	})

	app.get('/profile', util.userView, function(req, res) {
		util.render(req, res, 'profile', {})
	})

	app.post('/newpassword', function(req, res) {
		if (!util.isUser(req))
			return util.render(req, res, 'profile', {alert: 'You must be signed in to do this'})

		var old_pass = req.body.oldPassword
		var new_pass = req.body.newPassword

		if (old_pass == null || new_pass == null || typeof old_pass != 'string' || typeof new_pass != 'string')
			return util.render(req, res, 'profile', {alert: 'Invalid password data sent'})

		user_model.changePassword(req.session.user.id, old_pass, new_pass, function(success, err) {
			if (!success)
				return util.render(req, res, 'profile', {alert: err})

			util.render(req, res, 'profile', {notice: 'Successfully updated password'})
		})
	})
}