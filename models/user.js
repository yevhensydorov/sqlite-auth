const Sequelize = require('sequelize'),
			bcrypt		= require('bcrypt')

// create a sequelize instance with our local sqlite database information.
const sequelize = new Sequelize(null, null, null, { // credentials to sqlite DB(user, password, ip)
	dialect: 'sqlite',
	storage: 'database.sqlite' // path to DB sqlite file
});

//Set Up User MODELS
const User = sequelize.define('User', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
})