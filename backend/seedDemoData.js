require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Investment = require('./src/models/Investment');
const InvestmentPlan = require('./src/models/InvestmentPlan');
const ROIHistory = require('./src/models/ROIHistory');
const ReferralIncome = require('./src/models/ReferralIncome');
const Transaction = require('./src/models/Transaction');

const seedDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding demo data...');

    // 1. Get the primary user (the one logged in)
    const primaryUser = await User.findOne();
    if (!primaryUser) throw new Error('No user found! Please register a user first.');

    const userId = primaryUser._id;
    console.log(`Seeding demo data for user: ${primaryUser.fullName}`);

    // 2. Wipe existing data for this user to avoid duplication
    await Investment.deleteMany({});
    await ROIHistory.deleteMany({});
    await ReferralIncome.deleteMany({});
    await Transaction.deleteMany({});

    // Also delete any other users to reset the referral tree
    await User.deleteMany({ _id: { $ne: userId } });

    // 3. Create Referral Tree Users
    const createUser = async (name, referredBy) => {
      return await User.create({
        fullName: name,
        email: `${name.toLowerCase()}@demo.com`,
        mobile: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        password: 'hashedpassword',
        walletBalance: 0,
        referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        referredBy: referredBy
      });
    };

    // Branch 1
    const rahul = await createUser('Rahul', userId);
    const akash = await createUser('Akash', rahul._id);
    const sneha = await createUser('Sneha', akash._id);

    // Branch 2
    const kiran = await createUser('Kiran', userId);
    const john = await createUser('John', kiran._id);
    const david = await createUser('David', john._id);

    // 4. Update Primary User Wallet
    primaryUser.walletBalance = 24350;
    await primaryUser.save();

    // 5. Create Investment (₹20,000)
    let plan = await InvestmentPlan.findOne({ name: 'Elite Plan' });
    if (!plan) {
      plan = await InvestmentPlan.findOne();
    }

    const investmentDate = new Date();
    investmentDate.setDate(investmentDate.getDate() - 5);

    const investment = await Investment.create({
      userId,
      planId: plan._id,
      amount: 20000,
      dailyROI: 2.5,
      status: 'Active',
      endDate: new Date(new Date().setDate(new Date().getDate() + 90)),
      createdAt: investmentDate
    });

    await Transaction.create({
      userId,
      type: 'Investment',
      amount: -20000,
      description: `Investment in ${plan.name}`,
      status: 'Success',
      createdAt: investmentDate
    });

    // 6. Create ROI History (5 days, ₹250 each day -> Total ₹1250)
    for (let i = 1; i <= 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (5 - i));
      
      const roiAmount = 250;

      await ROIHistory.create({
        userId,
        investmentId: investment._id,
        amount: roiAmount,
        date: d.toISOString().split('T')[0],
        status: 'Credited'
      });

      await Transaction.create({
        userId,
        type: 'ROI Credit',
        amount: roiAmount,
        description: `Daily ROI for Investment`,
        status: 'Success',
        createdAt: d
      });
    }

    // 7. Create Referral Income (Total ₹850)
    // Rahul (L1) -> ₹500
    // Akash (L2) -> ₹250
    // Sneha (L3) -> ₹100
    const refData = [
      { from: rahul, level: 1, amount: 500 },
      { from: akash, level: 2, amount: 250 },
      { from: sneha, level: 3, amount: 100 }
    ];

    for (let i = 0; i < refData.length; i++) {
      const data = refData[i];
      const d = new Date();
      d.setDate(d.getDate() - 2);

      await ReferralIncome.create({
        receiverId: userId,
        sourceUserId: data.from._id,
        investmentId: investment._id,
        level: data.level,
        amount: data.amount,
        createdAt: d
      });

      await Transaction.create({
        userId,
        type: 'Referral Credit',
        amount: data.amount,
        description: `Level ${data.level} Referral Commission from ${data.from.fullName}`,
        status: 'Success',
        createdAt: d
      });
    }

    // 8. Add a dummy deposit transaction for realism
    await Transaction.create({
      userId,
      type: 'Deposit',
      amount: 43100,
      description: 'Initial Deposit',
      status: 'Success',
      createdAt: new Date(investmentDate.getTime() - 86400000)
    });

    console.log('Demo data successfully seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDemo();
