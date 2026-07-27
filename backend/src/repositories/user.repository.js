const User = require('../models/User');

class UserRepository {
  async create(userData, session) {
    const user = new User(userData);
    return user.save({ session });
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findByReferralCode(referralCode) {
    return User.findOne({ referralCode });
  }

  async findById(id) {
    return User.findById(id);
  }

  async updateWalletAndIncome(userId, amount, isROI, session) {
    const update = { $inc: { walletBalance: amount } };
    if (isROI) {
      update.$inc.totalROIEarned = amount;
    } else {
      update.$inc.totalLevelIncome = amount;
    }
    return User.findByIdAndUpdate(userId, update, { new: true, session });
  }
}

module.exports = new UserRepository();
