const { ObjectId } = require("mongoose").Types;
/**
 * @type {import('mongoose').Model}
 */
const User = require("./user.model");
const ERRORS = require("../../lib/errors");
const { hashPassword, checkPassword } = require("../../lib/utils");
const { jwtSign } = require("../../lib/jwt");

function signUp(data, req) {
  return new Promise(async (resolve, reject) => {
    try {
      // check if exist
      const userExist = await User.findOne({
        $or: [
          {
            username: data.username,
          },
          {
            email: data.email,
          },
        ],
      });

      if (userExist) return reject(ERRORS.USER_ALREADY_EXIST);

      // hash password
      const hashedPassword = await hashPassword(data.password);

      // save
      const user = await new User({
        ...data,
        password: hashedPassword,
      }).save(req.app.settings);

      // jwt sign
      const token = await jwtSign({ _id: user._id });
      return resolve({
        username: user.username,
        id: user._id,
        token: token,
      });
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function signIn(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ username: data.username });

      // check if found
      if (!user) return reject(ERRORS.UNAUTHORIZED);

      // check password
      const isMatching = await checkPassword(data.password, user.password);

      if (!isMatching) return reject(ERRORS.INVALID_SIGNIN);

      // jwt sign
      const token = await jwtSign({ _id: user._id });

      return resolve({ username: user.username, id: user._id, token: token });
    } catch (error) {
      console.log(error);
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getUsers() {
  return new Promise(async (resolve, reject) => {
    try {
      const results = User.find({ isDeleted: false }, { __v: 0, password: 0 });

      resolve(results);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getMe(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await User.aggregate([
        {
          $match: {
            $expr: { $eq: ["$_id", ObjectId(id)] },
          },
        },
        {
          $lookup: {
            from: "authorities",
            let: { authority_id: "$authority" },
            pipeline: [
              // match
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$authority_id"] },
                },
              },
              // project
              {
                $project: {
                  authority: 1,
                  _id: 1,
                },
              },
            ],
            as: "authority",
          },
        },
        {
          $unwind: {
            path: "$authority",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: { __v: 0, password: 0 },
        },
      ]);

      console.log(results);

      if (!results[0]) return reject(ERRORS.UNAUTHORIZED);

      resolve(results[0]);
    } catch (error) {
      reject({ ...ERRORS.UNAUTHORIZED, stack: error });
    }
  });
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getMe,
};
