const createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  hbs = require("hbs"),
  handlebars = require("handlebars"),
  expressHbs = require("express-handlebars"),
  indexRouter = require("./routes/index"),
  loginRouter = require("./routes/login");

const session = require("express-session"),
  passport = require("passport"),
  localStrategy = require("passport-local").Strategy,
  flash = require("connect-flash");

const passportModule = require("./modules/auth/passportModule"),
  app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));

handlebars.registerHelper("if_eq", function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "layout",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");

// logger
app.use(logger("dev"));

passportModule.passportModule(passport, localStrategy);

// http parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// session ,flash ,passport
app.use(session({ secret: "%litttlecat&%^meowaa$aaa$%^*aaa&a" }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//static content
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")));

app.use("/account", loginRouter);

app.use(passportModule.passportModule.checkAuth);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;

  if (req.app.get(`env`) === "development") res.locals.error = err;
  else res.locals.error = {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
