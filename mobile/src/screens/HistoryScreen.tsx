import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import { Transaction, TransactionType } from '../types';

export const HistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const txs = await apiService.getTransactions(user!.id);
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return '💰';
      case TransactionType.BUY:
        return '⬇️';
      case TransactionType.SELL:
        return '⬆️';
      default:
        return '💱';
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return '#3b82f6';
      case TransactionType.BUY:
        return colors.success;
      case TransactionType.SELL:
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const formatTransaction = (tx: Transaction) => {
    if (tx.type === TransactionType.DEPOSIT) {
      return `+${tx.amountPLN.toFixed(2)} PLN`;
    } else if (tx.type === TransactionType.BUY) {
      return `+${tx.amountCurrency.toFixed(2)} ${tx.currencyCode}`;
    } else {
      return `-${tx.amountCurrency.toFixed(2)} ${tx.currencyCode}`;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Transaction History</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading history...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No transactions yet. Start trading or fund your wallet!
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {transactions.map((tx) => (
            <View key={tx.id} style={[styles.transactionItem, { backgroundColor: colors.card }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${getTransactionColor(tx.type)}20` }]}>
                <Text style={styles.icon}>{getTransactionIcon(tx.type)}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionType, { color: colors.text }]}>
                  {tx.type === TransactionType.DEPOSIT ? 'Wallet Funding' : `${tx.type} ${tx.currencyCode}`}
                </Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                  {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}
                </Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text
                  style={[
                    styles.amountText,
                    { color: colors.text },
                    tx.type === TransactionType.SELL && { color: colors.success },
                  ]}
                >
                  {formatTransaction(tx)}
                </Text>
                {tx.type !== TransactionType.DEPOSIT && (
                  <Text style={[styles.rateText, { color: colors.textSecondary }]}>
                    {tx.amountPLN.toFixed(2)} PLN @ {tx.rate.toFixed(4)}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  centerContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 40,
    margin: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rateText: {
    fontSize: 12,
  },
});
