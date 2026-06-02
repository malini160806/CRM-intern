require('dotenv').config();
const mongoose = require('mongoose');

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const collections = ['users', 'leads', 'deals', 'accounts', 'products', 'invoices', 'meetings'];
    
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col).countDocuments();
      console.log(`${col}: ${count} documents`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkData();
