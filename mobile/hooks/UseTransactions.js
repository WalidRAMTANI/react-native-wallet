// react custom hook to fetch transactions

import { useCallback } from "react";
import { Alert } from "react-native";
import { useState } from "react";
import { API_URL } from "@/constants/api.js"; // Adjust the import path as necessary
//const API_URL = 'https://wallet-api-4rl1.onrender.com/api'; // Replace with your API URL
export const useTransactions = (userId) => {
     const [transactions, setTransactions] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
     });
     console.log('useTransactions hook initialized with userId:', userId);
     console.log('Transactions state:', transactions);
     console.log('Summary state:', summary);
    // useCallback to fetch transactions is used to prevent unnecessary re-fetching
     const fetchTransactions = useCallback(async () => {
        try{
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data);
        }
        catch (error) {
            console.error('Error fetching transactions:', error);
        }
     }, [userId]);


     const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
     }, []);

     // to run the the previous function at the same time 
     const loadData = useCallback(async () => {
        setIsLoading(true);
        await Promise.all([fetchTransactions(), fetchSummary()]);
        setIsLoading(false);
     }, [fetchTransactions, fetchSummary, userId]);

     const DeleteTransaction = useCallback(async (transactionId) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }
            // Update the transactions state after deletion
            loadData(); // Re-fetch transactions after deletion
            }
        catch (error) {
            console.error('Error deleting transaction:', error);
            Alert.alert('Error', error.message || 'Failed to delete transaction');
        }
     }, []);

     return {
        transactions,
        summary,
        isLoading,
        loadData,
        DeleteTransaction,
     };



}