import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  // ! TODO: INPUT VALIDATION

  const handleLogin = async () => {
    try {
      setError({});
      await login(email, password); // login from AuthContext
    } catch (error) {
      setError({ general: error.message });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <View style={styles.form}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity onPress={handleLogin} disabled={!!isLoading}>
          <Text>{isLoading ? 'Accediendo...' : 'Acceder'}</Text>
        </TouchableOpacity>
      </View>
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

export default Login;
