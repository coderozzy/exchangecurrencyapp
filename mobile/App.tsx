import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ExchangeScreen } from './src/screens/ExchangeScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Exchange"
        component={ExchangeScreen}
        options={{
          tabBarLabel: 'Trade',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

