require('dotenv').config()

const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const app = express()
const IN_PROD = false;

const db = require('./database.js')
const routing_animals = require('./controllers/animal')
const routing_users = require('./controllers/user')

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

// TODO: If the user is logged in, redirect to '/zoo'
app.get('/', function(req, res) {
	res.render('index', {message: 'Hello, world! If you\'re seeing this, the basics are working.'})
})

// The routes are separated into their own files for organization
routing_animals.setup(app)
routing_users.setup(app)

// All routes should be set after this, so default to 404
app.use(function(req, res, next) {
	res.status(404)
	res.redirect('/')
})

app.listen(process.env.WEB_PORT)

console.log('Running on http://localhost:' + process.env.WEB_PORT)