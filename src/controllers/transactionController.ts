import { Request, Response } from 'express';
import { z } from 'zod';
import * as transactionService from '../services/transactionService';
import * as validation from '../utils/validation';

export const createTransactionHandler = async (req: Request, res: Response) => {
  try {
    const transactionId = +req.params.transaction_id;
    req.body.trans_id = transactionId
    validation.transactionSchema.parse(req.body);
    const existingTransaction = await transactionService.getTransactionById(transactionId);
    if (existingTransaction) {
      return res.status(400).json({ error: 'Transaction ID already exists' });
    }
    await transactionService.createTransaction(req.body);
    res.status(201).json({ status: "ok" });
  } catch (err) {
    handleError(err, res);
  }
};

export const getTransactionHandler = async (req: Request, res: Response) => {
  try {
    const transactionId = validation.transactionIdSchema.parse(+req.params.transaction_id);
    const transaction = await transactionService.getTransactionById(transactionId);
    if (!transaction) return res.status(404).send('Transaction not found');
    res.status(200).json(transaction);
  } catch (err) {
    handleError(err, res);
  }
};

export const getTransactionsByTypeHandler = async (req: Request, res: Response) => {
  try {
    const { type } = req.params; 
    const transactions = await transactionService.getTransactionsByType(type);
    res.status(200).json(transactions);
  } catch (err) {
    handleError(err, res);
  }
};

export const getSumOfTransactionsHandler = async (req: Request, res: Response) => {
  try {
    const transactionId = validation.transactionIdSchema.parse(+req.params.transaction_id);
    const transaction = await transactionService.getTransactionById(transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    const sum = await transactionService.getSumOfTransactions(transactionId);
    res.status(200).json({ sum });
  } catch (err) {
    handleError(err, res);
  }
};

const handleError = (err: unknown, res: Response) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({ errors: err.errors });
  } else {
    res.status(500).send('Internal Server Error');
  }
};
