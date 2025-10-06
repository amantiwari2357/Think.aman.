const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// MongoDB models (using Mongoose)
db.User = require('./User');
db.Follow = require('./Follow');
db.Post = require('./Post');
db.Problem = require('./Problem');

// Import Sequelize models here (if any)
// db.User = require('./user.model')(sequelize, Sequelize);
// Add associations here

module.exports = db;
