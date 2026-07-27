require('dotenv').config();
const mongoose = require('mongoose');
const InvestmentPlan = require('./src/models/InvestmentPlan');

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    // Check if plans already exist
    const count = await InvestmentPlan.countDocuments();
    if (count > 0) {
      console.log('Plans already exist. Emptying...');
      await InvestmentPlan.deleteMany({});
    }

    const plans = [
      {
        name: 'Starter Plan',
        minAmount: 100,
        maxAmount: 1000,
        dailyROIPercentage: 1.5,
        durationDays: 30,
        status: 'Active'
      },
      {
        name: 'Pro Plan',
        minAmount: 1001,
        maxAmount: 5000,
        dailyROIPercentage: 2.0,
        durationDays: 60,
        status: 'Active'
      },
      {
        name: 'Elite Plan',
        minAmount: 5001,
        maxAmount: 100000,
        dailyROIPercentage: 2.5,
        durationDays: 90,
        status: 'Active'
      }
    ];

    await InvestmentPlan.insertMany(plans);
    console.log('Successfully seeded investment plans!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPlans();
