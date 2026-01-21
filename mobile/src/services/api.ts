import { User, ExchangeRate, Transaction, RateHistoryItem, TransactionType } from '../types';
import { API_CONFIG } from '../config';

const API_BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  }

  async register(username: string, email: string, password: string): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(email: string, password: string): Promise<User> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  async getCurrentRates(): Promise<ExchangeRate[]> {
    return this.request<ExchangeRate[]>('/rates/current');
  }

  async getRateHistory(code: string, days: number = 30): Promise<RateHistoryItem[]> {
    return this.request<RateHistoryItem[]>(`/rates/history/${code}?days=${days}`);
  }

  async fundAccount(userId: string, amount: number): Promise<User> {
    return this.request<User>(`/wallet/${userId}/fund`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async exchangeCurrency(
    userId: string,
    type: TransactionType,
    currencyCode: string,
    amountCurrency: number,
    rate: number
  ): Promise<User> {
    return this.request<User>(`/wallet/${userId}/exchange`, {
      method: 'POST',
      body: JSON.stringify({
        type,
        currencyCode,
        amountCurrency,
        rate,
      }),
    });
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions/user/${userId}`);
  }
}

export const apiService = new ApiService();
