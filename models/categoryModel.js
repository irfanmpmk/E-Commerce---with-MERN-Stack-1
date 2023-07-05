import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  //npm install slugify first
  slug: {
    //This replace white space with - or as per your input.
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("Category", categorySchema); //collection name 'Category', reference is categorySchema. After this, create a router file in routes folder.
