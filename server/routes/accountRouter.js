const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const auth = require('../middleware/auth');

router.get('/', auth, accountController.getAllAccounts);
router.post('/', auth, accountController.createAccount);
router.get('/:id', auth, accountController.getAccountById);
router.put('/:id', auth, accountController.updateAccount);
router.delete('/:id', auth, accountController.deleteAccount);

module.exports = router;