const transactionRepository = require('../repositories/transaction.repository');
const userRepository = require('../repositories/user.repository');

class WalletService {
  async credit(userId, amount, type, referenceId, description, session, isROI = false) {
    if (amount <= 0) throw new Error('Credit amount must be positive');
    
    // Create transaction record
    await transactionRepository.create({
      userId,
      type,
      amount,
      referenceId,
      description
    }, session);

    // Atomic $inc update on user wallet and total income fields
    return userRepository.updateWalletAndIncome(userId, amount, isROI, session);
  }

  async debit(userId, amount, type, referenceId, description, session) {
    if (amount <= 0) throw new Error('Debit amount must be positive');
    
    // Check balance first
    const user = await userRepository.findById(userId);
    if (user.walletBalance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Create transaction record (amount is negative for debit)
    await transactionRepository.create({
      userId,
      type,
      amount: -amount,
      referenceId,
      description
    }, session);

    // Atomic $inc update on user wallet
    return userRepository.updateWalletAndIncome(userId, -amount, false, session);
  }
}

module.exports = new WalletService();
