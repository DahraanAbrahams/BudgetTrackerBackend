const Transaction = require('../models/Transaction');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const mongoose = require('mongoose');
const { checkPermissions } = require('../utils');


const createTransaction = async (req, res) => { 
    req.body.createdBy = req.user.userId;
    const transaction = await Transaction.create(req.body);
    res.status(StatusCodes.CREATED).json({ transaction });
}

const updateTransaction = async (req, res) => { 
    const {
        body: { description, amount, type },
        user: { userId },
        params: { id: transactionId },
      } = req;
    
      if (description === '' || amount === 0 || type === '') {
        throw new BadRequestError('Description, Amount, Type fields cannot be empty');
      }
      const transaction = await Transaction.findByIdAndUpdate(
        { _id: transactionId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!transaction) {
        throw new NotFoundError(`No transaction with ID:${transactionId}`);
      }
      res.status(StatusCodes.OK).json({ transaction });
}

const deleteTransaction = async (req, res) => { 
    const {
        user: { userId },
        params: { id: transactionId },
      } = req;
    
      const transaction = await Transaction.findByIdAndRemove({
        _id: transactionId,
        createdBy: userId,
      });
      if (!transaction) {
        throw new NotFoundError(`No transaction with ID found`);
      }
      res.status(StatusCodes.OK).json(`Transaction deleted`);
}

const getCurrentUserTransactions = async (req, res) => {
  
    const { search, transactionType, sort } = req.query;

    const queryObject = {
    createdBy: req.user.userId,
    };
  
    if (search) {
      queryObject.description = { $regex: search, $options: 'i' };
    }
    if (transactionType && transactionType !== 'all') {
      queryObject.type = transactionType;
    }
    let result = Transaction.find(queryObject);
  
    if (sort === 'latest') {
      result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
      result = result.sort('createdAt');
    }
    if (sort === 'a-z') {
      result = result.sort('position');
    }
    if (sort === 'z-a') {
      result = result.sort('-position');
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
  
    result = result.skip(skip).limit(limit);
    
    const transactions = await result;

    const totalTransactions = await Transaction.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalTransactions / limit);

    // checkPermissions(req.user, transactions.createdBy);

    res.status(StatusCodes.OK).json({ transactions, totalTransactions, numOfPages });
};

const getSingleTransaction = async (req, res) => {
    const {
        user: { userId },
        params: { id: transactionId },
      } = req;
    
      const transaction = await Transaction.findOne({
        _id: transactionId,
        createdBy: userId,
      });
      if (!transaction) {
        throw new NotFoundError(`No transaction with ID:${transactionId}`);
      }
      checkPermissions(req.user, transaction.createdBy);
      
      res.status(StatusCodes.OK).json({ transaction });
};

//Only Admin
const getAllTransactions = async (req, res) => {

    const { search, transactionType, sort } = req.query;

    const queryObject = {};
  
    if (search) {
      queryObject.description = { $regex: search, $options: 'i' };
    }
    if (transactionType && transactionType !== 'all') {
      queryObject.type = transactionType;
    }
    let result = Transaction.find(queryObject);
  
    if (sort === 'latest') {
      result = result.sort('-createdAt');
    }
    if (sort === 'oldest') {
      result = result.sort('createdAt');
    }
    if (sort === 'a-z') {
      result = result.sort('position');
    }
    if (sort === 'z-a') {
      result = result.sort('-position');
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    result = result.skip(skip).limit(limit);
    
    const transactions = await result;

    const totalTransactions = await Transaction.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalTransactions / limit);

    checkPermissions(req.user, transactions.createdBy);

    res.status(StatusCodes.OK).json({ transactions, totalTransactions, numOfPages });
};

module.exports = {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactions,
    getCurrentUserTransactions,
    getSingleTransaction,
};