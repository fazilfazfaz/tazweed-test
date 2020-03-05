module.exports = (models, config) => {
    return {
        store: (user_id, seller_id, timeslot_id) => {
            return new Promise((resolve, reject) => {
                models.appointment.findOne({
                    requested_by: user_id,
                    seller_id: seller_id,
                    timeslot_id: timeslot_id
                }, function(err, appointment) {
                    if(err || appointment) {
                        return reject(err);
                    }
                    var appointment = new models.appointment({
                        requested_by: user_id,
                        seller_id: seller_id,
                        timeslot_id: timeslot_id,
                        approval_status: 'PENDING'
                    });
                    appointment.validate(function(err) {
                        if(!err) {
                            appointment.save((err) => {
                                if(err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            reject(err);
                        }
                    });

                })
            })
        },
        getUsersAppointmentRequests: (user_id) => {
            return new Promise((resolve, reject) => {
                models.appointment.find({
                    'requested_by': user_id
                }, function(err, appointments) {
                    if(err || !appointments) {
                        reject(err);
                    }
                    resolve(appointments);
                });
            })
        },
        getAppointmentRequestsAgainstSeller: (user_id, status = null) => {
            return new Promise((resolve, reject) => {
                var searchparam = {
                    seller_id: user_id
                }
                if(status) {
                    searchparam.approval_status = status;
                }
                models.appointment.find(searchparam, function(err, appointments) {
                    if(err || !appointments) {
                        reject(err);
                    }
                    var user_ids = [];
                    for(var i = 0; i < appointments.length; i++) {
                        if(user_ids.indexOf(appointments[i].requested_by) == -1) {
                            user_ids.push(appointments[i].requested_by);
                        }
                    }
                    appointments_lean = appointments.map(function(v) {
                        return v.toJSON();
                    });
                    models.user.find({
                        _id: {
                            '$in': user_ids    
                        }
                    }, function(e, users) {
                        var users_lean = users.map(function(v) {
                            return v.toJSON();
                        });
                        for(var i = 0; i < appointments_lean.length; i++) {
                            var u = users_lean.find(function(ul) {
                                return ul._id == appointments_lean[i].requested_by;
                            });
                            if(u) {
                                appointments_lean[i].requested_by_name = u.username;
                            } else {
                                appointments_lean[i].requested_by_name = 'No name';
                            }
                        }
                        models.timeslot.find({
                            _id: {
                                '$in': appointments_lean.map(function(v) {
                                    return v.timeslot_id;  
                                })
                            }
                        }, function(e, timeslots) {
                            var timeslots_lean = timeslots.map(function(v) {
                                return v.toJSON();
                            });
                            for(var i = 0; i < appointments_lean.length; i++) {
                                var t = timeslots_lean.find(function(ts) {
                                    return ts._id == appointments_lean[i].timeslot_id;
                                });
                                if(t) {
                                    appointments_lean[i].timeslot = t;
                                } else {
                                    appointments_lean[i].timeslot = {};
                                }
                            }
                            resolve(appointments_lean);
                        })
                    })
                });
            })
        },
        take_action: (user_id, appointment_id, action) => {
            return new Promise((resolve, reject) => {
                models.appointment.findOne({
                    _id: appointment_id,
                    approval_status: 'PENDING'
                }, function(err, appointment) {
                    if(err || !appointment) {
                        return reject(err);
                    }
                    if(appointment.seller_id != user_id) {
                        return reject();
                    }
                    appointment.approval_status = action
                    appointment.save(function(err) {
                        if(err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                });
            })            
        }
    }
}