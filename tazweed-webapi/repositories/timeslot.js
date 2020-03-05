module.exports = (models, config) => {
	return {
		store: (user_id, slots) => {
			return new Promise((resolve, reject) => {
				models.timeslot.deleteMany({
					user_id: user_id
				}, function (err) {
					if(err) {
						return reject(err);
					}
					slots = slots.map(function(v) {
						v.user_id = user_id;
						return v;
					})
					models.timeslot.create(slots, function (err) {
						if(err) {
							reject(err);
						} else {
							resolve();
						}
					})
				})
			})
		},
		getByUserId: (user_id) => {
		    return new Promise((resolve, reject) => {
				models.timeslot.find({
					user_id: user_id
				}, function (err, timeslots) {
					if (err || !timeslots) {
						reject(err);
					} else {
						resolve(timeslots);
					}
				})
			})
		}
	}
}