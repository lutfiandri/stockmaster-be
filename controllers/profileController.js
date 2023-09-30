const { AnswerAttempt } = require('../models/answerAttempt');
const User = require('../models/user');

const getCurrentProfile = async (req, res) => {
  try {
    const user = req.auth.payload.user;
    const userResult = await User.findOne({
      email: user.email,
    });

    // get this week points
    const now = new Date();

    const timeStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 1
    );
    timeStart.setHours(0, 0, 0, 0); // set to 00:00:00.000 on Monday

    const timeEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 7
    );
    timeEnd.setHours(23, 59, 59, 999); // set to 23:59:59.999 on Sunday

    const attempts = await AnswerAttempt.find({
      type: 'game',
      userEmail: user.email,
      createdAt: {
        $gte: timeStart,
        $lt: timeEnd,
      },
    });

    let totalPoints = 0;
    attempts.forEach((attempt) => {
      totalPoints += attempt.totalPoints;
    });

    const result = userResult.toObject();
    result.totalPointsThisWeek = totalPoints;

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCurrentProfile,
};
