const ReferralIncome = require('../models/ReferralIncome');

class ReferralRepository {
  async create(referralData, session) {
    const referral = new ReferralIncome(referralData);
    return referral.save({ session });
  }

  async findByUserId(receiverId) {
    return ReferralIncome.find({ receiverId }).populate('sourceUserId', 'fullName email').sort({ createdAt: -1 });
  }
}

module.exports = new ReferralRepository();
