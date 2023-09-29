const { AnswerAttempt } = require('../models/answerAttempt');
const User = require('../models/user');

const getLeaderBoard = async (req, res) => {
  try {
    const { timeFrame } = req.query;

    let timeStart = null;
    let timeEnd = null;

    const now = new Date();

    if (timeFrame === 'weekly') {
      // from monday to sunday
      timeStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 1
      );
      timeStart.setHours(0, 0, 0, 0); // set to 00:00:00.000 on Monday

      timeEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 7
      );
      timeEnd.setHours(23, 59, 59, 999); // set to 23:59:59.999 on Sunday
    } else {
      // the default is daily
      timeStart = new Date();
      timeStart.setHours(0, 0, 0, 0); // set to 00:00:00.000 today
      timeEnd = new Date();
      timeEnd.setHours(23, 59, 59, 999); // set to 23:59:59.999 today
    }

    const attempts = await AnswerAttempt.find({
      type: 'game',
      createdAt: {
        $gte: timeStart,
        $lt: timeEnd,
      },
    });

    // map[email->string]:points->number
    const userAggregationMap = {};

    attempts.forEach((attempt) => {
      // if not in map, add it
      if (!userAggregationMap[attempt.userEmail]) {
        userAggregationMap[attempt.userEmail] = attempt.totalPoints;
      } else {
        userAggregationMap[attempt.userEmail] += attempt.totalPoints;
      }
    });

    const result = Object.entries(userAggregationMap)
      .map((userAggregation) => {
        return {
          userEmail: userAggregation[0],
          totalPoints: userAggregation[1],
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((u, i) => {
        return {
          ...u,
          rank: i + 1,
        };
      });

    const userEmails = result.map((r) => r.userEmail);

    const users = await User.find({ email: { $in: userEmails } });
    const usersMap = users.reduce((map, user) => {
      map[user.email] = user;
      return map;
    }, {});

    result.users = usersMap;

    const result2 = {
      leaderBoards: result,
      users: usersMap,
    };

    return res.json({
      success: true,
      data: result2,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeaderBoard,
};
