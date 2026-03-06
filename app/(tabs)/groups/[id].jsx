import { View, Text, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { TaskCard } from '../../../components/TaskCard';
import colors from '../../constants/colors';
import { api } from '../../../services/api';
import FAB from '../../../components/Fab';

const DEFAULT_BG = '#2C2C3E';

export default function GroupDetail() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchData = useCallback(() => {
    const fetch = async () => {
      const groupData = await api.get(`groups/${id}`);
      setGroup(groupData);
      const tasksData = await api.get(`groups/${id}/tasks`);
      setTasks(tasksData.tasks);
    };
    fetch();
  }, [id]);

  useFocusEffect(fetchData);

  if (!group) return <Text>Cargando...</Text>;

  const Header = group.coverImage ? ImageBackground : View;
  const headerProps = group.coverImage
    ? { source: { uri: group.coverImage }, style: styles.headerImage, resizeMode: 'cover' }
    : { style: [styles.headerImage, { backgroundColor: DEFAULT_BG }] };

  return (
    <View style={styles.container}>
      <Header {...headerProps}>
        <View style={group.coverImage ? styles.headerOverlay : {}}>
          <Text style={styles.groupTitle}>{group.name}</Text>
          {group.description && <Text style={styles.groupDescription}>{group.description}</Text>}
        </View>
      </Header>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <TaskCard task={item} onUpdate={fetchData} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas en este grupo</Text>}
      />

      <FAB href={`tasks/new?groupId=${id}`}></FAB>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImage: { width: '100%', height: 200, justifyContent: 'flex-end' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  groupTitle: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  groupDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 4,
  },
  listContent: { padding: 16 },
  emptyText: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 50 },
});
