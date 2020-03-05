const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
module.exports = (models, repositories, config) => {
    return {
        login: (req, res, next) => {
            models.user.findOne({
                username: req.body.username
            }, function(err, user) {
                if(err || !user) {
                    return next({
                        errors: {
                            username: 'Username is invalid'
                        }
                    });
                }
                bcrypt.compare(req.body.password, user.password).then((result) => {
                    if(!result) {
                        return next({
                            errors: {
                                password: 'Password is incorrect'
                            }
                        });
                    }
                    res._json({
                        token: jwt.sign({
                            user_id: user._id,
                            username: user.username
                        }, config.jwt_secret)
                    });
                });
            });
        },
        auth: (req, res) => {
            repositories.user
                .get(req.user.user_id)
                .then((user) => {
                    res._json(user)
                })
                .catch((err) => {
                    next(401)
                });
        },
        register: (req, res, next) => {
            models.user.findOne({
                username: req.body.username
            }, function(err, user) {
                if(err || user) {
                    return next({
                        errors: {
                            username: 'Username already exists'
                        },
                    });
                }
                var u = new models.user({
                    username: req.body.username,
                    usertype: req.body.usertype,
                    password: req.body.password
                });
                u.validate(function(err) {
                    if(!err) {
                        bcrypt.hash(req.body.password, 10).then((hash) => {
                            u.password = hash;
                            u.save((err) => {
                                if(err) {
                                    next(400)
                                } else {
                                    res.status(200)._json({
                                        registered: true
                                    });
                                }
                            });
                        }).catch(() => {
                            next(500);
                        });
                    } else {
                        next({
                            errors: err.errors
                        });
                    }
                });
            });
        },
        getSellers: (req, res, next) => {
            repositories.user
                .getSellers(req.user.user_id)
                .then((sellers) => {
                    res._json(sellers)
                })
                .catch((err) => {
                    res.status(404)._json()
                });
        }
	}
}