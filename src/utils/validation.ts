import { z } from 'zod';

export const transactionSchema = z.object({
  trans_id: z.number().int().positive().optional(),
  amount: z.number().positive(),
  type: z.string().min(1),
  parent_id: z.number().int().positive().optional(),
}).refine((data) => data.parent_id !== data.trans_id, {
  message: 'Transaction cannot be its own parent.'
});;

export const transactionIdSchema = z.number().positive();
