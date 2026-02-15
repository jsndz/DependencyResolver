import express from "express";
import path from "path";
import routes from "./src/routes.ts";
import cors from "cors";
const app = express();
const PORT = 3000;


app.use(cors({origin:"http://localhost:5173"}));
app.use(express.json());
app.use("/api", routes);

app.use(express.static(path.join(process.cwd(), "public")));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
