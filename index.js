import express from "express";
import multer from "multer"; // библиотека для загрузки файлов (картинки)
import cors from "cors";

import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://admin:a72DmJIP@cluster0.ukkb5oq.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0" // с помощью mongoose подключаемся к переданной ссылке, указываем: admin:a72DmJIP
  )
  .then(() => {
    console.log("DB OK"); // проверяем удалось ли подключиться
  })
  .catch((err) => console.log("DB Error:" + err)); // если ошибка, будем оповещать об этом.

const app = express(); // создание экспресс приложения, вся логика хранится в переменной app

const storage = multer.diskStorage({
  //создаем хранилище, где будет сохранять все наши картинки
  destination: (_, __, cb) => {
    //создаем специальный путь, куда мы будет сохранять картинки, это функция которая ожидает параметры.
    cb(null, "uploads"); // функция не получает никаких ошибок, и сохраняет файлы в папку uploads
  },
  filename: (_, file, cb) => {
    // обьясняем, как будет называться наш файл (берем название фалйла, которые будет передоваться при загрузки "file")
    cb(null, file.originalname); // file.originalname вытаскиваем оригинальное название
  },
});

const upload = multer({ storage }); // обьясняем что у мультера есть такое хранилтще

app.use(express.json()); // указываем, что в нашем приложение, необходимо использовать json. Данная команда позволит нам читать json, который приходит в запросах
app.use(cors());
app.use("/uploads", express.static("uploads")); // проверяет любой запрос на /uploads, express.static("uploads")) - проверяет, есть ли в папке то, что мы передаем
//static - делает гет запрос на получения статичного файла

//app, get, post, и т.д. - это все роут.

//req - запрос от клиента, res - ответ клиенту
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
); // если придет запрос на "/auth/register", мы проверим есть ли там то, что нам нужно, с помощью - registerValidation, если да, тогда будет выполняться коллбек
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  // роут для /upload, upload.single("image") - ожидаем файл с картинкой
  res.json({
    url: `/uploads/${req.file.originalname}`, // возвращаем клиенту путь, по которому сохранили картинку
  });
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(5454, (error) => {
  // запуск приложения, 5454 - это порт, второй параметр это функция( необязательная) - в который мы описываем, запустился ли сервер
  if (error) {
    return console.log(error);
  }

  console.log("Server OK");
});
