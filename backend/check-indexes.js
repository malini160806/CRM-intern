require('dotenv').config();
const mongoose = require('mongoose');

const checkIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const collections = ['users', 'leads', 'contacts'];
    
    for (const col of collections) {
      const indexes = await mongoose.connection.db.collection(col).indexes();
      console.log(`Indexes for ${col}:`, JSON.stringify(indexes, null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkIndexes();
