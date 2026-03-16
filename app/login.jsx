// app/login.jsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import colors from './constants/colors';

// ─── Design tokens ────────────────────────────────────────────────
// Swap these 4 values to re-theme the whole screen
const BRAND = {
  primary: '#FF6B35', // vivid orange
  secondary: '#FFD23F', // sunny yellow
  accent: '#06D6A0', // mint green
  surface: '#FFF8F0', // warm off-white
  bg: '#FFFBF5', // cream background
  border: '#FFD9C0', // soft peach border
  text: '#1A1A2E', // near-black
  muted: '#9B8EA8', // muted purple-gray
  card: '#FFFFFF',
  shadow: '#FF6B35',
};

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Entry animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Button press scale
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const pressIn = () => Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Oops', 'Rellena todos los campos');
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password);
      router.replace('/(tabs)/tasks');
    } catch (error) {
      Alert.alert('Error', 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* ── Logo block ── */}
      <Animated.View
        style={[styles.top, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
      >
        <View style={styles.logoRing}>
          <View style={styles.logoInner}>
            <Image source={require('../img/hero.png')} style={styles.logo} resizeMode="contain" />
          </View>
        </View>

        <Text style={styles.appName}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </Animated.View>

      {/* ── Form ── */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Email */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>// email</Text>
          <View style={[styles.inputRow, focusedField === 'email' && styles.inputRowFocused]}>
            <Text style={styles.inputIcon}>@</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={BRAND.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>// contraseña</Text>
          <View style={[styles.inputRow, focusedField === 'password' && styles.inputRowFocused]}>
            <Text style={styles.inputIcon}>⚿</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={BRAND.muted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot password */}
        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Submit */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            onPressIn={pressIn}
            onPressOut={pressOut}
            disabled={loading}
            activeOpacity={1}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Entrar</Text>
                <View style={styles.btnArrow}>
                  <Text style={styles.btnArrowText}>→</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Register */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
            <Text style={styles.registerLink}>Regístrate →</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  // ── Decorative shapes ──────────────────────────────────────────
  blobTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: BRAND.secondary,
    opacity: 0.25,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: BRAND.accent,
    opacity: 0.18,
  },

  // ── Logo block ────────────────────────────────────────────────
  top: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: BRAND.primary,
    padding: 3,
    marginBottom: 16,
    // Dashed-border effect via shadow
    shadowColor: BRAND.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  logoInner: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: BRAND.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 68,
    height: 68,
  },
  appName: {
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    letterSpacing: 0.2,
  },

  // ── Card / form ───────────────────────────────────────────────
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 28,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: BRAND.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  // ── Input ────────────────────────────────────────────────────
  inputWrapper: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.primary,
    letterSpacing: 0.5,
    textTransform: 'lowercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    paddingHorizontal: 14,
    paddingVertical: 2,
    gap: 8,
    transition: 'border-color 0.2s',
  },
  inputRowFocused: {
    borderColor: BRAND.primary,
    backgroundColor: '#FFF',
    shadowColor: BRAND.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputIcon: {
    fontSize: 16,
    color: BRAND.muted,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: BRAND.text,
  },
  eyeButton: {
    paddingLeft: 6,
  },
  eyeText: {
    fontSize: 17,
  },

  // ── Forgot ───────────────────────────────────────────────────
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    textDecorationLine: 'underline',
  },

  // ── Button ───────────────────────────────────────────────────
  loginButton: {
    backgroundColor: BRAND.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: BRAND.primary,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
    marginTop: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    letterSpacing: 0.3,
  },
  btnArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnArrowText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },

  // ── Divider ──────────────────────────────────────────────────
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BRAND.border,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },

  // ── Register row ─────────────────────────────────────────────
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },
  registerLink: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.primary,
  },
});
