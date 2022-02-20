//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO

mongoose.connect(uri || "mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////For all articelss/////////////////////////////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("article added succesfully");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("succfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////////////////////For a specific articel///////////////////////////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article matcjing that title wa found");
      }
    });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("sucess");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body }, function (err) {
      if (!err) {
        res.send("succefully upadated one aarticle");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("succefully deleted specific article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(port, function () {
  console.log(`server started at port ${port}`);
});
