const { Account } = require("../models");

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.user.id },
    });

    return res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    console.error("Error in getAllAccounts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createAccount = async (req, res) => {
  try {
    const { name, type, balance, currency } = req.body;

    const account = await Account.create({
      name,
      type,
      balance,
      currency,
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { name, type, balance, currency } = req.body;

    let account = await Account.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    account = await account.update({
      name,
      type,
      balance,
      currency,
    });

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    await account.destroy();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAccounts,
  createAccount,
  getAccountById,
  updateAccount,
  deleteAccount,
};
