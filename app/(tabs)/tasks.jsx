// app/(tabs)/tasks.jsx
import { View, Text, StyleSheet, FlatList, RefreshControl, Animated } from 'react-native';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { useFocusEffect } from 'expo-router';
import { TaskCard } from '../../components/TaskCard';
import TaskFilters from '../../components/TaskFilters';
import ScreenLayout from '../../components/ScreenLayout';
import FAB from '../../components/Fab';
import { StatsBar } from '../../components/StatsBar';

const BRAND = {
  primary: '#FF6B35',
  secondary: '#FFD23F',
  accent: '#06D6A0',
  surface: '#FFF8F0',
  bg: '#FFFBF5',
  border: '#FFD9C0',
  text: '#1A1A2E',
  muted: '#9B8EA8',
  card: '#FFFFFF',
};

// ─── Empty state — fuera del componente para evitar recreaciones ──
const EmptyState = () => {
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -8, duration: 700, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return (
    <View style={s.emptyContainer}>
      <Animated.Text style={[s.emptyEmoji, { transform: [{ translateY: bounce }] }]}>
        ✅
      </Animated.Text>
      <Text style={s.emptyTitle}>Todo despejado</Text>
      <Text style={s.emptySubtitle}>
        No tienes tareas pendientes.{'\n'}
        Pulsa <Text style={{ color: BRAND.primary }}>+</Text> para crear una.
      </Text>
    </View>
  );
};

// ─── ListHeader — fuera del componente, recibe datos por props ────
// Definirlo dentro de Tasks hace que React cree una función nueva
// en cada render, lo que destruye el estado de TaskFilters.
const ListHeader = ({ tasks, onFilterChange }) => (
  <View>
    <StatsBar tasks={tasks} />
    <TaskFilters onFilterChange={onFilterChange} />
    <View style={s.listLabelRow}>
      <Text style={s.listCount}>
        {tasks.length} resultado{tasks.length !== 1 ? 's' : ''}
      </Text>
    </View>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const listSlide = useRef(new Animated.Value(20)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(listSlide, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  };

  const fetchTasks = async (filters = {}) => {
    try {
      setLoading(true);
      let url = 'tasks';
      const params = [];
      if (filters.completed === true) params.push('completed=true');
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

  useFocusEffect(
    useCallback(() => {
      headerFade.setValue(0);
      listSlide.setValue(20);
      fetchTasks().then(animateIn);
    }, []),
  );

  return (
    <ScreenLayout title="Mis Tareas">
      <View style={s.blobTopRight} />
      <View style={s.blobBottomLeft} />

      <View style={s.container}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <Animated.View
              style={{
                opacity: headerFade,
                transform: [
                  {
                    translateY: headerFade.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16 + index * 4, 0],
                    }),
                  },
                ],
              }}
            >
              <TaskCard task={item} onUpdate={fetchTasks} />
            </Animated.View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchTasks}
              tintColor={BRAND.primary}
              colors={[BRAND.primary, BRAND.accent]}
            />
          }
          ListHeaderComponent={
            // Instancia con props — al ser componente externo React
            // mantiene su estado entre renders
            <ListHeader tasks={tasks} onFilterChange={fetchTasks} />
          }
          ListEmptyComponent={!loading ? <EmptyState /> : null}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        />
        <FAB href="tasks/new" />
      </View>
    </ScreenLayout>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.bg },

  blobTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: BRAND.secondary,
    opacity: 0.2,
    zIndex: 0,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: 60,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: BRAND.accent,
    opacity: 0.14,
    zIndex: 0,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 8,
  },
  listLabelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    marginTop: 4,
  },
  listCount: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 32,
    gap: 10,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: BRAND.text, letterSpacing: -0.3 },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default Tasks;
