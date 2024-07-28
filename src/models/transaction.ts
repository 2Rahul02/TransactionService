export interface Transaction {
    trans_id: number;
    amount: number;
    type: string;
    parent_id?: number;
  }
