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
import { apiService } from '../services/api';
import { ExchangeRate } from '../types';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.headerCard}>
        <Text style={styles.headerLabel}>Total Portfolio Value</Text>
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
          <Text style={styles.tradeButtonText}>Trade Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cashCard}>
        <Text style={styles.cashLabel}>Available Cash</Text>
        <Text style={styles.cashAmount}>
          {user?.wallet.PLN.toLocaleString('pl-PL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          <Text style={styles.currency}>PLN</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
          <Text style={styles.walletLink}>Manage Wallet →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratesCard}>
        <View style={styles.ratesHeader}>
          <Text style={styles.ratesTitle}>Live NBP Rates</Text>
        </View>

        {rates.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Failed to fetch rates from NBP.</Text>
          </View>
        ) : (
          <View>
            {rates.slice(0, 10).map((rate) => (
              <View key={rate.code} style={styles.rateRow}>
                <View style={styles.rateInfo}>
                  <Text style={styles.rateCode}>{rate.code}</Text>
                  <Text style={styles.rateName}>{rate.currency}</Text>
                </View>
                <View style={styles.rateValues}>
                  <Text style={styles.buyRate}>{rate.buy.toFixed(4)}</Text>
                  <Text style={styles.sellRate}>{rate.sell.toFixed(4)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.tradeButtonSmall}
                  onPress={() => navigation.navigate('Exchange', { code: rate.code })}
                >
                  <Text style={styles.tradeButtonSmallText}>Trade</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {lastUpdated && (
          <Text style={styles.footerText}>
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
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#0284c7',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    marginBottom: 16,
  },
  headerLabel: {
    color: '#e0f2fe',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
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
    color: '#0284c7',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cashCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    marginTop: 0,
  },
  cashLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  cashAmount: {
    color: '#1e293b',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  currency: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#94a3b8',
  },
  walletLink: {
    color: '#0284c7',
    fontSize: 14,
    fontWeight: '600',
  },
  ratesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
    overflow: 'hidden',
  },
  ratesHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  ratesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#ef4444',
    fontSize: 14,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rateInfo: {
    flex: 1,
  },
  rateCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  rateName: {
    fontSize: 12,
    color: '#64748b',
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
    color: '#10b981',
    width: 70,
    textAlign: 'right',
  },
  sellRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    width: 70,
    textAlign: 'right',
  },
  tradeButtonSmall: {
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tradeButtonSmallText: {
    color: '#0284c7',
    fontSize: 12,
    fontWeight: '600',
  },
  footerText: {
    padding: 12,
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
    backgroundColor: '#f8fafc',
  },
});
