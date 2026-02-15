import express from "express";
import routes from "./api/index.js";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api", routes);

export { app };
