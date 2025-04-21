"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("Account", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("checking", "savings", "credit", "investment"),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "IDR",
    },
  });

  Account.associate = (models) => {
    Account.belongsTo(models.User, { foreignKey: "userId" });
    Account.hasMany(models.Transaction, {
      foreignKey: "accountId",
      as: "transactions",
    });
  };

  return Account;
};
