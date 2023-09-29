const mongoose = require('mongoose');
const Game = require('../models/game');
const { AnswerAttempt } = require('../models/answerAttempt');
const { Question } = require('../models/question');

const addGame = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: 10 } },
    ]).exec();

    const questionIds = questions.map((question) => question._id);

    const newGame = new Game({
      questionIds: questionIds,
    });

    const result = await newGame.save();

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getLastGame = async (req, res) => {
  try {
    const user = req.auth.payload.user;
    const gameResult = await Game.findOne({
      // gameId: gameId,
    })
      .sort({ _id: -1 })
      .exec();

    const result = gameResult.toObject();

    // get if user has attempted
    const attempt = await AnswerAttempt.findOne({
      userEmail: user.email,
      gameId: result._id,
    })
      .sort({ _id: -1 })
      .exec();

    if (!attempt) {
      result.attempted = false;
    } else {
      result.attempted = true;
      result.lastAttempt = attempt;
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getGames = async (req, res) => {
  try {
    const pipeline = [{ $match: {} }];

    if (req.query.questions == 1) {
      pipeline.push({
        $lookup: {
          from: 'questions',
          localField: 'questionIds',
          foreignField: '_id',
          as: 'questions',
        },
      });

      pipeline.push({
        $project: {
          questions: {
            multipleChoice: {
              trueOptionId: 0,
            },
          },
        },
      });

      // sort questions based on questionIds
      pipeline.push({
        $addFields: {
          questions: {
            $arrayToObject: {
              $map: {
                input: '$questions',
                as: 'question',
                in: {
                  k: { $toString: '$$question._id' },
                  v: '$$question',
                },
              },
            },
          },
        },
      });
    }

    const result = await Game.aggregate(pipeline).exec();

    const user = req.auth.payload.user;

    const attemptPromises = result.map(async (r) => {
      const attempt = await AnswerAttempt.findOne({
        type: 'game',
        userEmail: user.email,
        gameId: r._id,
      })
        .sort({ _id: -1 })
        .exec();
      r.lastAttempt = attempt;
      return r;
    });

    const result2 = await Promise.all(attemptPromises);

    return res.json({
      success: true,
      data: result2,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'invalid object id',
      });
    }

    const patternId = new mongoose.Types.ObjectId(id);

    const pipeline = [{ $match: { _id: patternId } }];

    if (req.query.questions == 1) {
      pipeline.push({
        $lookup: {
          from: 'questions',
          localField: 'questionIds',
          foreignField: '_id',
          as: 'questions',
        },
      });

      pipeline.push({
        $project: {
          questions: {
            multipleChoice: {
              trueOptionId: 0,
            },
          },
        },
      });

      // sort questions based on questionIds
      pipeline.push({
        $addFields: {
          questions: {
            $arrayToObject: {
              $map: {
                input: '$questions',
                as: 'question',
                in: {
                  k: { $toString: '$$question._id' },
                  v: '$$question',
                },
              },
            },
          },
        },
      });
    }

    const result = await Game.aggregate(pipeline).exec();

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: `stock pattern with id ${id} not found`,
      });
    }

    const user = req.auth.payload.user;
    const attempt = await AnswerAttempt.findOne({
      type: 'learn',
      userEmail: user.email,
      gameId: patternId,
    })
      .sort({ _id: -1 })
      .exec();
    result[0].lastAttempt = attempt;

    return res.json({ success: true, data: result[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'invalid object id',
      });
    }

    const pattern = await Game.findById(id);
    if (!pattern) {
      return res.status(404).json({
        success: false,
        message: `stock pattern with id ${id} not found`,
      });
    }

    await Game.deleteOne({ _id: id });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGames,
  getGame,
  getLastGame,
  addGame,
  deleteGame,
};
