const { ObjectId } = require("mongoose").Types;
/**
 * @type {import('mongoose').Model}
 */
const Cart = require("./cart.model");

const { v4: uuidv4 } = require("uuid");
const ERRORS = require("../../lib/errors");

function newCart(data, userid) {
  return new Promise(async (resolve, reject) => {
    try {
      const items = Object.entries(Object.values(data)[0]).map((d) => {
        return {
          id: d[0],
          item: d[1].item,
          quantity: d[1].quantity,
        };
      });

      // save
      const cart = await Cart.create({
        UUID: uuidv4(),
        items,
        cart: data,
        user: userid,
        total: data.total,
        price: data.price,
      });

      return resolve(cart);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getCart(uuid) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Cart.aggregate([
        {
          $match: {
            $expr: { $eq: ["$UUID", uuid] },
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

function getCarts() {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await Cart.aggregate([
        { $match: {} },
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

module.exports = {
  newCart,
  updateItem,
  getCart,
  getItemByCategory,
  getCarts,
};
