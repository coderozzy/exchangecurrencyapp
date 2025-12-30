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
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';

export const WalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, refreshUser } = useAuth();
  const { colors } = useTheme();
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Wallet</Text>

      <View style={[styles.balanceCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available PLN</Text>
        <Text style={[styles.balanceAmount, { color: colors.text }]}>
          {user.wallet.PLN.toLocaleString('pl-PL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          <Text style={[styles.currency, { color: colors.textSecondary }]}>PLN</Text>
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Currency Holdings</Text>
          <View style={styles.holdingsList}>
            {Object.entries(user.wallet).filter(([k, v]) => k !== 'PLN' && (v as number) > 0).length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>You don't hold any foreign currencies yet.</Text>
            ) : (
              Object.entries(user.wallet).map(([code, amount]) => {
                if (code === 'PLN' || (amount as number) <= 0) return null;
                return (
                  <View key={code} style={[styles.holdingItem, { backgroundColor: colors.background }]}>
                    <Text style={[styles.holdingCode, { color: colors.text }]}>{code}</Text>
                    <Text style={[styles.holdingAmount, { color: colors.textSecondary }]}>{(amount as number).toFixed(4)}</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Top Up Account</Text>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount (PLN)</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.inputBackground }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
                <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>PLN</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.fundButton, { backgroundColor: colors.success }]}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  grid: {
    padding: 16,
    gap: 16,
  },
  card: {
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
    marginBottom: 16,
  },
  holdingsList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
  },
  holdingCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  holdingAmount: {
    fontSize: 16,
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
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
  },
  fundButton: {
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
