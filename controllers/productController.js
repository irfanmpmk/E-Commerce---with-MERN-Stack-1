import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields; //took all non filed keys from productModel to parse. //refer express-formidable doc in npm.
    const { photo } = req.files; //took all file type keys from productModel to parse.

    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000: //size 1000000 MB or less
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1MB" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path); //In fs.readFile() method, we can read a file in a non-blocking asynchronous way, but in the fs.readFileSync() method, we can read files in a synchronous way by waiting it to finish to continue other task.
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Products Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while creating new product",
    });
  }
};

//Update Product (Note: This has Only slight change with create product)
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields; //took all non filed keys from productModel to parse. //refer express-formidable doc in npm.
    const { photo } = req.files; //took all file type keys from productModel to parse.

    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000: //size 1000000 MB or less
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1MB" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path); //In fs.readFile() method, we can read a file in a non-blocking asynchronous way, but in the fs.readFileSync() method, we can read files in a synchronous way by waiting it to finish to continue other task.
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Products Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating the product",
    });
  }
};

//get All products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in getting products",
      error: error.message,
    });
  }
};

//get Single Product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting single product",
      error,
    });
  }
};

//get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOneAndDelete(req.params.pid)
      .select("-photo");
    res.status(200).send({
      Success: true,
      message: "Product deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//filters
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    console.log(req.body);
    let args = {};
    if (checked.length > 0) args.category = checked; // Multiple options can be checked not like radio.
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }; //mongodb conditioning options used here.
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      message: "Filter Products Succesfully done",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error wile filtering Products",
      error,
    });
  }
};

//Product Count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while counting products",
      error,
    });
  }
};

//Product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page controller",
      error,
    });
  }
};
