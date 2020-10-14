var passportModule = function (passport, localStrategy) {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (user, password, done) => {
        if (user !== (process.env.TODO_USR || 'test@a.com')) return done(null, false, { message: "User not found" });
        else if (password !== (process.env.TODO_PASS || '1234')) return done(null, false, { message: "Wrong password" });

        return done(null, { id: 1, name: "Test", age: 21 });
      }
    )
  );
};

passportModule.checkAuth = (req, res, next) => {
  if (req.user) next();
  else res.redirect("/account/login");
};

module.exports.passportModule = passportModule;
