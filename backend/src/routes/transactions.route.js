import express from 'express';

import {DeleteTransaction, GetTransactionByUser, CreateTransactionByUser, GetSummaryByUser } from '../controllers/transaction.controller.js';


const transactionRoute = express.Router();


transactionRoute.post('/', CreateTransactionByUser);

// Get all transactions
transactionRoute.get('/:user_id', GetTransactionByUser);

// Delete a transaction
transactionRoute.delete('/:id', DeleteTransaction);

transactionRoute.get('/summary/:user_id', GetSummaryByUser);

export default transactionRoute;