import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (phone, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1200));
      if (!phone || !password) throw new Error('Заполните все поля');
      const userData = {
        id: '1',
        name: 'Пользователь',
        phone,
        avatar: 'https://i.pravatar.cc/200?img=8',
        bookings: [],
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name, phone, password) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      if (!name || !phone || !password) throw new Error('Заполните все поля');
      if (password.length < 6) throw new Error('Пароль должен быть не менее 6 символов');
      const userData = {
        id: Date.now().toString(),
        name,
        phone,
        avatar: 'https://i.pravatar.cc/200?img=8',
        bookings: [],
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = async (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    await AsyncStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
