import React, { useEffect, useState, useMemo } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import { ExchangeRate, TransactionType, RateHistoryItem } from '../types';

const screenWidth = Dimensions.get('window').width;

export const ExchangeScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { user, refreshUser } = useAuth();
  const { colors, theme } = useTheme();
  const initialCode = route?.params?.code || 'USD';

  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<TransactionType.BUY | TransactionType.SELL>(TransactionType.BUY);
  const [history, setHistory] = useState<RateHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRates();
  }, []);

  useEffect(() => {
    if (selectedCode) {
      loadHistory();
    }
  }, [selectedCode]);

  const loadRates = async () => {
    try {
      const r = await apiService.getCurrentRates();
      setRates(r);
    } catch (error) {
      console.error('Failed to load rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const h = await apiService.getRateHistory(selectedCode);
      setHistory(h);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const selectedRate = useMemo(() => rates.find(r => r.code === selectedCode), [rates, selectedCode]);
  const effectiveRate = mode === TransactionType.BUY ? selectedRate?.sell : selectedRate?.buy;

  const totalCost = amount && effectiveRate
    ? (Math.round(parseFloat(amount) * effectiveRate * 100) / 100).toFixed(2)
    : '0.00';

  const handleTrade = async () => {
    if (!user || !effectiveRate || !amount) return;

    setProcessing(true);
    try {
      await apiService.exchangeCurrency(
        user.id,
        mode,
        selectedCode,
        parseFloat(amount),
        effectiveRate
      );
      await refreshUser();
      Alert.alert('Success', 'Transaction completed successfully');
      navigation.navigate('Wallet');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Transaction failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading market data...</Text>
      </View>
    );
  }

  const chartData = {
    labels: history.slice(-10).map((h) => new Date(h.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        data: history.slice(-10).map((h) => h.mid),
        color: (opacity = 1) => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Currency Exchange</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.selectorContainer}>
          <Picker
            selectedValue={selectedCode}
            onValueChange={setSelectedCode}
            style={[styles.picker, { color: colors.text, backgroundColor: colors.inputBackground }]}
            dropdownIconColor={colors.text}
          >
            {rates.map((r) => (
              <Picker.Item key={r.code} label={`${r.code} - ${r.currency}`} value={r.code} color={colors.text} />
            ))}
          </Picker>
        </View>

        {history.length > 0 && (
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 64}
              height={200}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 4,
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.textSecondary,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: colors.primary
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        <View style={[styles.modeContainer, { backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9' }]}>
          <TouchableOpacity
            style={[styles.modeButton, mode === TransactionType.BUY && { backgroundColor: colors.card }]}
            onPress={() => setMode(TransactionType.BUY)}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: colors.textSecondary },
                mode === TransactionType.BUY && { color: colors.primary },
              ]}
            >
              Buy {selectedCode}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === TransactionType.SELL && { backgroundColor: colors.card }]}
            onPress={() => setMode(TransactionType.SELL)}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: colors.textSecondary },
                mode === TransactionType.SELL && { color: colors.primary },
              ]}
            >
              Sell {selectedCode}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.rateContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>Rate</Text>
          <Text style={[styles.rateValue, { color: colors.text }]}>
            1 {selectedCode} = {effectiveRate?.toFixed(4)} PLN
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount ({selectedCode})</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBackground }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Total (PLN)</Text>
            <View style={[styles.totalContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Text style={[styles.totalText, { color: colors.text }]}>{totalCost}</Text>
            </View>
          </View>
        </View>

        {user && mode === TransactionType.BUY && user.wallet.PLN < parseFloat(totalCost) && (
          <Text style={[styles.errorText, { color: colors.error }]}>Insufficient PLN funds</Text>
        )}

        {user && mode === TransactionType.SELL && (user.wallet[selectedCode] || 0) < parseFloat(amount || '0') && (
          <Text style={[styles.errorText, { color: colors.error }]}>Insufficient {selectedCode} funds</Text>
        )}

        <TouchableOpacity
          style={[
            styles.tradeButton,
            mode === TransactionType.BUY ? { backgroundColor: colors.success } : { backgroundColor: colors.error },
            (processing || !amount || parseFloat(amount) <= 0) && styles.tradeButtonDisabled,
          ]}
          onPress={handleTrade}
          disabled={processing || !amount || parseFloat(amount) <= 0}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.tradeButtonText}>
              {mode === TransactionType.BUY ? `Buy ${selectedCode}` : `Sell ${selectedCode}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  card: {
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectorContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  chartContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  modeContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rateContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rateLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  totalContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  totalText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
  tradeButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  tradeButtonDisabled: {
    opacity: 0.5,
  },
  tradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
