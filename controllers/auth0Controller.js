const User = require('../models/user');

const upsertUser = async (req, res) => {
  try {
    const { user } = req.body.event;

    delete user.app_metadata;
    delete user.user_metadata;
    delete user.user_id;
    delete user.multifactor;

    const filter = { email: user.email };
    const update = { $set: user };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const result = await User.updateOne(filter, update, options);

    console.log(result);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  upsertUser,
};
