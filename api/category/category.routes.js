const router = require("express").Router();

// Middlewares
const { isAdmin } = require("../../middlewares");

// Controller
const {
  getCategories,
  getCategory,
  newCategory,
  deleteCategory,
} = require("./category.controller");

// Utils
const { jwtTokenPayload } = require("../../lib/jwt");

// Validation
const validate = require("../../lib/validation");
const POST_SCHEMA = require("../../lib/validation/schemas/category.routes/post");

// GET ../v1/categories/
router.get("/", async (req, res, next) => {
  try {
    const result = await getCategories();

    return res.status(200).json({ categories: result });
  } catch (error) {
    return next(error);
  }
});

// GET ../v1/categories/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = await jwtTokenPayload(req.cookies.token);

    const result = await getCategory(id);

    return res.status(200).json({ requester: _id, category: result });
  } catch (error) {
    return next(error);
  }
});

// DELETE ../v1/categories/:id
router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = await jwtTokenPayload(req.cookies.token);

    const result = await deleteCategory(id);

    return res
      .status(200)
      .json({ requester: _id, deleted: result.deletedCount });
  } catch (error) {
    return next(error);
  }
});

// POST ../v1/categories/
router.post("/", isAdmin, async (req, res, next) => {
  try {
    const { _id } = await jwtTokenPayload(req.cookies.token);

    // Validate
    await validate(req.body, POST_SCHEMA);

    const result = await newCategory(req.body);

    return res.status(200).json({ requester: _id, category: result });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
