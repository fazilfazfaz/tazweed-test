module.exports = (models, config) => {	
	
	return {
		user: require('./user.js')(models, config),
		timeslot: require('./timeslot.js')(models, config),
		appointment: require('./appointment.js')(models, config)
	}
}