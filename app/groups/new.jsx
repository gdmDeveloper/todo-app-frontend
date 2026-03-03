import { View, Text, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { api } from '../../services/api';
import { useState } from 'react';
import { router } from 'expo-router';

const NewGroup = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateGroup = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Group name is required');

    try {
      await api.post('groups', { name, description });
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Japan 2026"
        style={styles.input}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Get everything done..."
        style={styles.input}
        multiline
      />
      <TouchableOpacity onPress={handleCreateGroup} style={styles.boton}>
        <Text style={styles.botonTexto}>Crear grupo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  form: {
    flex: 1,
    justifyContent: 'center', // centra verticalmente el formulario
    alignItems: 'center',
    gap: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  input: {
    padding: 10,
    border: '1px solid grey',
    borderRadius: 10,
  },
});

export default NewGroup;
