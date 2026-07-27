const mongoose = require('mongoose');
const investmentRepository = require('../repositories/investment.repository');
const roiRepository = require('../repositories/roi.repository');
const walletService = require('./wallet.service');
const logger = require('../utils/logger');

class ROIService {
  /**
   * Process daily ROI for all active investments.
   * This is called by the cron job.
   */
  async processDailyROI() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    logger.info(`Starting daily ROI processing for ${today}`);

    const activeInvestments = await investmentRepository.getActiveInvestments();
    let processedCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const investment of activeInvestments) {
      // Check if investment is past its end date
      if (new Date() > investment.endDate) {
        investment.status = 'Completed';
        await investment.save();
        continue;
      }

      // Idempotency Check: Did we already process this investment today?
      const existingROI = await roiRepository.checkExists(investment._id, today);
      if (existingROI) {
        skipCount++;
        continue;
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const roiAmount = (investment.amount * investment.dailyROI) / 100;

        // 1. Create ROI History
        const roiRecord = await roiRepository.create({
          userId: investment.userId,
          investmentId: investment._id,
          amount: roiAmount,
          date: today,
          status: 'Credited'
        }, session);

        // 2. Update Wallet (Atomic)
        await walletService.credit(
          investment.userId,
          roiAmount,
          'ROI Credit',
          roiRecord._id,
          `Daily ROI for investment ${investment._id}`,
          session,
          true // isROI = true
        );

        await session.commitTransaction();
        processedCount++;
      } catch (error) {
        await session.abortTransaction();
        logger.error(`Error processing ROI for investment ${investment._id}: ${error.message}`);
        errorCount++;
      } finally {
        session.endSession();
      }
    }

    logger.info(`Completed ROI processing for ${today}. Processed: ${processedCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
    return { processedCount, skipCount, errorCount };
  }
}

module.exports = new ROIService();
