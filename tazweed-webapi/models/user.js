module.exports = (mongoose) => {
    var uschema = new mongoose.Schema(
        {
            username: {
                type: String,
                unique: true,
                required: [true, 'Username is required']
            },
            usertype: {
                type: String,
                enum: ['USER', 'SELLER'],
                required: true
            },
            password: {
                type: String,
                required: [true, 'Password is required']
            }
        }
    );
    uschema.methods.toJSON = function() {
        var obj = this.toObject();
        delete obj.password;
        delete obj.__v;
        return obj;
    };
    return mongoose.model('user', uschema)
}