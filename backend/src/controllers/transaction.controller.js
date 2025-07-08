import {sql} from '../config/db.js'; // Import the sql instance from db.js



export async function GetTransactionByUser(req, res) {
  try { 
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export async function DeleteTransaction(req, res) {
  try {
    const id = req.params.id;
    if(isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Valid transaction ID is required' });
    }
    if (!id) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }
    const result = await sql`DELETE FROM transactions WHERE id = ${id} returning *`;
    if (result.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export async function GetSummaryByUser(req, res) {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const balanceResult = await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${user_id}`;
    const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${user_id} AND amount > 0`;
    const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${user_id} AND amount < 0`;
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    });
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export async function CreateTransactionByUser(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;
    if(!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const transaction = await sql`INSERT INTO transactions (user_id, title, amount, category) 
                             VALUES (${user_id}, ${title}, ${amount}, ${category}) 
                             RETURNING *`;
    res.status(201).json(transaction [0]);
  }catch (error) {
    console.error('Error inserting transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};