const config = require('./config.js');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.mongodb_host + '/' + config.mongodb_database, { useNewUrlParser: true });
const mongoose_db = mongoose.connection;

mongoose_db.on('error', () => {
    throw new Error("Mongoose DB conn failed");
    process.exit();
});

mongoose_db.once('open', () => {
    console.log("Mongoose DB conn setup!");
    bcrypt.hash('admin', config.bcrypt_salt).then((hash) => {
        var u = new models.user({
            username: 'admin',
            usertype: 'SELLER',
            password: hash
        });
        u.validate(function(err) {
            if(!err) {
                u.save(function(err) {
                    if(err) {
                        //
                    }
                });
            }
        });
    })
});

const path = require('path');

express.response._json = function(data = null, meta = null) {
	return this.json({
		data: data,
		code: this.statusCode,
		meta: null
	})
}

const models = require('./models')(mongoose);
const middlewares = require('./middlewares')(config);
const repositories = require('./repositories')(models, config);
const controllers = require('./controllers')(models, repositories, config);


app.use('/app', express.static(path.join(__dirname, 'assets/tazweedweb/dist'), {
	'dotfiles':'deny',
}));
app.use('/static', express.static(path.join(__dirname, 'assets/tazweedweb/dist/static'), {
	'dotfiles':'deny',
}));

app.use(express.urlencoded());
app.use(express.json());

app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname + '/views/index.html')));

app.post('/users/register', controllers.user.register);
app.post('/users/login', controllers.user.login);
app.post('/users/auth', middlewares.enforceAuth, controllers.user.auth);
app.get('/sellers', middlewares.enforceAuth, controllers.user.getSellers);
app.post('/timeslots', middlewares.enforceAuth, controllers.timeslot.store);
app.get('/timeslots', middlewares.enforceAuth, controllers.timeslot.getOwnSlots);
app.get('/timeslots/by_user_id', middlewares.enforceAuth, controllers.timeslot.getByUserId);
app.post('/appointments/create_request', middlewares.enforceAuth, controllers.appointment.store);
app.post('/appointments/approve', middlewares.enforceAuth, controllers.appointment.approve);
app.post('/appointments/reject', middlewares.enforceAuth, controllers.appointment.reject);
app.get('/appointments/my_requests', middlewares.enforceAuth, controllers.appointment.getOwnAppointments);
app.get('/appointments/my_appointments', middlewares.enforceAuth, controllers.appointment.getOwnRequestedAppointments);
app.get('/appointments/pending', middlewares.enforceAuth, controllers.appointment.getOwnPendingRequestedAppointments);

app.use(function(err, req, res, next) {
    var code = 500;
    var errors = {};
    if(!err instanceof Object) {
        err = {}
    }
    if(err.status) {
        code = err.status;
    }
    if(err.errors) {
        for(var key in err.errors) {
            if(err.errors.hasOwnProperty(key)) {
                if(err.errors[key] instanceof Object) {
                    errors[key] = err.errors[key].message;
                } else {
                    errors[key] = err.errors[key];
                }
            }
        }
        code = 400;
    }
    res.json({
        errors: errors,
        data: null,
        code: code,
        meta: null
    })
})

app.listen(config.app_port, function () {
	console.log('Tazweed listening on port ' + config.app_port)
});
