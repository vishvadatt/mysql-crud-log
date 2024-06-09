import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
const app: Express = express();
const port = 3000;
import userRoutes from "./routes/userRoutes";
import { logRequest, logRequestMiddleware } from "./utils/logger";
import path from "path";
import serveIndex from "serve-index";

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const localPath = path.resolve(__dirname, "../logs");
app.use(
  "/logs",
  express.static(localPath),
  serveIndex(localPath, { icons: true })
);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send("something broke");
  next();
});

app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
