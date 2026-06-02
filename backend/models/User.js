const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['CEO', 'SalesLead', 'SalesPerson', 'admin', 'salesLead', 'salesPerson'],
      default: 'SalesPerson',
    },
    assignedSalesLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedSalesPersons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // CEO Fields
    companyName: String,
    companySize: String,
    industry: String,
    website: String,
    adminCode: String,
    // Sales Lead Fields
    department: String,
    teamSize: String,
    managerId: String,
    // Sales Person Fields
    employeeId: String,
    salesRegion: String,
    reportingManager: String,
    
    profilePic: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
