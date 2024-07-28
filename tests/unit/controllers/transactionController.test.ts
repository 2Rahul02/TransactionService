import {describe, expect, beforeEach, it} from 'vitest';
import request from 'supertest';
import app from '../../../src/app'; 
import pool from '../../../src/config/__mocks__/database';
import { vi } from 'vitest';

vi.mock('../../../src/config/database');

describe('Transaction Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new transaction', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const resp = await request(app)
      .post('/transactionservice/transaction/1')
      .send({ amount: 100.0, type: 'food' })
      
       expect(resp.statusCode).toBe(201);
       expect(pool.query).toHaveBeenCalledTimes(2)
       expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
       expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 100.0, 'food', undefined]);

  });

  it('should get a transaction by id', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ trans_id: 1, amount: 100.0, type: 'food', parent_id: null }],
    });

    const response = await request(app)
      .get('/transactionservice/transaction/1')
      .expect(200);

    expect(response.body).toEqual({
      trans_id: 1,
      amount: 100.0,
      type: 'food',
      parent_id: null,
    });
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  it('should return 404 for non-existing transaction', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    await request(app)
      .get('/transactionservice/transaction/999999')
      .expect(404);

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [999999]);
  });

  it('should return all transactions of a type', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ trans_id: 1, amount: 300, type: "food", parent_id: null }] });

    const response = await request(app)
      .get('/transactionservice/types/food')
      .expect(200);

    expect(response.body).toEqual([{ trans_id: 1, amount: 300, type: "food", parent_id: null }]);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['food']);
  });

  it('should return the sum of transactions linked by parent_id', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ trans_id: 1}] });
    pool.query.mockResolvedValueOnce({ rows: [{amount: 50.0}] });
    pool.query.mockResolvedValueOnce({ rows: [{ trans_id: 3, amount: 50.0}, { trans_id: 4, amount: 50.0}] });
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .get('/transactionservice/sum/1')
      .expect(200);

    expect(response.body.sum).toBe(150.0);
    expect(pool.query).toHaveBeenCalledTimes(5);
  });

  it('should handle duplicate transaction id gracefully', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ trans_id: 1, amount: 300, type: "food", parent_id: null }] });

    const response = await request(app)
      .post('/transactionservice/transaction/1')
      .send({ amount: 100.0, type: 'food' })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Transaction ID already exists');
  });
});
