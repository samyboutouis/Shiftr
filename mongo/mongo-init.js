db.createUser(
  {
      user: "colab",
      pwd: "example",
      roles: [
        { role: "dbOwner", db: "development" },
        { role: "readWrite", db: "development" }
      ]
  }
);