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
import { Ionicons } from '@expo/vector-icons';
import TaskFilters from '../../components/TaskFilters';
import ScreenLayout from '../../components/ScreenLayout';
import colors from '../constants/colors';
import FAB from '../../components/Fab';

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
    <ScreenLayout title={'Mis Tareas'}>
      <View style={styles.container}>
        <TaskFilters onFilterChange={fetchTasks} />

        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <TaskCard task={item} onUpdate={fetchTasks} />}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTasks} />}
          ListEmptyComponent={<Text style={styles.empty}>No tienes tareas</Text>}
        />
        <FAB href="tasks/new" />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});

export default Tasks;
