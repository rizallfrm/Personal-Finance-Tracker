// server/controllers/transactionController.js
const { Transaction, Account, Category } = require('../models');
const { sequelize } = require('../models');

exports.getAllTransactions = async (req, res) => {
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

exports.createTransaction = async (req, res) => {
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

// Additional controller methods for CRUD operations on transactions