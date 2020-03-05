module.exports = (mongoose) => {
	return {
		user: require('./user.js')(mongoose),
        timeslot: require('./timeslot.js')(mongoose),
        appointment: require('./appointment')(mongoose),
	}
}