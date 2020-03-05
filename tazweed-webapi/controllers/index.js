module.exports = (models, repositories, config) => {
	return {
		user: require('./user.js')(models, repositories, config),
		timeslot: require('./timeslot.js')(models, repositories, config),
		appointment: require('./appointment.js')(models, repositories, config),
	}
}