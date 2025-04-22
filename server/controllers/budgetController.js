const { Budget, Category } = require('../models');
const { Op } = require('sequelize');

// Create a new budget
const createBudget = async (req, res) => {
  try {
    const { amount, period, startDate, endDate, categoryId } = req.body;
    const userId = req.user.id;

    // Check if category belongs to user
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or does not belong to user'
      });
    }

    const budget = await Budget.create({
      amount,
      period,
      startDate,
      endDate,
      categoryId,
      userId
    });

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating budget',
      error: error.message
    });
  }
};

// Get all budgets for a user
const getAllBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period, categoryId } = req.query;

    const where = { userId };
    
    if (period) {
      where.period = period;
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const budgets = await Budget.findAll({
      where,
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'type', 'color']
      },
      order: [['startDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching budgets',
      error: error.message
    });
  }
};

// Get single budget by ID
const getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await Budget.findOne({
      where: {
        id,
        userId
      },
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'type', 'color']
      }
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching budget',
      error: error.message
    });
  }
};

// Update budget
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { amount, period, startDate, endDate, categoryId } = req.body;

    const budget = await Budget.findOne({
      where: {
        id,
        userId
      }
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // If changing category, verify new category belongs to user
    if (categoryId && categoryId !== budget.categoryId) {
      const category = await Category.findOne({
        where: {
          id: categoryId,
          userId
        }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found or does not belong to user'
        });
      }
    }

    await budget.update({
      amount: amount || budget.amount,
      period: period || budget.period,
      startDate: startDate || budget.startDate,
      endDate: endDate !== undefined ? endDate : budget.endDate,
      categoryId: categoryId || budget.categoryId
    });

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating budget',
      error: error.message
    });
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await Budget.findOne({
      where: {
        id,
        userId
      }
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    await budget.destroy();

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting budget',
      error: error.message
    });
  }
};

module.exports = {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
};