const handleSignin = (req, res, db, bcrypt) => {
  //handleSignin = (db, bcrypt) => (req, res) => { if in server.js we had handlesignin(db, bcrypt)(req, res) i.e. we are running a function which in turn returns another function with arguments, res req
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
  //we can use send for sending json but .json() comes with additional features.
};

module.exports = {
  handleSignin: handleSignin,
};
