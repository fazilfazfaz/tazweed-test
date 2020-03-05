module.exports = (mongoose) => {
    var uschema = new mongoose.Schema(
        {
            user_id: {
                type: String,
                unique: false,
                required: true,
                validate: {
                	validator: function() {
                		return new Promise((resolve, reject) => {
                			let user = mongoose.model('user');
                			user.findOne({
                				_id: this.user_id
                			}, (err, u) => resolve(u ? true : false));
                		});
                	},
                	message: 'User is invalid'
                }
            },
            from: {
                type: String,
                required: true,
            },
            to: {
                type: String,
                required: true,
            }
        }
    );
    uschema.methods.toJSON = function() {
        var obj = this.toObject();
        delete obj.user_id;
        return obj;
    };
    return mongoose.model('timeslot', uschema)
}