import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req); // тут мы пишем что хотим получить все ошибки, передаем req - обьясняя, что нужно все вытащить из запроса

  if (!errors.isEmpty()) {
    // проверяем, если ошибки не пустые (тобишь что-то есть),
    return res.status(400).json(errors.array()); // если ошибки есть, возвращаем ответ 400 (res.status(400)), что ответ неверный и возваращем все ошибки, которые смогли провалидировать (.json(errors.array() )
  }

  next();
};
