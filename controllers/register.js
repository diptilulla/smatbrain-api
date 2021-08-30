const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission.");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    //so that we first update the login then users more than 1 thing at once
    trx
      .insert({
        //trx object is used
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*") //like a select statement in-built in knex
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]); //we get an array with that user on returning
          });
      })
      .then(trx.commit) //for transaction to get added we need to commit it
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};
