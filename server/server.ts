import express from "express";
import { APIRouter } from "./routes/APIRouter";

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", APIRouter);

app.listen(process.env.PORT || port, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || port}`
  );
});
