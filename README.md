**CLI** ลงแพ็คเกจและ library ที่จำเป็น

`npm i` ย่อมาจาก `npm install` สามารถลงได้ที่ละ library หรือที่ละหลายๆ library โดยให้เว้นวรรคระหว่างชื่อ

(หากไม่จำเป็นต้องใช้ library ตัวไหนก็ไม่จำเป็นต้องลง)

```bash
npm init -y
npm i express cors dotenv bcryptjs jsonwebtoken cloudinary multer morgan express-rate-limit
```

##

สร้างไฟล์ index.js หรือ server.js ใน folder หลัก อยู่ในระดับเดียวกันกับ ไฟล์ package.json

**/package.json** แก้หรือเพิ่มเพื่อให้ใช้คำสั่ง `npm run dev` หรือ `npm start` ได้

(เลือกอย่างใดอย่างหนึ่ง หากไม่ได้ลง nodemon แบบ global ไว้ จะต้อง `npm i nodemon` ด้วย )

```js
  "scripts": {
    "dev": "nodemon server.js",
    "start": "nodemon server.js",
  },
```

ใน package.json สามารถดู libraries ทั้งหมดที่เราลงไว้ใต้หัวข้อ dependencies

##

**/server.js** import express เข้ามาใช้ในการตั้ง server

`PORT` เราสามารถเลือกใช้ port ใดก็ได้ตามที่ต้องการ แต่ว่า port นั้นๆจะต้องไม่ถูกใช้งานอยู่

`PORT` เราสามารถใส่เลข port ที่ต้องการในไฟล์ dotenv และเอามาเรียกใช้ได้ในภายหลัง

```js
const express = require('express');
const app = express();
// code อื่นๆ อยู่ตรงนี้
const PORT = 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

##

สร้าง folder ชื่อว่า src ในระดับสูงสุด

ภายใน src สร้าง folder ย่อยมา configs, controllers, middlewares, models, routes, services, utils, validate

##

**/src/middlewares/error.js** สร้าง file ชื่อ error.js ใน folder middlewares

โครงสร้างของ error middleware จะแตกต่างจาก middleware ตัวอื่นๆเพราะมันจะรับ parameter 4ตัว (middleware ปกติจะรับแค่3ตัว ไม่รับ err)

```js
const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorMiddleware;
```

**/src/middlewares/not-found.js** สร้าง file ชื่อ not-found.js ใน folder middlewares
not-found จะใช้ในกรณีที่ path ที่ถูกเรียกมาไม่มีอยู่ใน server

```js
const notFound = (req, res, next) => {
  res
    .status(404)
    .json({ message: `Request URL: ${req.method} ${req.url} not found` });
};

module.exports = notFound;
```

##

**/server.js** import และเรียกใช้ middleware ทั้งแบบ built-in และที่เราเขียนเอง

```js
// import library ที่มี middleware อยู่
const morgan = require('morgan');
const cors = require('cors');
const errorMiddleware = require('./src/middlewares/error');
const notFound = require('./src/middlewares/not-found');

// import built-in middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// import middleware ที่เราเขียนเอง
app.use(notFound);
app.use(errorMiddleware);
```

หากเรามี path อื่นๆ เราจำเป็นที่จะต้องใส่ `app.use(notFound)` ไว้ท้ายสุด เนื่องจาก code เราจะรันจากบนลงล่าง request จะเข้าไปทำ path แรกที่เข้าได้ หากเราเอา notFoundไว้ก่อน มันจะทำnotFound และไม่ลงไปหาตัวอื่นๆ

##

**/src/utils/rate-limit.js** สร้าง file ใน folder utils ชื่อ rate-limit.js

rate-limit เป็นตัวจำกัดจำนวนของ request ที่สามารถยิงเข้ามาใน server เราได้ภายในระยะเวลาที่เรากำหนด

`windowMs` คือระยะเวลา นับเป็น milliseconds

`limit` คือจำนวนครั้งที่สามารถยิงเข้ามาได้

`message` ข้อความที่ยิงออกไปหหากมี request เข้ามามากกว่าที่เรากำหนดไว้

```js
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  message: { message: 'Too many requests --' },
});

module.exports = limiter;
```

**/server.js** import และเรียกใช้ limiter

```js
const limiter = require('./src/utils/rate-limit');

app.use(limiter);
```

##

**src/utils/create-error.js** สร้าง file ชื่อ create-error.js ใน folder utils

```js
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

module.exports = createError;
```

##

**/server.js** สร้าง routes ตามที่เราต้องการ

```js
// import อยู่ข้างบนนี้

app.use('api/v1/auth');
app.use('api/v1/user');
app.use('api/v1/todo');

