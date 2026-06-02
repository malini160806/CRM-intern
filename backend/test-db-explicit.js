const mongoose = require('mongoose');
// Construct explicit connection string to bypass SRV DNS issues
const uri = 'mongodb://maliniravanan2006_db_user:n6sCmvziTwtkUhJg@ac-ukqrwmc-shard-00-00.o2f8p4p.mongodb.net:27017,ac-ukqrwmc-shard-00-01.o2f8p4p.mongodb.net:27017,ac-ukqrwmc-shard-00-02.o2f8p4p.mongodb.net:27017/CRM_Enterprise?ssl=true&authSource=admin&retryWrites=true&w=majority';

console.log('Attempting to connect with explicit shard list...');

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas (Explicit URI)');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: Could not connect to MongoDB Atlas');
    console.error(err);
    process.exit(1);
  });
