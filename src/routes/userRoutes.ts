import { Request, Response, Router, query } from "express";
import { db } from "../config/database";
import { logError, logRequestMiddleware } from "../utils/logger";
import { Query } from "../utils/database";

const router = Router();

router.post(
  "/users",
  logRequestMiddleware,
  async (req: Request, res: Response) => {
    try {
      const reqBody = req.body;
      // const result: any = await db.query(`insert into users set ?`, [reqBody]);
      const result: any = await Query(
        `insert into users set ?`,
        [reqBody],
        req
      );
      if (result[0].affectedRows > 0) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: "somethinf wrong to create user" });
      }
    } catch (error) {
      logError(`create user error: ${error}`, "error");
      return res.status(500).json(error);
    }
  }
);

router.get(
  "/users",
  logRequestMiddleware,
  async (req: Request, res: Response) => {
    try {
      // const [rows]: any = await db.execute("select * from users");
      const rows: any = await Query("select * from users", {}, req);
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(400).json({ message: "something wrong to getUsers" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

router.get(
  "/users/:id",
  logRequestMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result: any = await Query(
        `select * from users where id = ${id}`,
        {},
        req
      );
      console.log(result);
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: "something wrong to getSingle User" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.put(
  "/users/:id",
  logRequestMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const reqBody = req.body;
      const result: any = await Query(
        `update users set ? where id = ?`,
        [reqBody, id],
        req
      );
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "update Successfully..." });
      } else {
        res.status(400).json({ messsage: "something wrong to update user" });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.delete(
  "/users/:id",
  logRequestMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result: any = await Query(
        `delete from users where id =${id}`,
        {},
        req
      );
      console.log(result);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "delete successfully" });
      } else {
        res.status(200).json({ message: "something wrong to delete user" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
export default router;
