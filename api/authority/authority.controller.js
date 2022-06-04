/**
 * @type {import('mongoose').Model}
 */
const Authority = require("./authority.model");
const ERRORS = require("../../lib/errors");

function newAuthority(data) {
  return new Promise(async (resolve, reject) => {
    try {
      // save
      const authority = await Authority.create(data);
      return resolve(authority);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getAuthorities() {
  return new Promise(async (resolve, reject) => {
    try {
      const results = Authority.find({}, { __v: 0 });

      resolve(results);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

function getAuthority(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = Authority.find({ _id: id }, { __v: 0 });

      resolve(result);
    } catch (error) {
      reject({ ...ERRORS.INTERNAL, stack: error });
    }
  });
}

module.exports = {
  newAuthority,
  getAuthorities,
  getAuthority,
};
