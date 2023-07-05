import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
} from "../controllers/productController.js";
import formidable from "express-formidable"; //install express-formidable middleware from npm.

const router = express.Router();

//routes create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//routes update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//get single product
router.get("/get-product/:slug", getSingleProductController);

//get Photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//filter products
router.post("/product-filters", productFilterController);

//count products
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

export default router;
// module.exports = router;
