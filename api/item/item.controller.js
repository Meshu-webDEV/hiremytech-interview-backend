const { ObjectId } = require("mongoose").Types;
/**
 * @type {import('mongoose').Model}
 */
const Item = require("./item.model");
const ERRORS = require("../../lib/errors");

function newItem(data) {
  return new Promise(async (resolve, reject) => {
    try {
      // save
      const item = await Item.create({
        ...data,
        image: "https://picsum.photos/300",
      });

      return resolve(item);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getItem(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Item.aggregate([
        {
          $match: {
            $expr: { $eq: ["$_id", ObjectId(id)] },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { user_id: "$seller" },
            pipeline: [
              // match
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$user_id"] },
                },
              },
              // project
              {
                $project: {
                  username: 1,
                  _id: 1,
                },
              },
            ],
            as: "seller",
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { category_id: "$category" },
            pipeline: [
              // match
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$category_id"] },
                },
              },
              // project
              {
                $project: {
                  name: 1,
                  _id: 1,
                },
              },
            ],
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$seller",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      if (!result.length) return reject(ERRORS.NOT_FOUND);

      resolve(result);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getItemByCategory(category_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await Item.aggregate([
        {
          $match: {
            $expr: { $eq: ["$category", ObjectId(category_id)] },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { user_id: "$seller" },
            pipeline: [
              // match
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$user_id"] },
                },
              },
              // project
              {
                $project: {
                  username: 1,
                  _id: 1,
                },
              },
            ],
            as: "seller",
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { category_id: "$category" },
            pipeline: [
              // match
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$category_id"] },
                },
              },
              // project
              {
                $project: {
                  name: 1,
                  _id: 1,
                },
              },
            ],
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$seller",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      // if (!results.length) return reject(ERRORS.NOT_FOUND);

      resolve(results);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getItems() {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await Item.aggregate([
        { $match: {} },
        {
          $lookup: {
            from: "users",
            let: { user_id: "$seller" },
            pipeline: [
              // match
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$user_id"] },
                },
              },
              // project
              {
                $project: {
                  username: 1,
                  _id: 1,
                },
              },
            ],
            as: "seller",
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { category_id: "$category" },
            pipeline: [
              // match
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$category_id"] },
                },
              },
              // project
              {
                $project: {
                  name: 1,
                  _id: 1,
                },
              },
            ],
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$seller",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      resolve(results);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getMyItems(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await Item.aggregate([
        {
          $match: {
            $expr: { $eq: ["$seller", ObjectId(id)] },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { user_id: "$user" },
            pipeline: [
              // match
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$user_id"] },
                },
              },
              // project
              {
                $project: {
                  username: 1,
                  _id: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      resolve(results);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function updateItem(userid, id, data) {
  return new Promise(async (resolve, reject) => {
    try {
      // save
      const item = await Item.updateOne({ _id: id, seller: userid }, data);

      if (!item.modifiedCount) return reject(ERRORS.NOT_UPDATED);

      return resolve(item);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function deductItemQuantity(id, quantity) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("deducting..");
      console.log(id);
      console.log(quantity);

      // save
      const item = await Item.updateOne(
        { _id: id },
        { $inc: { quantity: -quantity } }
      );

      if (!item.modifiedCount) return reject(ERRORS.NOT_UPDATED);

      return resolve(item);
      resolve();
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

module.exports = {
  newItem,
  updateItem,
  getItem,
  getMyItems,
  getItemByCategory,
  getItems,
  deductItemQuantity,
};
