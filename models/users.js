import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // схема нашей таблицы (создаем схему с помощью mongoose.Schema) и описываем все свойства, которые могу быть у пользователя
    fullName: {
      // описываем настройки fullName
      type: String, // тип строка
      require: true, // поле обязательное!
    },
    email: {
      // писываем настройки email
      type: String,
      require: true,
      unique: true, // почта должна быть уникальна ( только одна)
    },
    passwordHash: {
      //описываем настройки пароля
      type: String,
      require: true,
    },
    avatarUrl: String, // передаем сразу тип, так как поле ненобязательное (если обязательное, передаем обьект, как в примере выше)
  },
  {
    timestamps: true, // обьясняем схеме, что она автоматически при создании любого пользователя, должна прикрутить дату создания и обновление этой сущности
  }
);

export default mongoose.model("User", UserSchema); // експортируем схему, под названием "User" и указываем саму схему "UserSchema"
