// One-time cleanup: removes applications made by POSTER accounts
// (they should never have existed), plus their notifications and chat messages.
//
//   node scripts/cleanBadApplications.js            -> only SHOWS what would be deleted
//   node scripts/cleanBadApplications.js --delete   -> actually deletes
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Message = require('../models/Message');

const shouldDelete = process.argv.includes('--delete');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const posters = await User.find({ userType: 'poster' }).select('_id name');
  const posterIds = posters.map((u) => u._id);

  const bad = await Application.find({ userId: { $in: posterIds } }).populate('jobId', 'type');

  if (bad.length === 0) {
    console.log('✅ No applications made by poster accounts. Nothing to clean.');
  } else {
    console.log(`Found ${bad.length} application(s) made by poster accounts:`);
    bad.forEach((a) =>
      console.log(` - ${a.applicationId} | ${a.applicantName} | job: ${a.jobId ? a.jobId.type : '(deleted job)'}`)
    );

    if (shouldDelete) {
      const ids = bad.map((a) => a._id);
      const n = await Notification.deleteMany({ applicationId: { $in: ids } });
      const m = await Message.deleteMany({ applicationId: { $in: ids } });
      const a = await Application.deleteMany({ _id: { $in: ids } });
      console.log(`🗑️  Deleted ${a.deletedCount} applications, ${n.deletedCount} notifications, ${m.deletedCount} messages.`);
    } else {
      console.log('\nDry run only. Run again with --delete to remove them.');
    }
  }

  await mongoose.disconnect();
})().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
