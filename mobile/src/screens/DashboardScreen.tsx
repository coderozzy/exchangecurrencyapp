import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import { ExchangeRate } from '../types';
import { Ionicons } from '@expo/vector-icons';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadRates = async () => {
    try {
      const data = await apiService.getCurrentRates();
      setRates(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load rates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRates();
  };

  const totalPortfolioValuePLN = useMemo(() => {
    if (!user) return 0;
    let total = user.wallet.PLN || 0;
    Object.entries(user.wallet).forEach(([code, amount]) => {
      if (code !== 'PLN' && (amount as number) > 0) {
        const rate = rates.find(r => r.code === code);
        if (rate) {
          const valueInPln = (amount as number) * rate.buy;
          total += valueInPln;
        }
      }
    });
    return total;
  }, [user, rates]);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />}
    >
      <View style={[styles.headerCard, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTopRow}>
          <Text style={[styles.headerLabel, { color: '#e0f2fe' }]}>Total Portfolio Value</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
              <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styles.iconButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerAmount}>
          {totalPortfolioValuePLN.toLocaleString('pl-PL', {
            style: 'currency',
            currency: 'PLN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <TouchableOpacity
          style={styles.tradeButton}
          onPress={() => navigation.navigate('Exchange')}
        >
          <Text style={[styles.tradeButtonText, { color: colors.primary }]}>Trade Now</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.cashCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.cashLabel, { color: colors.textSecondary }]}>Available Cash</Text>
        <Text style={[styles.cashAmount, { color: colors.text }]}>
          {user?.wallet.PLN.toLocaleString('pl-PL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          <Text style={[styles.currency, { color: colors.textSecondary }]}>PLN</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
          <Text style={[styles.walletLink, { color: colors.primary }]}>Manage Wallet →</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.ratesCard, { backgroundColor: colors.card }]}>
        <View style={[styles.ratesHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.ratesTitle, { color: colors.text }]}>Live NBP Rates</Text>
        </View>

        {rates.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.error }]}>Failed to fetch rates from NBP.</Text>
          </View>
        ) : (
          <View>
            {rates.slice(0, 10).map((rate) => (
              <View key={rate.code} style={[styles.rateRow, { borderBottomColor: colors.border }]}>
                <View style={styles.rateInfo}>
                  <Text style={[styles.rateCode, { color: colors.text }]}>{rate.code}</Text>
                  <Text style={[styles.rateName, { color: colors.textSecondary }]}>{rate.currency}</Text>
                </View>
                <View style={styles.rateValues}>
                  <Text style={[styles.buyRate, { color: colors.success }]}>{rate.buy.toFixed(4)}</Text>
                  <Text style={[styles.sellRate, { color: colors.error }]}>{rate.sell.toFixed(4)}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.tradeButtonSmall, { backgroundColor: theme === 'dark' ? '#1e293b' : '#e0f2fe' }]}
                  onPress={() => navigation.navigate('Exchange', { code: rate.code })}
                >
                  <Text style={[styles.tradeButtonSmallText, { color: colors.primary }]}>Trade</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {lastUpdated && (
          <Text style={[styles.footerText, { color: colors.textSecondary, backgroundColor: colors.background }]}>
            Data provided by NBP API • Updated: {lastUpdated.toLocaleTimeString()}
          </Text>
        )}
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
  },
  headerCard: {
    borderRadius: 24,
    padding: 24,
    margin: 16,
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  headerAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tradeButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  tradeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cashCard: {
    borderRadius: 24,
    padding: 24,
    margin: 16,
    marginTop: 0,
  },
  cashLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  cashAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  currency: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  walletLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratesCard: {
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
    overflow: 'hidden',
  },
  ratesHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  ratesTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  rateInfo: {
    flex: 1,
  },
  rateCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rateName: {
    fontSize: 12,
    marginTop: 4,
  },
  rateValues: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 12,
  },
  buyRate: {
    fontSize: 14,
    fontWeight: '600',
    width: 70,
    textAlign: 'right',
  },
  sellRate: {
    fontSize: 14,
    fontWeight: '600',
    width: 70,
    textAlign: 'right',
  },
  tradeButtonSmall: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tradeButtonSmallText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerText: {
    padding: 12,
    textAlign: 'center',
    fontSize: 10,
  },
});
