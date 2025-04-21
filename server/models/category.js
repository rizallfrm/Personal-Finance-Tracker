'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Category.associate = (models) => {
    Category.belongsTo(models.User, { foreignKey: 'userId' });
    Category.hasMany(models.Transaction, { foreignKey: 'categoryId', as: 'transactions' });
    Category.hasMany(models.Budget, { foreignKey: 'categoryId', as: 'budgets' });
  };

  return Category;
};