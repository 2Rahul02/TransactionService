import { Router } from 'express';
import * as transactionController from '../controllers/transactionController';

const router = Router();

router.post('/transaction/:transaction_id', transactionController.createTransactionHandler);
router.get('/transaction/:transaction_id', transactionController.getTransactionHandler);
router.get('/types/:type', transactionController.getTransactionsByTypeHandler); 
router.get('/sum/:transaction_id', transactionController.getSumOfTransactionsHandler);

export default router;
