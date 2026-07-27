const cron = require('node-cron');
const roiService = require('../services/roi.service');
const cronRepository = require('../repositories/cron.repository');
const logger = require('../utils/logger');

// Run every midnight (00:00)
// '0 0 * * *'
const scheduleDailyROI = () => {
  cron.schedule('0 0 * * *', async () => {
    const today = new Date().toISOString().split('T')[0];
    const jobName = 'DAILY_ROI_PROCESS';

    logger.info(`Cron Job Triggered: ${jobName} for ${today}`);

    try {
      // Idempotency: Check if the cron job already ran successfully today
      const alreadyRan = await cronRepository.checkExists(jobName, today);
      if (alreadyRan) {
        logger.info(`Cron Job ${jobName} already completed successfully today. Skipping.`);
        return;
      }

      // Create a running record
      const startTime = Date.now();
      const cronRecord = await cronRepository.create({
        jobName,
        runDate: today,
        status: 'Running'
      });

      // Process ROI
      const result = await roiService.processDailyROI();

      // Update record as completed
      const durationMs = Date.now() - startTime;
      await cronRepository.updateStatus(cronRecord._id, {
        status: 'Completed',
        durationMs,
        recordsProcessed: result.processedCount
      });

      logger.info(`Cron Job ${jobName} completed successfully in ${durationMs}ms`);

    } catch (error) {
      logger.error(`Cron Job ${jobName} failed: ${error.message}`);
      
      // Attempt to log failure
      try {
        const cronRecord = await cronRepository.checkExists(jobName, today); // Note: checkExists only finds Completed. We might need to find by runDate and JobName regardless of status to update error.
        // Quick fix: find running job
        const CronHistory = require('../models/CronHistory');
        const runningJob = await CronHistory.findOne({ jobName, runDate: today, status: 'Running' });
        if (runningJob) {
          await cronRepository.updateStatus(runningJob._id, {
            status: 'Failed',
            errorLog: error.message
          });
        }
      } catch (err) {
        logger.error(`Failed to update cron history on error: ${err.message}`);
      }
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });
};

module.exports = scheduleDailyROI;
