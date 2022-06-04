module.exports = {
  INTERNAL: {
    code: 500,
    message:
      "Apologies, an internal error occurred, Please try again later or contact us.",
  },
  UNAUTHORIZED: {
    code: 401,
    message:
      "Apologies, cannot process your request. Unauthorized. Please check your request and try again.",
  },
  NOT_UPDATED: {
    code: 401,
    message:
      "Apologies, cannot process your request. The resource was either not found or you are unauthorized. Please check your request and try again.",
  },
  INVALID_SIGNIN: {
    code: 401,
    message:
      "Apologies, The provided username or password are incorrect. Please check your request and try again.",
  },
  ALREADY_AUTHED: {
    code: 203,
    message: "Apologies, Already authorized.",
  },
  USER_ALREADY_EXIST: {
    code: 409,
    message:
      "Apologies, signing up has failed. The provided username and/or email is already in use. Please check your request and try again.",
  },
  MISSING_BODY: {
    code: 400,
    message:
      "Apologies, cannot process your request. The provided info is either partially missing or malformed. Please check your request and try again.",
  },
  MALFORMED_INFO: {
    code: 400,
    message:
      "Apologies, cannot process your request. The provided info is either partially missing or malformed. Please check your request and try again.",
  },
  NOT_FOUND: {
    code: 404,
    message:
      "Apologies, the resource was not found. Please check your request and try again.",
  },
  FORBIDDEN_EXCEED_LIMIT: {
    code: 403,
    message:
      "Apologies, you have exceeded the limit for requests. Try again in a bit",
  },
};
