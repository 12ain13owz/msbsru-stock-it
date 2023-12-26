import express, { Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import config from "config";

import log from "./utils/logger";
import connectDatabase from "./utils/connect-db";

const app = express();
const port = config.get<number>("port");

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  log.info(`Server listening on port ${port}`);
  connectDatabase();
});

app.get("", (_, res: Response) => {
  res.sendStatus(200);
});
