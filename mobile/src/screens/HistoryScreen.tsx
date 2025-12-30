import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Transaction, TransactionType } from '../types';

export const HistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
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
        return '#10b981';
      case TransactionType.SELL:
        return '#ef4444';
      default:
        return '#64748b';
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No transactions yet. Start trading or fund your wallet!
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <View style={[styles.iconContainer, { backgroundColor: `${getTransactionColor(tx.type)}20` }]}>
                <Text style={styles.icon}>{getTransactionIcon(tx.type)}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {tx.type === TransactionType.DEPOSIT ? 'Wallet Funding' : `${tx.type} ${tx.currencyCode}`}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}
                </Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text
                  style={[
                    styles.amountText,
                    tx.type === TransactionType.SELL && styles.amountTextPositive,
                  ]}
                >
                  {formatTransaction(tx)}
                </Text>
                {tx.type !== TransactionType.DEPOSIT && (
                  <Text style={styles.rateText}>
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
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    padding: 16,
  },
  centerContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 14,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    margin: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#1e293b',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  amountTextPositive: {
    color: '#10b981',
  },
  rateText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
