import { View, Text, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { api } from '../../services/api';

const NewTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleCreate = async () => {
    if (!title.trim()) return Alert.alert('Error', 'Title is required');

    try {
      console.log('entra');
      await api.post('tasks', { title, description, priority });
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput value={title} onChangeText={setTitle} placeholder="Título" style={styles.input} />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción"
        style={styles.input}
        multiline
      />
      <TouchableOpacity onPress={handleCreate} style={styles.boton}>
        <Text style={styles.botonTexto}>Crear tarea</Text>
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

export default NewTask;
