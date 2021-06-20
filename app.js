require('dotenv').config()

const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const app = express()
const IN_PROD = false;

const db = require('./database.js')
const routing_animals = require('./controllers/animal')
const routing_users = require('./controllers/user')
const util = require('./util')
const user_model = require('./models/user')
const { Roles } = require('./user')

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		path: '/',
		sameSite: true,
		secure: IN_PROD,
		httpOnly: true,
	},
	store: MongoStore.create({
		mongoUrl: db.uri,
		dbName: process.env.DB_DATABASE,
		collectionName: 'sessions'
	})
}))

app.set('view engine', 'pug')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	// If the user is logged in, go to the main zoo page
	if (util.isUser(req))
		return res.redirect('/zoo')

	util.render(req, res, 'index', {alert: false})
})

// The routes are separated into their own files for organization
routing_animals.setup(app, util)
routing_users.setup(app, util)

// All routes should be set after this, so default to 404
app.use(function(req, res, next) {
	res.status(404)
	res.redirect('/')
})

// Small hack using globals - callback for the database that only runs once
global.onDatabaseConnected = function(db) {
	global.onDatabaseConnected = null

	// Only run if not in a production environment
	if (IN_PROD)
		return

	// If no users exist, then create some
	db.users.findOne({}, function(err, results) {
		if (err || results)
			return

		console.log("*** Not in a production environment and no users exist; creating examples.")
		console.log("*** You may log in with admin/admin or guest/guest.")

		user_model.register("admin", "admin", Roles.Admin)
		user_model.register("guest", "guest", Roles.Guest)
	})
}

app.listen(process.env.WEB_PORT)

console.log('Running on http://localhost:' + process.env.WEB_PORT)