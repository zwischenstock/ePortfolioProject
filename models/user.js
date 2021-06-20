const bcrypt = require('bcrypt')
const { ObjectID } = require('mongodb')
const db = require('../database')
const { User, Roles } = require('../user')

const saltRounds = 10

class UserModel {
	constructor() {}

	// The callback is given 3 parameters: (wasSuccessful: bool, user: User, err: string)
	// If the login fails, user will be null and err should have a string.
	// NOTE: Be sure NOT to pass along the error string to the user and only give a generic message.
	tryLogin(username, password, callback) {
		if (!callback)
			callback = () => {}

		db.users.findOne({username: username}, function(err, results) {
			if (err || results == null) {
				callback(false, null, 'Username does not exist')
				return
			}

			bcrypt.compare(password, results.password, function(err, success) {
				if (!success) {
					callback(false, null, 'Incorrect password')
					return
				}

				callback(true, new User(results._id, username, results.role || Roles.Guest))
			})
		})
	}

	// The callback is given 3 parameters: (wasSuccessful: bool, user: User, err: string)
	// See the roles enum for valid roles. At the time of this comment, Admin or Guest.
	register(username, password, role, callback) {
		if (!callback)
			callback = () => {}

		if (password.length < 5) {
			callback(false, null, 'Your password must be at least 5 characters long!')
			return
		}

		if (!Roles[role]) {
			callback(false, null, 'Invalid role!')
			return
		}

		db.users.findOne({username: username}, function(err, find_results) {
			if (err) {
				callback(false, null, 'Database error')
				return
			}

			if (find_results) {
				callback(false, null, 'That username already exists')
				return
			}

			bcrypt.hash(password, saltRounds, function(b_err, hash) {
				if (b_err) {
					callback(false, null, 'Failed to create password hash')
					return
				}

				db.users.insertOne({username: username, password: hash, role: role}, function(i_err, i_results) {
					if (i_err || i_results == null) {
						callback(false, null, 'Error inserting user information into the database')
						return
					}

					var id = i_results.ops[0]._id
					callback(true, new User(id, username, role))
				})
			})
		})
	}

	// The callback is given 2 parameters: (wasSuccessful: bool, err: string)
	// Both passwords are in plaintext as if given from a POST request.
	changePassword(id, oldPassword, newPassword, callback) {
		if (!callback)
			callback = () => {}

		// The user must be found first so that the old password can be verified
		db.users.findOne({_id: ObjectID(id)}, function(err, results) {
			if (err || results == null) {
				callback(false, 'Could not find user')
				return
			}

			// Verify the old password
			bcrypt.compare(oldPassword, results.password, function(b_err, success) {
				if (!success) {
					callback(false, 'Incorrect password')
					return
				}

				// Generate the hash of the new password
				bcrypt.hash(newPassword, saltRounds, function(b2_err, hash) {
					if (b2_err) {
						callback(false, 'Failed to generate new password hash')
						return
					}

					// And finally update the records
					db.users.updateOne({_id: ObjectID(id)}, {$set: {password: hash}}, function(u_err, u_results) {
						if (u_err || u_results == null) {
							callback(false, 'Failed to update password')
							return
						}

						callback(true)
					})
				})
			})
		})
	}
}

module.exports = new UserModel()