const router = require("express").Router();

// middlewares
const { isAdmin } = require("../middlewares");

// routes
const user = require("./user/user.routes");
const cart = require("./cart/cart.routes");
const order = require("./order/order.routes");
const item = require("./item/item.routes");
const authority = require("./authority/authority.routes");
const category = require("./category/category.routes");

// API routes
router.use("/users", user);
router.use("/items", item);
router.use("/carts", cart);
router.use("/orders", order);
router.use("/authorities", isAdmin, authority);
router.use("/categories", category);

module.exports = router;
