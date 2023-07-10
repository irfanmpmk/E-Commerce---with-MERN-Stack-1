import express from "express";
import colors from "colors";
import dotenv from "dotenv"; //env environment creator to data fetch.
import morgan from "morgan"; //data logger
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path";

//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json()); //instead of body-parsing we can use this
app.use(morgan("dev")); //morgan for logging
app.use(cors()); // cors used to log the front end backend port errors
app.use(express.static(path.join(__dirname, "./client/build")));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//PORT
const PORT = process.env.PORT || 8080; //server running on port defined in .env file, if .env has any issue come, port 8080 is using as it typed here.

//run listen

app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.blue
      .bgYellow
  );
});
