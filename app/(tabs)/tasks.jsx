import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { api } from '../../services/api';
import { router, useFocusEffect } from 'expo-router';
import { TaskCard } from '../../components/TaskCard';
import Header from '../../components/Header';
import SearchInput from '../../components/Input';
import { Ionicons } from '@expo/vector-icons';
import TaskFilters from '../../components/TaskFilters';

// ! TODO: GUARDAR EN CACHE
/**
 * La solución profesional es React Query (ahora llamado TanStack Query). Maneja la caché automáticamente:
 */

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (filters = {}) => {
    try {
      setLoading(true);
      let url = 'tasks';
      const params = [];
      if (filters.completed) params.push('completed=true');
      if (filters.priority) params.push(`priority=${filters.priority}`);
      if (params.length) url += '?' + params.join('&');

      const data = await api.get(url);
      setTasks(data.tasks);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async (text) => {
    try {
      setLoading(true);
      const data = await api.get(`tasks?search=${text}`);
      setTasks(data.tasks);
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header title="Mis Tareas" />

      <SearchInput onSearch={onSearch} />

      <TaskFilters onFilterChange={fetchTasks} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TaskCard task={item} />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTasks} />}
        ListEmptyComponent={<Text style={styles.empty}>No tienes tareas</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('tasks/new')}>
        <Ionicons name="add-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
  },
});

export default Tasks;
