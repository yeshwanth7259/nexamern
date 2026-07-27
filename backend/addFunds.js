require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Transaction = require('./src/models/Transaction');

const addFunds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    // Find all users
    const users = await User.find();
    
    for (const user of users) {
      user.walletBalance += 100000;
      await user.save();
      
      await Transaction.create({
        userId: user._id,
        type: 'Deposit',
        amount: 100000,
        description: 'Test Deposit (Admin)',
        status: 'Success'
      });
      console.log(`Added 100,000 to user ${user.fullName}`);
    }

    console.log('Successfully added funds to all users!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

addFunds();
