const Roles = {
	Admin: 'Admin',
	Guest: 'Guest'
}

class User {
	constructor(id, username, role) {
		// TODO: error if bad inputs

		this.id = id // This should be how the user is identified in the database. For MongoDB, the _id field.
		this.username
		this.role = (Roles[role] ? role : Roles.Guest)
	}

	canViewZoo() {
		// Anyone logged onto the Zoo website can view it.
		return true
	}

	canEditZoo() {
		return this.role == Roles.Admin
	}

	toObject() {
		return {
			id: this.id,
			username: this.username,
			role: this.role
		}
	}

	static fromObject(obj) {
		return User(obj.id, obj.username, obj.role)
	}
}


exports.Roles = Roles
exports.User = User