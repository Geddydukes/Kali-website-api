const express = require("express");
const router = express.Router();

const db = require("../models");

// path is now '/articles'
router.get("/", (req, res) => {
  db.Article.find({}, (err, allArticles) => {
    if (err) {
      return console.log(err);
    }
    res.render("articles/index", {
      articles: allArticles,
      title: "New Articles",
    });
  });
});

router.get("/new", (req, res) => {
  if (!req.session.currentUser) {
    // if no currentuser cookie no access
    return res.redirect("/auth/login");
  }
  db.Author.find({}, (err, allAuthors) => {
    if (err) {
      return console.log(err);
    }
    res.render("articles/new", {
      title: "New Article",
      authors: allAuthors,
    });
  });
});

router.post("/", (req, res) => {
  if (!req.session.currentUser) {
    // if no currentuser cookie no access
    return res.redirect("/auth/login");
  }
  db.Article.create(req.body, (err, newArticle) => {
    if (err) {
      return console.log(err);
    }
    db.Author.findById(req.body.author, (err, foundAuthor) => {
      if (err) {
        return console.log(err);
      }
      foundAuthor.articles.push(newArticle);
      foundAuthor.save((err, savedAuthor) => {
        if (err) {
          return console.log(err);
        }
        res.redirect(`/articles/${newArticle._id}`);
      });
    });
  });
});

router.get("/:id", async (req, res) => {
  try {
    const foundArticle = await db.Article.findById(req.params.id).populate(
      "author"
    );
    res.render("articles/show", {
      article: foundArticle,
      title: foundArticle.title,
    });
  } catch (error) {
    return console.log(error);
  }
});

router.get("/:id/edits", async (req, res) => {
  try {
    const foundArticle = await db.Article.findById(req.params.id);
    const allAuthors = await db.Author.find({});
    const oldAuthor = await db.Author.findById(foundArticle.author);
    oldAuthor.articles.remove(foundArticle);
    oldAuthor.save();
    res.render("articles/edits", {
      article: foundArticle,
      title: "Edit Article",
      authors: allAuthors,
    });
  } catch (err) {
    return console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log(req);
    const updatedArticle = await db.Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const newAuthor = await db.Author.findById(req.body.author);
    newAuthor.articles.push(updatedArticle);
    newAuthor.save();
    res.redirect(`/articles/${req.params.id}`);
  } catch (err) {
    return console.log(err);
  }
});

router.delete("/:id", (req, res) => {
  db.Article.findByIdAndDelete(req.params.id, (err, deletedArticle) => {
    if (err) {
      return console.log(err);
    }

    db.Author.findById(deletedArticle.author, (err, foundAuthor) => {
      if (err) {
        return console.log(err);
      }

      foundAuthor.articles.remove(deletedArticle);
      foundAuthor.save();
    });

    res.redirect("/articles");
  });
});

module.exports = router;
