import { RequestHandler } from "express";
import { Todo } from "../models/todo";

const TODOS: Todo[] = [];

export const createTodo: RequestHandler = (req, res, next) => {
  const text = (req.body as { text: string }).text;
  const newTodo = new Todo(Math.random().toString(), text);

  TODOS.push(newTodo);

  res.status(201).json({ message: "Created todo.", createdTodo: newTodo });
};

export const getTodos: RequestHandler = (req, res, next) => {
  res.status(200).json({ todos: TODOS });
};

export const patchTodo: RequestHandler<{ id: string }> = (req, res, next) => {
  const id = req.params.id;
  const text = (req.body as { text: string }).text;

  const modifyTodo = TODOS.filter((todo) => {
    return todo.id === id;
  })[0];

  if (modifyTodo) {
    modifyTodo.text = text;
    res.status(201).json({ message: "Todo updated", createdTodo: modifyTodo });
  } else {
    throw new Error("Couldn't find todo !");
  }
};

export const deleteTodo: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  const todoIndex = TODOS.findIndex((todo) => todo.id === id);
  TODOS.splice(todoIndex, 1);

  res.status(200).json({ message: "Todo successfuly erased !" });
};
