// app/(tabs)/tasks.jsx
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { router, useFocusEffect } from 'expo-router';
import { TaskCard } from '../../components/TaskCard';
import { Ionicons } from '@expo/vector-icons';
import TaskFilters from '../../components/TaskFilters';
import ScreenLayout from '../../components/ScreenLayout';
import colors from '../constants/colors';
import FAB from '../../components/Fab';
import { StatsBar } from '../../components/StatsBar';

// ! TODO: GUARDAR EN CACHE
/**
 * La solución profesional es React Query (ahora llamado TanStack Query). Maneja la caché automáticamente.
 */

// ─── Design tokens (idénticos al login para coherencia) ──────────
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

// ─── Empty state component ───────────────────────────────────────
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
    <View style={styles.emptyContainer}>
      <Animated.Text style={[styles.emptyEmoji, { transform: [{ translateY: bounce }] }]}>
        ✅
      </Animated.Text>
      <Text style={styles.emptyTitle}>Todo despejado</Text>
      <Text style={styles.emptySubtitle}>
        No tienes tareas pendientes.{'\n'}Pulsa <Text style={{ color: BRAND.primary }}>+</Text> para
        crear una.
      </Text>
    </View>
  );
};

// ─── Main screen ─────────────────────────────────────────────────
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

  useFocusEffect(
    useCallback(() => {
      headerFade.setValue(0);
      listSlide.setValue(20);
      fetchTasks().then(animateIn);
    }, []),
  );

  // ── Section header inside list ──
  const ListHeader = () => (
    <Animated.View style={{ opacity: headerFade }}>
      <StatsBar tasks={tasks} />
      <TaskFilters onFilterChange={fetchTasks} />
      <View style={styles.listLabelRow}>
        <Text style={styles.listCount}>
          {tasks.length} resultado{tasks.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <ScreenLayout title="Mis Tareas">
      {/* Blobs decorativos */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <View style={styles.container}>
        <Animated.View
          style={{ flex: 1, opacity: headerFade, transform: [{ translateY: listSlide }] }}
        >
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
            ListHeaderComponent={<ListHeader />}
            ListEmptyComponent={!loading ? <EmptyState /> : null}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>

        <FAB href="tasks/new" />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },

  // ── Blobs ────────────────────────────────────────────────────
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

  // ── Stats bar ────────────────────────────────────────────────
  statsBar: {
    marginBottom: 16,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statChip: {
    flex: 1,
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BRAND.border,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  statNum: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  // ── Progress bar ─────────────────────────────────────────────
  progressTrack: {
    height: 4,
    backgroundColor: BRAND.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: BRAND.accent,
    shadowColor: BRAND.accent,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },

  // ── List section label ───────────────────────────────────────
  listLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  listLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.primary,
    letterSpacing: 0.5,
  },
  listCount: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },

  // ── Empty state ──────────────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 32,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default Tasks;
