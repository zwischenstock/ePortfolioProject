const { Roles } = require('./user')

module.exports = {
	// Middleware - restricts a view to user accounts possessing the Admin role
	// If more roles are added with more nuanced permissions, this will need to be changed.
	adminView: function(req, res, next) {
		if (req.session.user && req.session.user.role == Roles.Admin) {
			return next();
		}

		return res.redirect('/')
	},

	// Middleware - restricts a view to logged in users
	userView: function(req, res, next) {
		if (req.session.user)
			return next();

		return res.redirect('/')
	},

	// Similar to adminView, but for use within requests.
	isAdmin: function(req) {
		return (req.session.user && req.session.user.role == Roles.Admin)
	},

	// Similar to userView, but for use within requests.
	isUser: function(req) {
		return (req.session.user && req.session.user.id)
	},

	// Util replacement for res.render(location, data), which inserts user information into the render.
	render: function(req, res, location, data) {
		if (!data)
			data = {}

		if (req.session.user != null) {
			data.user = {
				username: req.session.user.username,
				role: req.session.user.role
			}
		}

		return res.render(location, data)
	}
}