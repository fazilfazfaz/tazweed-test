module.exports = (models, repositories, config) => {
    return {
        store: (req, res, next) => {
            if(!req.body.seller_id) {
                return next({
                    errors: {
                        seller: 'Seller is required'
                    }
                });
            }
            if(!req.body.timeslot_id) {
                return next({
                    errors: {
                        timeslot: 'Timeslot is required'
                    }
                });
            }
            repositories.appointment
                .store(req.user.user_id, req.body.seller_id, req.body.timeslot_id)
                .then(() => {
                    res._json({
                        created: true
                    });
                })
                .catch((err) => {
                    next(err)
                });
        },
        getOwnAppointments: (req, res) => {
            repositories.appointment
                .getUsersAppointmentRequests(req.user.user_id)
                .then((appointments) => {
                    res._json(appointments)
                })
                .catch((err) => {
                    res._json([])
                });
        },
        getOwnRequestedAppointments: (req, res) => {
            repositories.appointment
                .getAppointmentRequestsAgainstSeller(req.user.user_id)
                .then((appointments) => {
                    res._json(appointments)
                })
                .catch((err) => {
                    res._json([])
                });
        },
        getOwnPendingRequestedAppointments: (req, res) => {
            repositories.appointment
                .getAppointmentRequestsAgainstSeller(req.user.user_id, 'PENDING')
                .then((appointments) => {
                    res._json(appointments)
                })
                .catch((err) => {
                    res.json([])
                });
        },
        approve: (req, res) => {
            if(!req.body.appointment_id) {
                return next({
                    errors: {
                        appointment: 'Appointment must be selected'
                    }
                });
            }
            repositories.appointment
                .take_action(req.user.user_id, req.body.appointment_id, 'APPROVED')
                .then(() => {
                    res._json({
                        approved: true
                    })
                })
                .catch((err) => {
                    res._json({
                        approved: false
                    })
                });
        },
        reject: (req, res) => {
            if(!req.body.appointment_id) {
                return next({
                    errors: {
                        appointment: 'Appointment must be selected'
                    }
                });
            }
            repositories.appointment
                .take_action(req.user.user_id, req.body.appointment_id, 'REJECTED')
                .then(() => {
                    res._json({
                        approved: true
                    })
                })
                .catch((err) => {
                    res._json({
                        approved: false
                    })
                });
        },
    }
}