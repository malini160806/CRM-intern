const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');
mongoose.connect('mongodb://127.0.0.1:27017/ai_crm').then(async () => {
  const users = await User.find({});
  const userIds = users.map(u => u._id.toString());
  
  const leads = await Lead.find({});
  let count = 0;
  for (let lead of leads) {
    if (lead.assignedTo && !userIds.includes(lead.assignedTo.toString())) {
      await Lead.updateOne({ _id: lead._id }, { $set: { assignedTo: null, assignedSalesLead: null } });
      count++;
    }
  }
  console.log('Fixed ' + count + ' orphaned leads.');
  mongoose.disconnect();
});
