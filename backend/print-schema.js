require('dotenv').config();
const mongoose = require('mongoose');

// Import all models to ensure they are registered
require('./models/User');
require('./models/Lead');
require('./models/Deal');
require('./models/Meeting');

const printSchema = async () => {
  try {
    const Meeting = mongoose.model('Meeting');
    console.log('--- Meeting Schema ---');
    console.log(JSON.stringify(Meeting.schema.obj, null, 2));
    
    console.log('\n--- Meeting Paths ---');
    console.log(Object.keys(Meeting.schema.paths));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

printSchema();
