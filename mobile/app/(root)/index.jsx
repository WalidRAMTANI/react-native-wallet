import { useUser } from '@clerk/clerk-expo'
import { TransactionItem } from '@/components/TransactionItem';
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/UseTransactions';
import { useEffect, useState } from 'react';
import PageLoader from '@/components/PageLoader';
import { styles } from '@/assets/styles/home.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Balancecard from '../../components/Balancecard';
import NoTransactionsFound from '@/components/ListEmptyComponent';
export default function Page() {
  const [Refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { transactions, isLoading, summary, loadData, DeleteTransaction } = useTransactions(user?.id);
  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [loadData]);

const onRefresh = async() => {
  setRefreshing(true);
  await loadData();
  setRefreshing(false);
}

const handleDelete = (id) => {
  Alert.alert(
    "Delete Transaction",
    "Are you sure you want to delete this transaction?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {text: "Delete",
        style: "destructive",
        onPress: () => DeleteTransaction(id)
      }
    ]
  );
}

  if (isLoading && !Refreshing) {
    return <PageLoader />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require("@/assets/images/logo.png")}
              style={styles.headerLogo} 
              resizeMode='contain'/>

              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={styles.usernameText}>
                  {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
                </Text>
              </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          
          </View>
        </View>
        <Balancecard summary={summary} />
        <View style={styles.transactionHeadersContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList 
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item})=> {
          return (
            <TransactionItem 
              item={item} 
              onDelete={handleDelete} 
            />
          )

        }}
        ListEmptyComponent={<NoTransactionsFound  />}
        refreshControl={<RefreshControl refreshing={Refreshing} onRefresh={onRefresh}/>}
        />
    </View>
  )
}