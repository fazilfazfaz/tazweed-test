const moment = require('moment');
module.exports = (models, repositories, config) => {
    return {
        store: (req, res, next) => {
            var data = req.body;
            if(!data.slots) {
                return next({
                    errors: {
                        slots: 'Slots are required'
                    }
                });
            }
            var slots = [];
            for(var i = 0; i < data.slots.length; i++) {
                if(!data.slots[i].from || !data.slots[i].to) {
                    continue;
                }
                var from = moment(data.slots[i].from, 'HH:mm');
                var to = moment(data.slots[i].to, 'HH:mm');
                if(!from.isValid() || !to.isValid()) {
                    continue;
                }
                slots.push({
                    from: from.format('HH:mm'),
                    to: to.format('HH:mm'),
                });
            }
            if(slots.length < 1) {
                return next({
                    errors: {
                        slots: 'Slots are not valid'
                    }
                });
            }
            repositories.timeslot
                .store(req.user.user_id, slots)
                .then((user) => {
                    res._json({
                        saved: true
                    })
                })
                .catch((err) => {
                    next(err)
                });
        },
        getByUserId: (req, res, next) => {
            repositories.timeslot
                .getByUserId(req.query.user_id)
                .then((slots) => {
                    models.appointment.find({ requested_by: req.user.user_id }, function(err, appointments) {
                        slots_lean = slots.map(function(m) { return m.toObject() });
                        for(var i = 0; i < appointments.length; i++) {
                            var ap_exists = slots_lean.find(function(v) {
                                return v._id == appointments[i].timeslot_id;
                            });
                            if(ap_exists) {
                                ap_exists.approval_status = appointments[i].approval_status;
                            }
                        }
                        slots_lean = slots_lean.map(function(v) {
                            if(v.approval_status === undefined) {
                                v.approval_status = 'NOTREQUESTED';
                            }
                            return v;
                        })
                        res._json(slots_lean)
                    })
                })
                .catch((err) => {
                    res._json([])
                });
        },
        getOwnSlots: (req, res, next) => {
            repositories.timeslot
                .getByUserId(req.user.user_id)
                .then((slots) => {
                    res._json(slots)
                })
                .catch((err) => {
                    res._json([])
                });
        }
    }
}