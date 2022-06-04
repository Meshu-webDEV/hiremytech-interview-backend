/**
 * @type {import('mongoose').Model}
 */
const Category = require("./category.model");
const ERRORS = require("../../lib/errors");

function newCategory(data) {
  return new Promise(async (resolve, reject) => {
    try {
      // save
      const category = await Category.create(data);
      return resolve(category);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getCategories() {
  return new Promise(async (resolve, reject) => {
    try {
      const results = Category.find({}, { __v: 0 });

      resolve(results);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getCategory(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = Category.findById(id, { __v: 0 });

      resolve(result);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function deleteCategory(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = Category.deleteOne({ _id: id });

      resolve(result);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

module.exports = {
  newCategory,
  getCategories,
  getCategory,
  deleteCategory,
};
