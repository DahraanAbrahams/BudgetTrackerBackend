const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
  } = require('../middleware/authentication');

const {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrentUserTransactions,
    getSingleTransaction,
    getAllTransactions
} = require('../controllers/transactionController');
const testUser = require('../middleware/testUser');


router.route('/')
    .post(authenticateUser, testUser, createTransaction)
    // .get(authenticateUser, authorizePermissions('admin'), getAllTransactions);
    .get(authenticateUser, authorizePermissions('admin'), getAllTransactions);

router.route('/showAllMyTransactions')
    // .get(authenticateUser, getAllCurrentUserTransactions);
    .get(authenticateUser, getCurrentUserTransactions);

router.route('/:id')
    .get(authenticateUser, getSingleTransaction)
    .patch(authenticateUser, testUser, updateTransaction)
    .delete(authenticateUser, testUser, deleteTransaction);

module.exports = router;
