import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  // получаем все статьи
  try {
    const posts = await PostModel.find().limit(5).exec(); // .limit(5) - перебем последние 5 статей и получием с них теги

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить теги",
    });
  }
};

export const getAll = async (req, res) => {
  // получаем все статьи
  try {
    const posts = await PostModel.find().populate("user").exec(); // полуаем все статьи, и с помощью .populate("user").exect;информацию о пользователе

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

// export const getOne = async (req, res) => {
//   // получаем все статьи
//   try {
//     const postId = req.params.id; // вытаскываем id статьи (/posts/:id - по такому принципу )

//      PostModel.findOneAndUpdate(
//       // достаем одну статью и обновляем количество просмотров viewsCount
//       {
//         _id: postId, // поиск происходит по параметру _id
//       },
//       {
//         $inc: { viewsCount: 1 }, // вторым параметром передаекм, что хотим обновить. (мы инкреметируем viewsCount на 1)
//       },
//       {
//         returnDocument: "after", // 3-й параметр, возвращает нам обновленный вариант
//       },
//       awa (err, doc) => {
//         // 4-й параметр,, это функция, которая будет выполняться и говорить, была ли ошибка или пришел документ
//         if (err) {
//           console.log(err);

//           return res.status(500).json({
//             message: "Не удалось вернуть статью",
//           });
//         }

//         if (!doc) {
//           return res.status(404).json({
//             message: "Статья не найденв",
//           });
//         }

//         res.json(doc);
//       }
//     );
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       message: "Не удалось получить статьи",
//     });
//   }
// };

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; //вытаскываем id статьи (/posts/:id - по такому принципу )

    const updatedPost = await PostModel.findOneAndUpdate(
      // достаем одну статью и обновляем количество просмотров viewsCount
      { _id: postId }, // поиск происходит по параметру _id
      { $inc: { viewsCount: 1 } }, // вторым параметром передаекм, что хотим обновить. (мы инкреметируем viewsCount на 1)
      { returnDocument: "after" } // 3-й параметр, возвращает нам обновленный вариант
    ).populate("user");

    if (!updatedPost) {
      // это функция, которая будет выполняться и говорить, была ли ошибка или пришел документ
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

// export const remove = async (req, res) => {
//   try {
//     const postId = req.params.id; //вытаскываем id статьи (/posts/:id - по такому принципу )

//     PostModel.findOneAndDelete(
//       {
//         _id: postId,
//       },
//       (err, doc) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({
//             message: "Не удалось удалить статью",
//           });
//         }

//         if (!doc) {
//           return res.status(404).json({
//             message: "Статья не найдена",
//           });
//         }

//         res.json({
//           success: true,
//         });
//       }
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не удалось получить статью",
//     });
//   }
// };

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await PostModel.findOneAndDelete({ _id: postId });

    if (!deletedPost) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const create = async (req, res) => {
  // создаем статью
  try {
    const doc = new PostModel({
      title: req.body.title, // body это то что передает пользователь
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId, //
    });

    const post = await doc.save(); // сохраняем документ

    res.json(post); // возвращаем ответ
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title, // body это то что передает пользователь
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(","),
        user: req.userId, //
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
