import express from "express";
import routes from "./api/index.js";
import cors from "cors";
import { addMockData } from "./lib/data.js";

const app = express();
app.use(cors({ origin: "http://localhost:6080" }));
app.use(express.json());
app.use("/api", routes);

export { app };
