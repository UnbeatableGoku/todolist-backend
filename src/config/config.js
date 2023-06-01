const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.db_url);
    console.log('connected to mongodb');
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectToMongo;
