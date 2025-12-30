import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const WalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFund = async () => {
    if (!user) return;
    const val = parseFloat(amount);
    if (val <= 0 || isNaN(val)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await apiService.fundAccount(user.id, val);
      await refreshUser();
      Alert.alert('Success', `Successfully added ${val.toFixed(2)} PLN`);
      setAmount('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fund account');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Wallet</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available PLN</Text>
        <Text style={styles.balanceAmount}>
          {user.wallet.PLN.toLocaleString('pl-PL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          <Text style={styles.currency}>PLN</Text>
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Currency Holdings</Text>
          <View style={styles.holdingsList}>
            {Object.entries(user.wallet).filter(([k, v]) => k !== 'PLN' && (v as number) > 0).length === 0 ? (
              <Text style={styles.emptyText}>You don't hold any foreign currencies yet.</Text>
            ) : (
              Object.entries(user.wallet).map(([code, amount]) => {
                if (code === 'PLN' || (amount as number) <= 0) return null;
                return (
                  <View key={code} style={styles.holdingItem}>
                    <Text style={styles.holdingCode}>{code}</Text>
                    <Text style={styles.holdingAmount}>{(amount as number).toFixed(4)}</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Up Account</Text>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (PLN)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
                <Text style={styles.inputSuffix}>PLN</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.fundButton}
              onPress={handleFund}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.fundButtonText}>Add Funds</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    marginTop: 0,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  currency: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#94a3b8',
  },
  grid: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  holdingsList: {
    gap: 12,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  holdingCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
  },
  holdingAmount: {
    fontSize: 16,
    color: '#64748b',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingRight: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  fundButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  fundButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
