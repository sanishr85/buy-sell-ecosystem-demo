import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const mockTransactions = [
  {
    id: 'TXN-001',
    orderId: 'ORD-12345',
    type: 'buyer',
    title: 'Plumber for kitchen sink',
    otherParty: 'Mike Wilson',
    amount: 150,
    total: 157.50,
    status: 'completed',
    date: '2024-01-15',
    rating: 5,
  },
  {
    id: 'TXN-002',
    orderId: 'ORD-12346',
    type: 'seller',
    title: 'Logo design for startup',
    otherParty: 'Sarah Chen',
    amount: 300,
    total: 285.00,
    status: 'completed',
    date: '2024-01-14',
    rating: 4,
  },
  {
    id: 'TXN-003',
    orderId: 'ORD-12347',
    type: 'buyer',
    title: 'Dog walking service',
    otherParty: 'James Brown',
    amount: 30,
    total: 31.50,
    status: 'in_progress',
    date: '2024-01-16',
    rating: null,
  },
];

export default function TransactionHistoryScreen({ navigation }) {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = mockTransactions.filter(txn => {
    if (filter === 'all') return true;
    if (filter === 'buyer') return txn.type === 'buyer';
    if (filter === 'seller') return txn.type === 'seller';
    return txn.status === filter;
  });

  const totalEarned = mockTransactions
    .filter(t => t.type === 'seller' && t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);

  const totalSpent = mockTransactions
    .filter(t => t.type === 'buyer' && t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <Text style={styles.headerSubtitle}>{mockTransactions.length} transactions</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Earned</Text>
            <Text style={styles.summaryValue}>${totalEarned.toFixed(2)}</Text>
            <Text style={styles.summarySubtext}>As Seller</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
            <Text style={styles.summarySubtext}>As Buyer</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'buyer' && styles.filterTabActive]}
            onPress={() => setFilter('buyer')}
          >
            <Text style={[styles.filterTabText, filter === 'buyer' && styles.filterTabTextActive]}>
              🛒 Purchases
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'seller' && styles.filterTabActive]}
            onPress={() => setFilter('seller')}
          >
            <Text style={[styles.filterTabText, filter === 'seller' && styles.filterTabTextActive]}>
              💰 Sales
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.transactionsContainer}>
          {filteredTransactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={[
                  styles.typeIcon,
                  transaction.type === 'buyer' ? styles.buyerIcon : styles.sellerIcon
                ]}>
                  <Text style={styles.typeIconText}>
                    {transaction.type === 'buyer' ? '🛒' : '💰'}
                  </Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionParty}>
                    {transaction.type === 'buyer' ? 'Seller: ' : 'Buyer: '}
                    {transaction.otherParty}
                  </Text>
                </View>
                <Text style={[
                  styles.amountText,
                  transaction.type === 'seller' ? styles.amountPositive : styles.amountNegative
                ]}>
                  {transaction.type === 'seller' ? '+' : '-'}${transaction.total.toFixed(2)}
                </Text>
              </View>
              <View style={styles.transactionFooter}>
                <Text style={styles.dateText}>{transaction.date}</Text>
                <Text style={styles.statusText}>{transaction.status}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { marginRight: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 24, color: colors.text },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary },
  content: { flex: 1 },
  summaryContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  summaryCard: { flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  summaryValue: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  summarySubtext: { fontSize: 12, color: colors.textSecondary },
  filterContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.backgroundSecondary, marginRight: 8 },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTabTextActive: { color: colors.white },
  transactionsContainer: { paddingHorizontal: 20 },
  transactionCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, marginBottom: 12 },
  transactionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  typeIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  buyerIcon: { backgroundColor: '#e0e7ff' },
  sellerIcon: { backgroundColor: '#d1fae5' },
  typeIconText: { fontSize: 20 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  transactionParty: { fontSize: 13, color: colors.textSecondary },
  amountText: { fontSize: 18, fontWeight: '700' },
  amountPositive: { color: '#10b981' },
  amountNegative: { color: colors.text },
  transactionFooter: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  dateText: { fontSize: 13, color: colors.textSecondary },
  statusText: { fontSize: 13, fontWeight: '600', color: colors.primary },
});
