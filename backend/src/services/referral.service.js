const mongoose = require('mongoose');
const userRepository = require('../repositories/user.repository');
const referralRepository = require('../repositories/referral.repository');
const walletService = require('./wallet.service');
const mlmConfig = require('../config/mlm');

class ReferralService {
  /**
   * Distribute referral income upwards through the MLM tree.
   * Runs within a MongoDB transaction.
   */
  async distributeIncome(sourceUserId, investmentId, investmentAmount, session) {
    let currentUser = await userRepository.findById(sourceUserId);
    if (!currentUser) return;

    let currentLevel = 0;
    const maxLevels = mlmConfig.levels.length; // usually 3

    while (currentLevel < maxLevels && currentUser.referredBy) {
      // Move up one level
      const parentUser = await userRepository.findById(currentUser.referredBy);
      if (!parentUser) break;

      const percentage = mlmConfig.levels[currentLevel];
      const incomeAmount = (investmentAmount * percentage) / 100;

      // 1. Create ReferralIncome record
      await referralRepository.create({
        receiverId: parentUser._id,
        sourceUserId: sourceUserId,
        investmentId: investmentId,
        level: currentLevel + 1,
        amount: incomeAmount
      }, session);

      // 2. Update parent user's wallet via WalletService
      await walletService.credit(
        parentUser._id,
        incomeAmount,
        'Referral Credit',
        investmentId, // using investmentId as reference
        `Level ${currentLevel + 1} commission from user ${currentUser.fullName}`,
        session,
        false // isROI = false
      );

      // Move pointers up for next iteration
      currentUser = parentUser;
      currentLevel++;
    }
  }

  async getDirectReferrals(userId) {
    // using User model directly here for simplicity, or we can add to repo
    const User = require('../models/User');
    return User.find({ referredBy: userId }).select('fullName email mobile createdAt status');
  }

  async getReferralTree(userId) {
    const User = require('../models/User');
    
    // Recursive function to build tree
    const buildTree = async (parentId) => {
      const children = await User.find({ referredBy: parentId }).select('fullName email createdAt');
      const tree = [];
      for (let child of children) {
        const subChildren = await buildTree(child._id);
        tree.push({
          ...child.toObject(),
          children: subChildren
        });
      }
      return tree;
    };

    return buildTree(userId);
  }
}

module.exports = new ReferralService();
