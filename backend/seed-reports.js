require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const Deal = require('./models/Deal');
const User = require('./models/User');

const seedReportsData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const ceo = await User.findOne({ role: 'CEO' });
    if (!ceo) {
      console.log('CEO not found');
      process.exit(1);
    }

    // Add some leads
    const leadSources = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Other'];
    const leadStatuses = ['Hot', 'Warm', 'Cold'];
    
    for (let i = 0; i < 20; i++) {
      await Lead.create({
        name: `Lead ${i}`,
        email: `lead${i}@example.com`,
        source: leadSources[Math.floor(Math.random() * leadSources.length)],
        status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
        assignedTo: ceo._id,
        createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 90) // Last 90 days
      });
    }

    // Add some deals
    const dealStages = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
    for (let i = 0; i < 15; i++) {
      await Deal.create({
        title: `Enterprise Solution Deal ${i}`,
        value: Math.floor(Math.random() * 50000) + 5000,
        company: `Corporate Client ${i}`,
        status: dealStages[Math.floor(Math.random() * dealStages.length)],
        owner: ceo._id,
        updatedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 60) // Last 60 days
      });
    }

    console.log('Seed data added successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedReportsData();
