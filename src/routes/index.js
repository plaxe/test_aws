const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const guid = require("uuid");
const _jsonFile = require("../modules/file/textDbModule");

/* get home page. */
router.get("/:state?", function (req, res, next) {
  let items = _jsonFile.getItems();

  if (req.params.state) items = items.filter((todo) => todo.state === req.params.state);

  res.render("index", {
    data: items,
    errors: req.flash("errors"),
    menu: req.params.state || 'all',
  });
});

/* get search page. */
router.post("/search:state?", function (req, res, next) {
  let items = _jsonFile.getItems();

  if (req.body.query) items = items.filter((todo) => todo.item.includes(req.body.query));

  if (req.params.state) items = items.filter((todo) => todo.state === req.params.state);

  res.render("index", {
    data: items,
    errors: req.flash("errors"),
  });
});

/* post add item. */
router.post("/add", function (req, res, next) {
  let todos = _jsonFile.getItems();

  if (todos.some((x) => x.item == req.body.item)) {
    req.flash("errors", [`item '${req.body.item}' Item with same key exits`]);
    res.redirect("/progress");
    return;
  }

  todos.push({ item: req.body.item, state: "progress", id: guid.v4() });

  _jsonFile.saveItems(todos);
  res.redirect("/progress");
});

/* get update item. */
router.get("/update/:id", function (req, res, next) {
  let todos = _jsonFile.getItems();

  res.render("update", {
    id: req.params.id,
    text: todos.find((todo) => todo.id == req.params.id).item,
  });
});

/* post update item. */
router.post("/update", function (req, res, next) {
  let todos = _jsonFile.getItems();
  let todo = todos.find((todo) => todo.id == req.body.id);

  todo.item = req.body.text;

  _jsonFile.saveItems(todos);
  res.redirect("/progress");
});

/* post set-state item. */
router.post("/set-state/:id", function (req, res, next) {
  let todos = _jsonFile.getItems();

  todos.find((todo) => todo.id == req.params.id).state = req.body.state;

  _jsonFile.saveItems(todos);
  res.redirect("/progress");
});

module.exports = router;
