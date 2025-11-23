import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import propertyRoutes from "./routes/property.route.js";
import favoriteRoutes from "./routes/favorite.route.js";
import uploadRoute from "./routes/upload.route.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://prod-real-estate-frontend.onrender.com",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/property", propertyRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/upload", uploadRoute);

export default app;
