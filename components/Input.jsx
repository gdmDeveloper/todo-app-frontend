import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (text) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Ionicons name="search-outline" size={18} color="#999" style={styles.icon} />
        <TextInput
          value={query}
          onChangeText={handleChange}
          placeholder="Buscar tareas..."
          placeholderTextColor="#999"
          style={styles.input}
          clearButtonMode="while-editing" // botón x de iOS
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7', // gris iOS
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '95%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    fontFamily: 'Inter_500Medium',
  },
});
