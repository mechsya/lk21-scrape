import dotenv from "dotenv";

dotenv.config();

import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/routes";
const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(routes);

app.get("/", (request: Request, response: Response) => {
  response.json({ message: "API is working!" });
});

export default app;
