module.exports = (mongoose) => {
    var appointment_schema = new mongoose.Schema(
        {
            requested_by: {
                type: String,
                required: true,
                validate: {
                    validator: function() {
                        return new Promise((resolve, reject) => {
                            let user = mongoose.model('user');
                            user.findOne({
                                _id: this.requested_by
                            }, (err, u) => resolve(u ? true : false));
                        });
                    },
                    message: 'Requested by is invalid'
                }
            },
            seller_id: {
                type: String,
                required: true,
                validate: {
                    validator: function() {
                        return new Promise((resolve, reject) => {
                            let user = mongoose.model('user');
                            user.findOne({
                                _id: this.seller_id
                            }, (err, u) => resolve(u ? true : false));
                        });
                    },
                    message: 'Seller is invalid'
                }
            },
            timeslot_id: {
                type: String,
                required: true,
                validate: {
                    validator: function() {
                        return new Promise((resolve, reject) => {
                            let timeslot = mongoose.model('timeslot');
                            timeslot.findOne({
                                _id: this.timeslot_id,
                                user_id: this.seller_id
                            }, (err, tslot) => resolve(tslot ? true : false));
                        });
                    },
                    message: 'Timeslot is invalid'
                }
            },
            approval_status: {
                type: String,
                enum: ['APPROVED', 'PENDING', 'REJECTED'],
                required: true,
            }
        }
    );
    return mongoose.model('appointment', appointment_schema)
}