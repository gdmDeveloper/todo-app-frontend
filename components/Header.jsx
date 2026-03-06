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
      <View style={styles.center}>
        <Text style={styles.dayText}>{day}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.left}>
        <View style={styles.logoCircle}>
          <Image source={require('../img/hero.png')} style={styles.logo} resizeMode="contain" />
        </View>
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
    backgroundColor: '#fff',
  },
  left: {
    width: 56,
  },
  logoCircle: {
    width: 46,
    height: 46,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: colors.primary,
  },
  center: {
    alignItems: 'center',
    gap: 1,
  },
  dayText: {
    fontFamily: 'RobotoCondensed_400Regular',
    fontSize: 22,
    color: colors.textPrimary,
  },
  dateText: {
    fontFamily: 'RobotoCondensed_400Regular',
    fontSize: 18,
    color: colors.textSecondary,
  },
  right: {
    width: 52,
    alignItems: 'flex-end',
  },
});
