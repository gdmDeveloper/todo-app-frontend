// components/Header.jsx
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import colors from '../app/constants/colors';

const getDayAndDate = () => {
  const now = new Date();
  const day = now.toLocaleDateString('es-ES', { weekday: 'long' });
  const date = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  return {
    day: day.charAt(0).toUpperCase() + day.slice(1),
    date,
  };
};

export default function Header() {
  const { day, date } = getDayAndDate();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.logoCircle}>
          <Image source={require('../img/hero.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.center}>
        <Text style={styles.dayText}>{day}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={34} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 16 : 52,
    backgroundColor: colors.background,
  },
  left: {
    width: 56,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 50,
    borderWidth: 1.5,
    padding: 40,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 158,
    height: 158,
    tintColor: colors.primary,
  },
  center: {
    alignItems: 'center',
    gap: 1,
  },
  dayText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  dateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  right: {
    width: 52,
    alignItems: 'flex-end',
  },
});
