import jwt from "jsonwebtoken"; // генерирует специальный токен
import bcrypt from "bcrypt"; // библиотека для шифровки пароля
import { validationResult } from "express-validator"; // будет проверять есть ли ошибки или нет в форме регистрации
import UserSchema from "../models/users.js";

export const register = async (req, res) => {
  // регистрация пользователя
  try {
    const password = req.body.passwordHash; // вытаскивыем из реквест бади пароль
    const salt = await bcrypt.genSalt(10); // генерация соль для шифрования (типо алгоритма)

    const hash = await bcrypt.hash(password, salt); //шифруем пароль, передаем сюда: пароль (password) и алгоритм(salt) : bcrypt.hash(password, salt)

    const doc = new UserSchema({
      // создаем пользователя с помощью монго и передаем всю информацию
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save(); // сохраняем пользователя в БД

    //после того как документ был создан, шифруем айди

    const token = jwt.sign(
      // генерируем токен и шифруем
      // шифрование делаем с помощью jwt
      {
        _id: user._id, // щифуем айди, так как этого достаточно, чтобы получить инфо о пользователе
      },
      "secret123", // второй параметр, это ключ secret123, может быть любым
      {
        expiresIn: "30d", // срок жизни токена - 30 дней
      }
    );

    const { passwordHash, ...userData } = user._doc; // вытаскиваем с помощью диструктаризации passwordHash, но не будем его использовать
    // информация о пароле нам не нужна, когда мы делаем регистрацию

    res.json({
      ...userData, // возваращем инфо о пользователе
      token, // возвращаем сам токен
    }); // возварщаем информацию о пользователе (ответ должен біть только один!!!)
  } catch (err) {
    console.log(err); // передаем саму ошибку в консоль
    res.status(500).json({
      message: "Не удалось зарегестрироваться", // говорим пользователю что не удалось
    });
  }
}; // если придет запрос на "/auth/register", мы проверим есть ли там то, что нам нужно, с помощью - registerValidation, если да, тогда будет выполняться коллбек

export const login = async (req, res) => {
  // делаем авторизацию
  try {
    const user = await UserSchema.findOne({ email: req.body.email }); // ищем одного пользователя в БД, с помощью метода  findOne, по email

    if (!user) {
      // если почты такой нету, возваращаем ответ 404 и говорим что ничего в БД нет!
      return res.status(404).json({
        message: "Неверный логин или пароль", // сообщение передаем максимально поверхосно, для того чтобы мошенник не смог понять какая есть почта, какой нет
      });
    }

    const isValidPass = await bcrypt.compare(
      // сравнием 2 пароля которые есть в теле запроса: req.body.password и которые есть в документе у пользователя user._doc.passwordHash
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      // если они не сходятся, выдаем ошибку
      return res.status(400).json({
        message: "Неверный логин или пароль", // сообщение передаем максимально поверхосно, для того чтобы мошенник не смог понять какая есть почта, какой нет
      });
    }

    const token = jwt.sign(
      // шифрование делаем с помощью jwt
      {
        _id: user._id, // щифуем айди, так как этого достаточно, чтобы получить инфо о пользователе
      },
      "secret123", // второй параметр, это ключ secret123, может быть любым
      {
        expiresIn: "30d", // срок жизни токена - 30 дней
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData, // возваращем инфо о пользователе
      token, // возвращаем сам токен
    });
  } catch (err) {
    console.log(err); // передаем саму ошибку в консоль
    res.status(500).json({
      message: "Не удалось авторизироваться", // говорим пользователю что не удалось
    });
  }
};

export const getMe = async (req, res) => {
  // чтобы выполнить код снизу, в функции checkAuth необхожимо выполнить next
  // получаем инфо о себе
  try {
    const user = await UserSchema.findById(req.userId); // ищем пользователя, передавая из реквест userId информацию о нашем айди и ищем айди в нашей БД

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
