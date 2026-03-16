// components/Header.jsx
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';

const BRAND = {
  primary: '#FF6B35',
  secondary: '#FFD23F',
  accent: '#06D6A0',
  border: '#FFD9C0',
  surface: '#FFF8F0',
  bg: '#FFFBF5',
  text: '#1A1A2E',
  muted: '#9B8EA8',
  card: '#FFFFFF',
};

const getDayAndDate = () => {
  const now = new Date();
  const day = now.toLocaleDateString('es-ES', { weekday: 'long' });
  const date = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  return {
    day: day.charAt(0).toUpperCase() + day.slice(1),
    date,
  };
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
};

export default function Header() {
  // ✅ useAuth dentro del componente — React detecta cambios y re-renderiza
  const auth = useAuth();
  const user = auth?.user;
  const isLoading = auth?.isLoading;

  const { day, date } = getDayAndDate();

  return (
    <View style={s.header}>
      {/* Left: logo */}
      <View style={s.logoWrap}>
        <Image source={require('../img/hero.png')} style={s.logo} resizeMode="contain" />
      </View>

      {/* Center: greeting + date */}
      <View style={s.center}>
        <Text style={s.greeting}>
          {getGreeting()}
          {user?.name ? `, ${user.name}` : ''}
        </Text>
        <View style={s.dateRow}>
          <Text style={s.dayText}>{day}</Text>
          <View style={s.dateDot} />
          <Text style={s.dateText}>{date}</Text>
        </View>
      </View>

      {/* Right: accent dot */}
      <View style={s.accentDot} />
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : Platform.OS === 'web' ? 16 : 40,
    paddingBottom: 14,
    backgroundColor: BRAND.card,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    gap: 12,
  },
  logoWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: BRAND.surface,
    borderWidth: 1,
    borderColor: BRAND.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logo: {
    width: 52,
    height: 52,
    tintColor: BRAND.primary,
  },
  center: {
    flex: 1,
    gap: 2,
  },
  greeting: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: -0.3,
  },
  dateDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: BRAND.primary,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND.accent,
    flexShrink: 0,
  },
});
