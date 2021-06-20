var user_model = require('../models/user')
var { Roles } = require('../user')

const THIRTY_SECONDS = 1000 * 30
const NINETY_SECONDS = THIRTY_SECONDS * 3
const THIRTY_MINUTES = (THIRTY_SECONDS * 2) * 30

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

		var now = new Date().getTime()
		if (req.session.loginSpam && req.session.loginSpam > now) {
			var diff = new Date(req.session.loginSpam - now)
			var tstring = diff.getMinutes() + " minute" + (diff.getMinutes() == 1 ? "" : "s") + " and " +
				diff.getSeconds() + " second" + (diff.getSeconds() == 1 ? "" : "s")

			return util.render(req, res, 'index', {alert: "You cannot attempt again for another " + tstring})
		}

		user_model.tryLogin(username, password, function(success, user, err) {
			if (!success) {
				// Every time the user fails a login, 30 seconds are added to their first recorded fail time.
				// If that time is 90 seconds below the current time, it's reset to the current time.
				// If that time adds up to 90 seconds over the current time, they are stopped from logging in for 30 minutes.
				if (!req.session.loginTimeout || (now - req.session.loginTimeout) > NINETY_SECONDS)  {
					req.session.loginTimeout = now
				} else if (req.session.loginTimeout > (now + NINETY_SECONDS)) {
					req.session.loginSpam = now + THIRTY_MINUTES
				} else {
					req.session.loginTimeout = req.session.loginTimeout + THIRTY_SECONDS
				}

				return util.render(req, res, 'index', {alert: "Invalid username or password"})
			}

			req.session.loginTimeout = null
			req.session.loginSpam = null
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
		if (!util.isUser(req)) {
			return util.render(req, res, 'profile', {alert: 'You must be signed in to do this'})
		}

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