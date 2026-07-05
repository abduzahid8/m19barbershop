import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, Platform, ScrollView, KeyboardAvoidingView,
  ActivityIndicator, Alert, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';
import { useAuth } from '../context/AuthContext';
import IridescentHero from '../components/IridescentHero';

const Input = ({ icon, placeholder, value, onChangeText, secure, keyboardType, onFocus, onBlur, focused }) => {
  const ba = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(ba, { toValue: focused ? 1 : 0, duration: 200, useNativeDriver: false }).start(); }, [focused]);
  const bc = ba.interpolate({ inputRange: [0, 1], outputRange: [colors.borderLight, '#102852'] });
  const bg = ba.interpolate({ inputRange: [0, 1], outputRange: [colors.bgCard, colors.background] });
  return (
    <Animated.View style={[styles.inputWrap, { borderColor: bc, backgroundColor: bg }]}>
      <Feather name={icon} size={s(15)} color={focused ? '#102852' : colors.iconMuted} style={{ marginRight: s(10) }} />
      <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor={colors.textMuted} value={value} onChangeText={onChangeText} secureTextEntry={secure} keyboardType={keyboardType} onFocus={onFocus} onBlur={onBlur} autoCapitalize="none" />
    </Animated.View>
  );
};

function FadeIn({ children, delay = 0 }) {
  const o = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(15)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 450, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={{ opacity: o, transform: [{ translateY: y }] }}>{children}</Animated.View>;
}

