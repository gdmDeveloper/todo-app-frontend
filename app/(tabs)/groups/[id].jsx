// app/(tabs)/groups/[id].jsx
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Animated,
  TouchableOpacity,
  Modal,
  Clipboard,
} from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import { TaskCard } from '../../../components/TaskCard';
import { api } from '../../../services/api';
import FAB from '../../../components/Fab';
import { Ionicons } from '@expo/vector-icons';
import { StatsBar } from '../../../components/StatsBar';

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

// ─── Invite modal ─────────────────────────────────────────────────
const InviteModal = ({ visible, onClose, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={s.modalCard}>
          <View style={s.modalHeader}>
            <View style={s.modalIconWrap}>
              <Ionicons name="people" size={20} color={BRAND.primary} />
            </View>
            <TouchableOpacity onPress={onClose} style={s.modalClose}>
              <Ionicons name="close" size={18} color={BRAND.muted} />
            </TouchableOpacity>
          </View>

          <Text style={s.modalTitle}>Código de invitación</Text>
          <Text style={s.modalSubtitle}>Comparte este código para que otros se unan al grupo.</Text>

          <View style={s.codeWrap}>
            <Text style={s.codeText}>{code}</Text>
          </View>

          <TouchableOpacity
            onPress={handleCopy}
            style={[s.copyBtn, copied && s.copyBtnDone]}
            activeOpacity={0.85}
          >
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={16}
              color={copied ? '#fff' : BRAND.primary}
            />
            <Text style={[s.copyBtnText, copied && { color: '#fff' }]}>
              {copied ? 'Copiado' : 'Copiar código'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── Hero content — fuera, recibe props ───────────────────────────
const HeroContent = ({ group, onInvitePress }) => (
  <>
    <View style={s.heroTopRow}>
      <TouchableOpacity onPress={() => router.push('groups')} style={s.backBtn} activeOpacity={0.8}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
      </TouchableOpacity>

      {group.invitationCode && (
        <TouchableOpacity onPress={onInvitePress} style={s.inviteBtn} activeOpacity={0.85}>
          <Ionicons name="key-outline" size={13} color="#fff" />
          <Text style={s.inviteBtnText}>Código</Text>
        </TouchableOpacity>
      )}
    </View>

    <View style={s.heroBottom}>
      {!!group.description && (
        <Text style={s.heroDesc} numberOfLines={2}>
          {group.description}
        </Text>
      )}
      <Text style={s.heroTitle}>{group.name}</Text>
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

// ─── List header — fuera, recibe props ────────────────────────────
const ListHeader = ({ tasks }) => (
  <View>
    <StatsBar tasks={tasks} />
    <View style={s.listLabelRow}>
      <Text style={s.listCount}>
        {tasks.length} resultado{tasks.length !== 1 ? 's' : ''}
      </Text>
    </View>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────
export default function GroupDetail() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [inviteVisible, setInvite] = useState(false);

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

  if (!group) {
    return (
      <View style={s.loadingWrap}>
        <View style={s.loadingBlob} />
        <Text style={s.loadingText}>Cargando grupo...</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <InviteModal
        visible={inviteVisible}
        onClose={() => setInvite(false)}
        code={group.invitationCode}
      />

      {/* Hero */}
      {group.coverImage ? (
        <ImageBackground source={{ uri: group.coverImage }} style={s.hero} resizeMode="cover">
          <View style={s.heroOverlay} />
          <HeroContent group={group} onInvitePress={() => setInvite(true)} />
        </ImageBackground>
      ) : (
        <View style={[s.hero, s.heroFallback]}>
          <View style={s.heroBlob1} />
          <View style={s.heroBlob2} />
          <HeroContent group={group} onInvitePress={() => setInvite(true)} />
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={s.listContent}
        renderItem={({ item }) => <TaskCard groupId={id} task={item} onUpdate={fetchData} />}
        ListHeaderComponent={<ListHeader tasks={tasks} />}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />

      <FAB href={`tasks/new?groupId=${id}`} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.bg },

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
  loadingText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: BRAND.muted },

  hero: {
    height: 220,
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 52,
  },
  heroFallback: { backgroundColor: BRAND.text, overflow: 'hidden' },
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
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  inviteBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    letterSpacing: 0.2,
  },
  heroBottom: { gap: 3 },
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
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  memberText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)' },

  listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  listLabelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    marginTop: 4,
  },
  listCount: { fontSize: 11, fontFamily: 'Inter_400Regular', color: BRAND.muted },

  emptyWrap: { alignItems: 'center', paddingTop: 56, gap: 8 },
  emptyEmoji: { fontSize: 48, marginBottom: 6 },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: BRAND.text, letterSpacing: -0.3 },
  emptyDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    textAlign: 'center',
    lineHeight: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: BRAND.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: BRAND.border,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BRAND.surface,
    borderWidth: 1,
    borderColor: BRAND.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: BRAND.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    lineHeight: 20,
    marginBottom: 20,
  },
  codeWrap: {
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  codeText: {
    fontSize: 28,
    fontFamily: 'Inter_800ExtraBold',
    color: BRAND.text,
    letterSpacing: 6,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.surface,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    borderRadius: 14,
    paddingVertical: 13,
  },
  copyBtnDone: { backgroundColor: BRAND.accent, borderColor: BRAND.accent },
  copyBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.primary,
    letterSpacing: 0.2,
  },
});
