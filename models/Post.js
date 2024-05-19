import mongoose from "mongoose";
import UserSchema from "../models/users.js";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String, // тип строка
      require: true, // поле обязательное!
    },
    text: {
      type: String,
      require: true,
      unique: true, // почта должна быть уникальна ( только одна)
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      // что за пользователь создал статью
      type: mongoose.Schema.Types.ObjectId, // обьясняем чтип
      ref: "User", // будет ссылаться на отдельную можель, по айди и оттуда вытягивать пользователя
      require: true,
    },
    imageUrl: String, // передаем сразу тип, так как поле ненобязательное (если обязательное, передаем обьект, как в примере выше)
  },
  {
    timestamps: true, // обьясняем схеме, что она автоматически при создании любого пользователя, должна прикрутить дату создания и обновление этой сущности
  }
);

export default mongoose.model("Post", PostSchema); // експортируем схему, под названием "User" и указываем саму схему "UserSchema"
