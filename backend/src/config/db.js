const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully');
        await sequelize.sync({ alter: true }); // Apply model changes to the database
        console.log('Database synced');
    } catch (error) {
        console.error('PostgreSQL connection failed:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };