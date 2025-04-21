"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define("Budget", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    period: {
      type: DataTypes.ENUM("daily", "weekly", "monthly", "yearly"),
      allowNull: false,
      defaultValue: "monthly",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Budget.associate = (models) => {
    Budget.belongsTo(models.User, { foreignKey: "userId" });
    Budget.belongsTo(models.Category, { foreignKey: "categoryId" });
  };

  return Budget;
};
