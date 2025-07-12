import React from 'react'
import { Text, TouchableOpacity, View, TextInput, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { styles} from '@/assets/styles/create.styles.js'
import { COLORS} from '@/constants/colors.js'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo'
import { API_URL } from '@/constants/api'
const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];


function CreateScreen() {
    const router = useRouter();
    const { user} = useUser();
    const [title, SetTitle] = React.useState("");
    const [amount, SetAmount] = React.useState("");
    const [category, SetCategory] = React.useState("");
    const [isExpense, SetIsExpense] = React.useState(true);
    const [isLoading, SetIsLoading] = React.useState(false);

    const handleCreateTransaction = async () => {
        if (!title.trim()) {
            return Alert.alert("Error", "Please enter a title for the transaction.");
        }
        if( !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return Alert.alert("Error", "Please enter a valid amount.");
        }
        if( !category) {
            return Alert.alert("Error", "Please select a category.");
        }
        SetIsLoading(true);
        try{
            // Here you would typically send the data to your backend
            const formatAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    title,
                    amount: formatAmount,
                    category
                }),
            });
            if(!response.ok) {
                const errorData = await response.json();
                console.error("Error creating transaction:", errorData);
                throw new Error(errorData.error || 'Failed to create transaction');
            }
            Alert.alert("Success", "Transaction created successfully!");
            router.back();
        } catch (error) {
            console.error("Error creating transaction:", error);
            alert("Failed to create transaction");
        } finally {
            SetIsLoading(false);
        }
    };

  return (
    <View style={styles.container}>
        <View style={styles.header}> 
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text}/>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Create Transaction</Text>
            <TouchableOpacity onPress={handleCreateTransaction} style={styles.saveButtonContainer}>
                <Text style={styles.saveButtonT}>{isLoading ? "Saving..." : "Save"}</Text>
                {!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
            </TouchableOpacity> 
        </View>


        <View style={styles.card}>
            <View style={styles.typeSelector}>
                <TouchableOpacity
                    style={[styles.typeButton, isExpense ? styles.typeButtonActive : null]}
                    onPress={() => SetIsExpense(true)}
                >
                    <Ionicons 
                        name='arrow-down-circle' 
                        size={22}
                        color={isExpense ? COLORS.white : COLORS.expense}
                        style={styles.typeIcon}/>
                    <Text style={[styles.typeButtonText, isExpense ? styles.typeButtonTextActive: null]}>
                        Expense
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typeButton, !isExpense ? styles.typeButtonActive : null]}
                    onPress={() => SetIsExpense(false)}
                >
                    <Ionicons 
                        name='arrow-up-circle' 
                        size={22}
                        color={!isExpense ? COLORS.white : COLORS.income}
                        style={styles.typeIcon}/>
                    <Text style={[styles.typeButtonText, !isExpense ? styles.typeButtonTextActive: null]}>
                        Income
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                    style={styles.amountInput}
                    value={amount}
                    placeholderTextColor={COLORS.textLight}
                    onChangeText={SetAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="create-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    value={title}
                    placeholderTextColor={COLORS.textLight}
                    onChangeText={SetTitle}
                    placeholder="Transaction Title"
                />
            </View>     

            <Text style={styles.sectionTitle}>
                <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category            
            </Text>
            <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryButton, category === cat.name ? styles.categoryButtonActive : null]}
                        onPress={() => SetCategory(cat.name)}
                    > 
                        <Ionicons name={cat.icon} size={24} color={category === cat.name ? COLORS.white : COLORS.text} />
                        <Text style={[styles.categoryButtonText, category === cat.name ? styles.categoryButtonTextActive : null]}>
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                ))}              

            </View>  
        </View>

        {isLoading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )}
    </View>
  )
}

export default CreateScreen
