import express, { Request, Response, NextFunction } from "express";
import toDoRoutes from "./routes/todos";
import { json } from "body-parser";

const app = express();

const port = 5000;

app.use(json());
app.use("/todo", toDoRoutes);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);

app.listen(port, () => {
  console.log(`Listening to port ${port}, on ${"http://localhost:5000"}`);
});
