const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const crypto = require('crypto');

class AuthService {
  async register(userData) {
    const { fullName, email, mobile, password, referredByCode } = userData;

    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    let referredBy = null;
    if (referredByCode) {
      const parent = await userRepository.findByReferralCode(referredByCode);
      if (parent) {
        referredBy = parent._id;
      } else {
        throw new Error('Invalid referral code');
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique referral code
    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Create user
    const user = await userRepository.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      referralCode,
      referredBy
    });

    return {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      referralCode: user.referralCode
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    return {
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        walletBalance: user.walletBalance,
        referralCode: user.referralCode
      }
    };
  }
}

module.exports = new AuthService();
