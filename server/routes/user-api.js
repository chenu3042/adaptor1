const express = require('express');
const request = require('request');
const cryptojs = require('crypto-js');
const log4js = require('log4js');

const mapApiToModel = require('../data/mapper/modelMapper.js');
const CONSTANTS = require('../../constants.js');
const userService = require('../data/mockResponse/users.js');
const Category = require('../data/pojo/Category.js');
const Item = require('../data/pojo/Item.js');
const ItemDetails = require('../data/pojo/ItemDetails.js');
const config = require('../config/config.json');
const { json } = require('body-parser');
// const Delivery = require('../data/pojo/delivery.js');

const router = express.Router();

log4js.configure('./server/config/log4js.json');
var log = log4js.getLogger('server');
var log_level = config.BASICS.LOG_LEVEL;
log.logLevel = log_level;

const db = require('../models');

const User = db.models.User;
const Role = db.models.Role;

router.post('/user/signin', (req, res, next) => {
	var loginDetails = req.body;
	var user = loginDetails.username;
	var pass = loginDetails.password;

	user = user.toString().trim();
	pass = pass.toString().trim();

	var resp;
	User.getUserByEmail(user)
		.then(user => {
			if (user && user.password === pass) {
				var jwt = require('jsonwebtoken');
				var payload = {
					"user": user,
					"admin": true
				}
				var token = jwt.sign(payload, (process.env.SECRET_KEY, 'HS512'), {
					expiresIn: 4000
				});
				resp = ({
					success: true,
					token: token,
					user: user
				});
				log.info(config.BASICS.APP_Version + ' - Logged in as: ' + user.userEmail)
			}
			if (resp == undefined) {
				res.json({
					success: false
				});
				log.info('Login unsuccessful: Wrong credentials entered')
			} else if (resp['success']) {
				res.json(resp);
			}
		});
});



router.get('/user/authentication/:token', (req, res) => {

	var AuthToken = req.params.token;
	log.debug("Received Token:" + AuthToken);

	var jwt = require('jsonwebtoken');

	jwt.verify(AuthToken, (process.env.SECRET_KEY, 'HS512'), function (err, decode) {
		if (err) {
			log.debug('Toekn expired or Failed to authenticate token')
			return res.json({
				success: false,
				message: 'Failed to authenticate token.'
			});
		} else {
			req.decode = decode;
			return res.json({
				success: true,
				message: 'Authentication Successfull.',
				decode: decode
			});

		}
	});
});

router.get('/user/findUser/:email', (req, res, next) => {
	var email = req.params.email;
	User.getUserByEmail(email)
		.then(user => {
			res.send(user);
		})
		.catch(error => next(error));
});

router.get('/user/users', (req, res, next) => {
	User.getUsers()
		.then(users => {
			res.send(users);
		})
		.catch(error => next(error));
});

router.post('/user/saveUser', (req, res, next) => {
	var user = req.body;
	User.insertUser(user)
		.then(user => {
			res.send(user);
		})
		.catch(error => next(error));
});

router.put('/user/updateUser', (req, res, next) => {
	var user = req.body;
	User.updateUser(user, user.id)
		.then(user => {
			res.send(user);
		})
		.catch(error => next(error));
});

router.delete('/user/deleteUser/:id', (req, res, next) => {
	var userId = req.params.id;
	User.deleteUser(userId)
		.then(deletedUser => {
			res.status(200).json(deletedUser);
		})
		.catch(error => next(error));
});

router.get('/user/userRoles', (req, res, next) => {
	Role.getRoles()
		.then(roles => {
			console.log("roles :"+JSON.stringify(roles));
			res.send(roles);
		})
		.catch(error => next(error));
});


function buildURL(path) {
	var url = CONSTANTS.BSP.API_PARAMS.BASE_URL + path;
	log.debug('buildURL - API URL :' + url);
	return url;
}

module.exports = router;
