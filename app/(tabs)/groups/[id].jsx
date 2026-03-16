// app/(tabs)/groups/[id].jsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import { TaskCard } from '../../../components/TaskCard';
import { api } from '../../../services/api';
import FAB from '../../../components/Fab';
import { Ionicons } from '@expo/vector-icons';
import { StatsBar } from '../../../components/StatsBar';

// ─── Design tokens ────────────────────────────────────────────────
const BRAND = {
  primary: '#FF6B35',
  accent: '#06D6A0',
  secondary: '#FFD23F',
  border: '#FFD9C0',
  surface: '#FFF8F0',
  bg: '#FFFBF5',
  text: '#1A1A2E',
  muted: '#9B8EA8',
  card: '#FFFFFF',
};

// ─── Empty state ──────────────────────────────────────────────────
const EmptyState = () => {
  const bounce = useRef(new Animated.Value(0)).current;
  useState(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -8, duration: 700, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  });
  return (
    <View style={s.emptyWrap}>
      <Animated.Text style={[s.emptyEmoji, { transform: [{ translateY: bounce }] }]}>
        📋
      </Animated.Text>
      <Text style={s.emptyTitle}>Sin tareas aún</Text>
      <Text style={s.emptyDesc}>
        Pulsa <Text style={{ color: BRAND.primary }}>+</Text> para añadir la primera.
      </Text>
    </View>
  );
};

// ─── Main screen ─────────────────────────────────────────────────
export default function GroupDetail() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchData = useCallback(() => {
    const load = async () => {
      const groupData = await api.get(`groups/${id}`);
      setGroup(groupData);
      const tasksData = await api.get(`groups/${id}/tasks`);
      setTasks(tasksData.tasks);

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]).start();
    };
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    load();
  }, [id]);

  useFocusEffect(fetchData);

  // ── Loading ──────────────────────────────────────────────────
  if (!group) {
    return (
      <View style={s.loadingWrap}>
        <View style={s.loadingBlob} />
        <Text style={s.loadingText}>Cargando grupo...</Text>
      </View>
    );
  }

  // ── List header ──────────────────────────────────────────────
  const ListHeader = () => (
    <View>
      <StatsBar tasks={tasks} />
      <View style={s.listLabelRow}>
        <Text style={s.listCount}>
          {tasks.length} resultado{tasks.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  // ── Hero header ──────────────────────────────────────────────
  const HeroContent = (
    <>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
      </TouchableOpacity>

      {/* Group info bottom-aligned */}
      <View style={s.heroBottom}>
        {group.description ? (
          <Text style={s.heroDesc} numberOfLines={2}>
            {group.description}
          </Text>
        ) : null}
        <Text style={s.heroTitle}>{group.name}</Text>

        {/* Member count if available */}
        {group.members?.length > 0 && (
          <View style={s.memberRow}>
            <Ionicons name="people-outline" size={13} color="rgba(255,255,255,0.75)" />
            <Text style={s.memberText}>
              {group.members.length} miembro{group.members.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </>
  );

  return (
    <View style={s.container}>
      {/* ── Hero ── */}
      {group.coverImage ? (
        <ImageBackground source={{ uri: group.coverImage }} style={s.hero} resizeMode="cover">
          <View style={s.heroOverlay} />
          {HeroContent}
        </ImageBackground>
      ) : (
        <View style={[s.hero, s.heroFallback]}>
          {/* Decorative blobs on fallback */}
          <View style={s.heroBlob1} />
          <View style={s.heroBlob2} />
          {HeroContent}
        </View>
      )}

      {/* ── Task list ── */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={s.listContent}
        renderItem={({ item }) => <TaskCard groupId={id} task={item} onUpdate={fetchData} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />

      <FAB href={`tasks/new?groupId=${id}`} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },

  // ── Loading ──────────────────────────────────────────────────
  loadingWrap: {
    flex: 1,
    backgroundColor: BRAND.bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingBlob: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BRAND.primary,
    opacity: 0.15,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },

  // ── Hero ─────────────────────────────────────────────────────
  hero: {
    height: 220,
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 52,
  },
  heroFallback: {
    backgroundColor: BRAND.text,
    overflow: 'hidden',
  },
  heroBlob1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: BRAND.primary,
    opacity: 0.35,
  },
  heroBlob2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: BRAND.accent,
    opacity: 0.25,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    zIndex: 1,
  },
  heroBottom: {
    gap: 3,
    zIndex: 1,
  },
  heroDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.2,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Inter_800ExtraBold',
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  memberText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.7)',
  },

  // ── List ─────────────────────────────────────────────────────
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  listLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: BRAND.primary,
    letterSpacing: 0.5,
  },
  listCount: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },

  // ── Stats ────────────────────────────────────────────────────
  statsWrap: {
    marginBottom: 16,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flex: 1,
    backgroundColor: BRAND.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND.border,
    paddingVertical: 9,
    alignItems: 'center',
    gap: 2,
  },
  statNum: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: BRAND.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 9,
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
  },

  // ── Empty state ──────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 56,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: -0.3,
  },
  emptyDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
