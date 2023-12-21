import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { Sequelize } from "sequelize";

const app = express();
const port = process.env.PORT || 3000;
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database/msbsru_stock_it.sqlit",
});

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());

app.listen(port, async () => {
  console.log(`${port}`);

  try {
    await sequelize.authenticate();
    console.log("Connected Successfully");
  } catch (error) {
    console.log("Unable to connect", error);
    process.exit(1);
  }
});

app.get("", (req, res) => {
  res.send("Test Check");
});