export default function AuthScreen() {
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['','','','']);
  const [genCode, setGenCode] = useState('1234');
  const refs = useRef([]);
  const tabPos = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.spring(tabPos, { toValue: isLogin ? 0 : 1, damping: 18, stiffness: 200, useNativeDriver: false }).start(); }, [isLogin]);
  const indLeft = tabPos.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] });

  const handleAuth = async () => {
    if (!showOtp) {
      if (isLogin) { if (!phone || !password) return Alert.alert('','Заполните поля'); }
      else { if (!name || !phone || !password) return Alert.alert('','Заполните поля'); if (password.length < 6) return Alert.alert('','Пароль мин 6 символов'); }
      const c = Math.floor(1000 + Math.random() * 9000).toString();
      setGenCode(c); setShowOtp(true);
      Alert.alert('Демо', `Код: ${c}\nИли 1234`); return;
    }
    const code = otp.join('');
    if (code.length < 4) return Alert.alert('','Введите код');
    if (code !== genCode && code !== '1234') return Alert.alert('','Неверный код');
    const res = isLogin ? await signIn(phone, password) : await signUp(name, phone, password);
    if (!res.success) { Alert.alert('', res.error); setShowOtp(false); setOtp(['','','','']); }
  };

  if (showOtp) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#102852','#1a3d7a']} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.otpBack} onPress={() => setShowOtp(false)} activeOpacity={0.7}>
            <Feather name="chevron-left" size={s(20)} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.otpContent}>
            <FadeIn>
              <View style={styles.otpRing}><Feather name="smartphone" size={s(26)} color="#FFF" /></View>
              <Text style={styles.otpTitle}>Код из СМС</Text>
              <Text style={styles.otpSub}>Отправлен на {phone}</Text>
            </FadeIn>
            <FadeIn delay={150}>
              <View style={styles.otpRow}>
                {otp.map((d,i) => (
                  <TextInput key={i} ref={r => refs.current[i]=r} style={[styles.otpBox, d && styles.otpBoxFilled]} maxLength={1} keyboardType="number-pad" value={d} onChangeText={t => { const n=[...otp]; n[i]=t; setOtp(n); if(t&&i<3) refs.current[i+1]?.focus(); }} onKeyPress={e => { if(e.nativeEvent.key==='Backspace'&&!otp[i]&&i>0) refs.current[i-1]?.focus(); }} />
                ))}
              </View>
            </FadeIn>
            <FadeIn delay={250}>
              <TouchableOpacity onPress={() => { setGenCode(Math.floor(1000+Math.random()*9000).toString()); setOtp(['','','','']); Alert.alert('Демо', `Новый код: ${genCode}`); }} activeOpacity={0.7}>
                <Text style={styles.resend}>Отправить повторно</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleAuth} disabled={loading} activeOpacity={0.88}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Подтвердить</Text>}
              </TouchableOpacity>
            </FadeIn>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* FULL-SCREEN IRIDESCENT BACKGROUND */}
        <IridescentHero
          uri="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80"
          height={s(340)}
          colors={['rgba(10,26,62,0.9)','rgba(26,61,122,0.6)','rgba(147,51,234,0.25)']}
        >
          <View style={styles.brandCenter}>
            <View style={styles.logoCircle}>
              <Feather name="scissors" size={s(26)} color="#FFF" />
            </View>
            <Text style={styles.brandTitle}>M19</Text>
            <Text style={styles.brandSub}>ПРЕМИУМ БАРБЕРШОП</Text>
          </View>
        </IridescentHero>

        {/* FORM */}
        <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            {/* Tabs */}
            <View style={styles.tabsRow}>
              <Animated.View style={[styles.tabInd, { left: indLeft }]} />
              <TouchableOpacity style={styles.tab} onPress={() => setIsLogin(true)} activeOpacity={0.8}>
                <Text style={[styles.tabLabel, isLogin && styles.tabLabelActive]}>Вход</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={() => setIsLogin(false)} activeOpacity={0.8}>
                <Text style={[styles.tabLabel, !isLogin && styles.tabLabelActive]}>Регистрация</Text>
              </TouchableOpacity>
            </View>
            {/* Fields */}
            <View style={styles.fields}>
              {!isLogin && <Input icon="user" placeholder="Имя" value={name} onChangeText={setName} focused={focused === 'name'} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />}
              <Input icon="phone" placeholder="+998 __ ___ __ __" value={phone} onChangeText={setPhone} keyboardType="phone-pad" focused={focused === 'phone'} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
              <Input icon="lock" placeholder="Пароль" value={password} onChangeText={setPassword} secure focused={focused === 'password'} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
              <TouchableOpacity style={styles.submitBtn} onPress={handleAuth} disabled={loading} activeOpacity={0.88}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>{isLogin ? 'Войти' : 'Далее'}</Text>}
              </TouchableOpacity>
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}</Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)} activeOpacity={0.7}>
                <Text style={styles.bottomLink}>{isLogin ? 'Создать' : 'Войти'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  brandCenter: { alignItems: 'center' },
  logoCircle: { width: s(56), height: s(56), borderRadius: s(28), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: s(14), borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  brandTitle: { fontFamily: typography.fonts.heading, fontSize: s(40), color: '#FFF', letterSpacing: 5 },
  brandSub: { fontFamily: typography.fonts.body, fontSize: s(11), color: 'rgba(255,255,255,0.5)', letterSpacing: 4, marginTop: s(4) },

  formScroll: { flexGrow: 1, paddingHorizontal: s(20), paddingTop: s(-20), paddingBottom: s(30) },
  formCard: { backgroundColor: colors.bgCard, borderRadius: s(28), padding: s(20), marginTop: s(-20) },

  tabsRow: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: s(14), padding: s(3), marginBottom: s(18), position: 'relative', height: s(44) },
  tabInd: { position: 'absolute', top: s(3), bottom: s(3), width: '50%', borderRadius: s(11), backgroundColor: colors.bgCard },
  tab: { flex: 1, zIndex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: s(13), fontFamily: typography.fonts.bodyMedium, color: colors.iconMuted },
  tabLabelActive: { color: colors.text, fontFamily: typography.fonts.heading },

  fields: { gap: s(10) },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: s(14), paddingHorizontal: s(14), borderWidth: 1, height: s(48) },
  input: { flex: 1, color: colors.text, fontFamily: typography.fonts.body, fontSize: s(13), height: '100%' },

  submitBtn: { backgroundColor: '#102852', borderRadius: 100, height: s(48), alignItems: 'center', justifyContent: 'center', marginTop: s(4) },
  submitText: { fontSize: s(13), fontFamily: typography.fonts.heading, color: '#FFF', textTransform: 'uppercase', letterSpacing: 1.5 },

  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: s(18), gap: s(5) },
  bottomText: { color: colors.textMuted, fontSize: s(12), fontFamily: typography.fonts.body },
  bottomLink: { color: '#102852', fontSize: s(12), fontFamily: typography.fonts.heading },

  otpBack: { position: 'absolute', top: Platform.OS === 'ios' ? s(60) : s(44), left: s(20), zIndex: 10, width: s(36), height: s(36), borderRadius: s(18), backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  otpContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: s(28) },
  otpRing: { width: s(56), height: s(56), borderRadius: s(28), backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: s(20) },
  otpTitle: { fontSize: s(20), fontFamily: typography.fonts.heading, color: '#FFF', marginBottom: s(4), textAlign: 'center' },
  otpSub: { fontSize: s(12), fontFamily: typography.fonts.body, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: s(24) },
  otpRow: { flexDirection: 'row', gap: s(10), marginBottom: s(18) },
  otpBox: { width: s(48), height: s(56), borderRadius: s(12), borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.07)', textAlign: 'center', fontSize: s(20), fontFamily: typography.fonts.heading, color: '#FFF' },
  otpBoxFilled: { borderColor: '#FFF', backgroundColor: 'rgba(255,255,255,0.14)' },
  resend: { color: 'rgba(255,255,255,0.45)', fontSize: s(12), fontFamily: typography.fonts.bodyMedium, marginBottom: s(16), textAlign: 'center' },
});
