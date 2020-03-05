module.exports = (models, config) => {
	return {
		get: (user_id) => {
			return new Promise((resolve, reject) => {
                models.user.findOne({
                    '_id': user_id
                }, function(err, user) {
                    if(err || !user) {
                        return reject(err);
                    }
                    resolve(user);
                });
			})
		},
		getSellers: (user_id) => {
			return new Promise((resolve, reject) => {
                models.user.find({
                    'usertype': 'SELLER',
                    '_id': {
                        '$ne': user_id
                    }
                }, function(err, sellers) {
                    if(err || !sellers) {
                        return reject(err);
                    }
                    resolve(sellers);
                });
			})
		}
	}
}