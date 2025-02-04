const express = require('express');
const errorMiddleware = require('./src/middlewares/error');
const notFound = require('./src/middlewares/not-found');
const morgan = require('morgan');
const cors = require('cors');
const limiter = require('./src/utils/rate-limit');
const authRouter = require('./src/routes/auth-router');
const userRouter = require('./src/routes/user-router');
const todoRouter = require('./src/routes/todo-router');
require('dotenv').config();

const app = express();
// --------------------------------------------------------------------------
app.use(express.json());
app.use(morgan('dev'));
app.use(limiter);
app.use(cors());
// --------------------------------------------------------------------------

// จัดการ Routing
app.use('/api/v1/auth', authRouter);
app.use('api/v1/user', userRouter);
app.use('api/v1/todo', todoRouter);

// --------------------------------------------------------------------------
app.use(notFound);
app.use(errorMiddleware);

const PORT = 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
