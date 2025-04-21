"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Account, { foreignKey: "userId", as: "accounts" });
    User.hasMany(models.Transaction, {
      foreignKey: "userId",
      as: "transactions",
    });
    User.hasMany(models.Budget, { foreignKey: "userId", as: "budgets" });
    User.hasMany(models.Category, { foreignKey: "userId", as: "categories" });
  };

  return User;
};
