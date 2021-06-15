require('dotenv').config()

const express = require('express')
const app = express()

const db = require('./database.js')
const views_animals = require('./views_animals')
const views_users = require('./views_users')

app.set('view engine', 'pug')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.render('index', {message: 'Hello, world! If you\'re seeing this, the basics are working.'})
})

// The routes are separated into their own files for organization
views_animals.setup(app)
views_users.setup(app)

app.listen(process.env.WEB_PORT)

console.log('Running on http://localhost:' + process.env.WEB_PORT)