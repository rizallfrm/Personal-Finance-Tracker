// server/controllers/transactionController.js
const { Transaction, Account, Category } = require('../models');
const { sequelize } = require('../models');

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Account, attributes: ['id', 'name'] },
        { model: Category, attributes: ['id', 'name', 'type', 'color'] }
      ],
      order: [['date', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const createTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { amount, type, description, date, accountId, categoryId } = req.body;
    
    // Verify account belongs to user
    const account = await Account.findOne({
      where: { 
        id: accountId,
        userId: req.user.id
      }
    });
    
    if (!account) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    // Create transaction
    const transaction = await Transaction.create({
      amount,
      type,
      description,
      date: date || new Date(),
      userId: req.user.id,
      accountId,
      categoryId
    }, { transaction: t });
    
    // Update account balance
    const newBalance = type === 'income' 
      ? parseFloat(account.balance) + parseFloat(amount)
      : parseFloat(account.balance) - parseFloat(amount);
      
    await account.update({ balance: newBalance }, { transaction: t });
    
    await t.commit();
    
    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getTransactionById = async(req,res)=>{
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
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

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error.message
    });
  }
}

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { amount, description, date, categoryId } = req.body;

    const transaction = await Transaction.findOne({
      where: {
        id,
        userId
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // If changing category, verify new category belongs to user
    if (categoryId && categoryId !== transaction.categoryId) {
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

    await transaction.update({
      amount: amount || transaction.amount,
      description: description || transaction.description,
      date: date || transaction.date,
      categoryId: categoryId || transaction.categoryId
    });

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating transaction',
      error: error.message
    });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      where: {
        id,
        userId
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await transaction.destroy();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
      error: error.message
    });
  }
};
module.exports = {
  getAllTransactions,
  createTransaction,
  getTransactionById,
  deleteTransaction,
  updateTransaction,
};