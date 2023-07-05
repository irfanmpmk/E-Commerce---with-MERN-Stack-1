import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
} from "./../controllers/categoryController.js";
import categoryModel from "../models/categoryModel.js";

const router = express.Router();

//routes
// create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//get all category
router.get("/get-category", getAllCategoryController); //here we are not using middleware coz we want to show categories even without loggedin.

//get single category
router.get("/get-singleCategory/:slug", getSingleCategoryController); //on base of slug in the url we are finding.

//delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
