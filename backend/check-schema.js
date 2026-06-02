require('dotenv').config();
const mongoose = require('mongoose');

const checkSchema = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the first document in the meetings collection
    const meeting = await mongoose.connection.db.collection('meetings').findOne();
    if (meeting) {
      console.log('Found a meeting document:');
      console.log(JSON.stringify(meeting, null, 2));
    } else {
      console.log('No documents found in meetings collection.');
    }

    // List all model names registered in Mongoose
    console.log('Registered Mongoose Models:', mongoose.modelNames());

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkSchema();
