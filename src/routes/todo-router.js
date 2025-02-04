const express = require('express');
const todoRouter = express.Router();

todoRouter.post('/', (req, res, next) => {});
todoRouter.get('/', (req, res, next) => {});
todoRouter.get('/:todoId', (req, res, next) => {});
todoRouter.put('/:todoId', (req, res, next) => {});
todoRouter.delete('/:todoId', (req, res, next) => {});

module.exports = todoRouter;
