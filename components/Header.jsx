// components/Header.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ title }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/profile')}>
        <Ionicons name="help-circle-outline" size={32} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => router.push('/profile')}>
        <Ionicons name="person-circle-outline" size={32} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
  },
  placeholder: {
    width: 32, // mismo ancho que el icono para centrar el título
  },
  title: {
    fontFamily: 'Mulish_200ExtraLight',
    fontSize: 18,
    fontWeight: '600',
  },
});
