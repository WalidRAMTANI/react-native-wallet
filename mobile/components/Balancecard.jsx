import React from 'react'
import {View, Text} from 'react-native'
import { styles } from '@/assets/styles/home.styles'
import {COLORS} from '@/constants/colors.js'
function Balancecard({summary}) {
  return (
    <View style={styles.balanceCard}>
        <Text style={styles.balanceCardTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${parseFloat(summary.balance).toFixed(2)}</Text>

        <View style={styles.balanceStats}>
            <View tyle={styles.balanceStatItem}>
                <Text style={styles.balanceStatLabel}>Income</Text>
                <Text style={[styles.balanceStatAmount, { color: COLORS.income }]} >+${parseFloat(summary.income).toFixed(2)}</Text>
            </View>
            <View style={[styles.balanceStatItem, styles.statDivider]}>

            </View>

            <View style={styles.balanceStatItem}>
                <Text style={styles.balanceStatLabel}>Expenses</Text>
                <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]} >-${Math.abs(parseFloat(summary.expense)).toFixed(2)}</Text>

            </View>
        </View>
    </View>
  )
}

export default Balancecard
