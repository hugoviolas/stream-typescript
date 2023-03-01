"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.patchTodo = exports.getTodos = exports.createTodo = void 0;
const todo_1 = require("../models/todo");
const TODOS = [];
const createTodo = (req, res, next) => {
    const text = req.body.text;
    const newTodo = new todo_1.Todo(Math.random().toString(), text);
    TODOS.push(newTodo);
    res.status(201).json({ message: "Created todo.", createdTodo: newTodo });
};
exports.createTodo = createTodo;
const getTodos = (req, res, next) => {
    res.status(200).json({ todos: TODOS });
};
exports.getTodos = getTodos;
const patchTodo = (req, res, next) => {
    const id = req.params.id;
    const text = req.body.text;
    const modifyTodo = TODOS.filter((todo) => {
        return todo.id === id;
    })[0];
    if (modifyTodo) {
        modifyTodo.text = text;
        res.status(201).json({ message: "Todo updated", createdTodo: modifyTodo });
    }
    else {
        throw new Error("Couldn't find todo !");
    }
};
exports.patchTodo = patchTodo;
const deleteTodo = (req, res, next) => {
    const id = req.params.id;
    const todoIndex = TODOS.findIndex((todo) => todo.id === id);
    TODOS.splice(todoIndex, 1);
    res.status(200).json({ message: "Todo successfuly erased !" });
};
exports.deleteTodo = deleteTodo;