// notFound อยู่ข้างล่างนี้
```

ไปสร้าง file ของแต่ละ route ภายใน folder /src/routes

##

**/src/routes/auth-router.js** สร้าง file ชื่อ auth-router.js ใน folder routes

```js
const express = require('express');
const authRouter = express.Router();

authRouter.post('/register', (req, res, next) => {
  try {
    res.status(201).json({ message: 'Register successful' });
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
```

สามารถเขียน code ไว้ก่อนแล้วค่อยก็อปไปใส่ใน controller หรือรอเขียนใน controller เลยที่เดียว

**/server.js** import และเรียกใช้ authRouter

```js
const authRouter = require('./src/routes/auth-router');

// some other code

app.use('api/v1/auth', authRouter);
```

endpoint ของเราในกรณีนี้คือ `localhost:8081/api/v1/auth/register`

`localhost:8081` มาจาก server เราเปิดอยู่ที่ port 8081

`/api/v1/auth` path ในหน้า server.js

`/register` path ใน auth-router.js

##

**/src/controllers/auth-controller.js** สร้าง file ชื่อ auth-controller.js ใน folder controllers

แต่ละ route จะมี file controller ของตัวเอง

```js
const authController = {};

authController.register = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Register successful' });
  } catch (error) {
    next(error);
  }
};

authController.login = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};
module.exports = authController;
```

ใช้รูปแบบ try-catch เพื่อทำการดักจับ error

เมื่อเกิดการ error ขึ้น โค้ดเราจะเด้งไปรันในส่วนของ catch ซึ่งจะทำการ next(error)

หากฟังชั่น next() มี argument เมื่อไหร่ มันจะส่งไปที่ error middleware ทันที

**/src/routes/auth-router.js** import และเรียกใช้ authController ในไฟล์ auth-router

```js
const express = require('express');
const authController = require('../controllers/auth-controller');
const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

module.exports = authRouter;
```

auth-router.js เราจะดูเรียบร้อยขึ้น

# Database

```bash
npx prisma init
```

เมื่อเรารันคำสั่งด้านบน เราจะได้ folder ชื่อ prisma ซึ่งในนั้นจะมี schema มาให้

เราจะได้ file .env มาด้วย

##

**/.env** แก้ไข้ DATABASE_URL

```js
DATABASE_URL = 'mysql://USER:PASSWORD@HOST:PORT/DATABASE';
```

`USER` ชื่อของผู้ใช้ เช่น root

`PORT` database รันอยุ่ที่portไหน

`PASSWORD` ของใครของมัน

`DATABASE` ชื่อ database ที่เราต้องการใช้ หากไม่มีอยู่ มันจะสร้างให้เรา

**/primsa/schema.prisma** แก้ provider

```js
datasource db {
  provider = "mysql" // แก้ตรงนี้ให้เป็น mysql
  url      = env("DATABASE_URL")
}
```

##

**/prisma/schema.prisma** เข้าไปสร้าง โตรงสร้าง ของ Table เรา

```js
model Todolist {
  id         Int      @id @default(autoincrement())
  title      String
  statusTodo Boolean  @default(false)
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamp(0)
  updatedAt  DateTime @updatedAt @map("updated_at") @db.Timestamp(0)
  userId     Int
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("todolist")
}
```

`model` ตำสั่งสร้าง table

`Todolist` ชื่อของ table

`id` `title` `statusTodo` ชื่อของ column

`Int` `String` `Boolean` datatype ของแต่ละ column

`@id` constraint - column นี้เป็น primary key

`@defaul(value)` constraint - ตั้งค่า default ของ column

`now()` จะคืนค่าเป็นเวลาปัจจุบัน

`@updatedAt` จะคืนค่า time stamp ปัจจุบันโดยอัตโนมัติทุกๆครั่งที่แถวนั้นถูกแก้ไข้

`@map("column_name")` เปลี่ยนชื่อ column ใช้ "double quote"

`@@map("table_name")` เปลี่ยนชื่อ table ใข้ "double quote"

```js
  userId     Int
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
```

การสร้าง foreign key โดนการ link 2 table เข้าหากัน

##

เมื่อทำการสร้าง table เสร็จตามที่เราต้องการ ให้รันคำสั่งด้านล่างเพื่อ push ทั้งหมดไปใส่ MySQL

```bash
npx prisma db push
```

##

**/src/models/prisma.js** สร้างไฟล์ prisma.js ใน folder models

```js
const { PrismaClient } = require('@primsa/client');

const prisma = new PrismaClient();

module.exports = prisma;
```

##

**/src/controllers/auth-controller.js** import prisma เพื่อนำไปใช้ในฟังชั่น
