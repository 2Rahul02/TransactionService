import fs from 'fs'
import path from 'path'
import pool from "../config/database"
import { Transaction } from "../models/transaction"

const queries = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config/queries.json'), 'utf8'));

export const createTransaction = async (transaction: Transaction): Promise<void> => {
    const {trans_id, amount, type, parent_id } = transaction;
    await pool.query<Transaction>(queries.createTransaction, [trans_id, amount, type, parent_id]);
}

export const getTransactionById = async (id: number): Promise<Transaction | null> => {
    const result = await pool.query<Transaction>(queries.getTransactionById, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
};

export const getTransactionsByType = async (type: string): Promise<Transaction[]> => {
    const result = await pool.query<Transaction>(queries.getTransactionsByType, [type]);
    return result.rows;
};

export const getSumOfTransactions = async (trans_id: number): Promise<number> => {
    let sum = 0;
    const result = await pool.query<Transaction>(queries.getAmountByTransId, [trans_id]);
    const amount = +result.rows[0].amount;
    const stack: [number, number][] = [[trans_id, amount]];

    while (stack.length > 0) {
        const currentData = stack.pop();
        if (currentData){
            const [currentTransId, currentAmount] = currentData;
            sum += currentAmount;
            const childResult = await pool.query<Transaction>(queries.getTransIdNAmtWhereIdIsParent, [currentTransId]);
            const childTransactions: [number, number][] = childResult.rows.map(row => [row.trans_id, +row.amount])
            stack.push(...childTransactions);
        }
    }

    return sum;
};
