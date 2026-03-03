import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { api } from '../../services/api';

export default function GroupDetail() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchGroup = async () => {
    try {
      const data = await api.get(`groups/${id}`);
      setGroup(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroupTasks = async () => {
    try {
      const data = await api.get(`groups/${id}/tasks`);
      setTasks(data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroup();
      fetchGroupTasks();
    }, [id]),
  );

  if (!group)
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.nombre}>{group.name}</Text>
      <Text style={styles.descripcion}>{group.description}</Text>
      <Text style={styles.miembros}>{group.members.length} miembros</Text>

      <TouchableOpacity style={styles.boton} onPress={() => router.push(`/groups/${id}/tasks/new`)}>
        <Text>Nueva tarea</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay tareas en este grupo</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  nombre: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  descripcion: { color: '#666', marginBottom: 4 },
  miembros: { color: '#999', marginBottom: 24 },
  boton: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, marginBottom: 16 },
  task: { padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 8 },
});
