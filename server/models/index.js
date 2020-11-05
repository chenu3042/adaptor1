var env = process.env.NODE_ENV || 'development';

var Sequelize = require('sequelize');
const config = require(`${__dirname}/../config/db_config.json`)[env];

const db = new Sequelize(
	config.database, config.username, config.password, config
);

const User = db.define('user', {
	userEmail: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		set: function (v) {
			this.setDataValue('password', encrypt(v));
		},
		get: function (v) {
			return decrypt(this.getDataValue(v));
		}
	},
	firstName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	active: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	}
});

const crypto = require('crypto');
const ENCRYPTION_KEY = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';
const IV_LENGTH = 16;
var encrypt = function (text) {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}
var decrypt = function (text) {
	try {
		let textParts = text.split(':');
		let iv = new Buffer(textParts.shift(), 'hex');
		let encryptedText = new Buffer(textParts.join(':'), 'hex');
		let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	} catch (e) {
		return text;
	}
}

//Model User Roles
const Role = db.define('role', {
	roleName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	roleDesc: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

Role.getRoles = function () {
	return Role.findAll();
}

Role.findRoleById = function (id) {
	return Role.findOne({
		where: {
			id: id
		}
	});
}

User.getUsers = function () {
	return User.findAll({
		include: [{
			model: Role
		}]
	});
}

User.insertUser = function (user) {
	return User.create(user);
}

User.updateUser = function (user, id) {
	return User.update(user, {
		where: {
			id: id
		}
	});
}

User.deleteUser = function (emailId) {
	return User.destroy({
		where: {
			userEmail: emailId
		}
	});
}

User.getUserByEmail = function (emailId) {
	return User.findOne({
		where: {
			userEmail: emailId
		},
		include: [{
			model: Role
		}]
	});
}


// Associations
User.belongsTo(Role);

let _conn;

const connect = () => {
	if (_conn) return _conn;
	_conn = db.authenticate();
	return _conn;
};

const seed = () => {
	return connect();
};

const userModelSync = () => {
	return connect()
		.then(() => {
			console.log('User DB Authenticate successfully.');
			return db.sync().then(() => {
				Role.findAll().then(roles => {
					if (roles.length == 0) {
						Role.create({
							roleName: 'ADMIN',
							roleDesc: 'Admin'
						});
						Role.create({
							roleName: 'CONSUMER',
							roleDesc: 'Consumer'
						});
					}
				});
			});;
		})
		.catch(err => {
			console.error('Unable to connect to the database:', err);
		});
};

// Exported functions from this file
module.exports = {
	seed,
	userModelSync,
	models: {
		User,
		Role
	}
};
