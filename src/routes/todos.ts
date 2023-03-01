import { Router } from "express";
import { createTodo } from "./../controllers/todo";
import { getTodos } from "./../controllers/todo";
import { patchTodo } from "./../controllers/todo";
import { deleteTodo } from "./../controllers/todo";

const router = Router();

router.get("/", getTodos);
router.post("/", createTodo);
router.patch("/:id", patchTodo);
router.delete("/:id", deleteTodo);

export default router;
