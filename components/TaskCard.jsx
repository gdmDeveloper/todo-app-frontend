// components/TaskCard.jsx
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TaskMenu } from './TaskMenu';
import { router } from 'expo-router';
import { api } from '../services/api';

const BRAND = {
  primary: '#FF6B35',
  accent: '#06D6A0',
  border: '#FFD9C0',
  surface: '#FFF8F0',
  bg: '#FFFBF5',
  text: '#1A1A2E',
  muted: '#9B8EA8',
  card: '#FFFFFF',
};

const PRIORITY = {
  high: { label: 'Alta', color: '#FF4757', bg: '#FFF0F1' },
  medium: { label: 'Media', color: '#FF6B35', bg: '#FFF4F0' },
  low: { label: 'Baja', color: '#06D6A0', bg: '#EDFDF8' },
};

export function TaskCard({ task, onUpdate, groupId }) {
  const [completed, setCompleted] = useState(task.completed);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const fadeAnim = useRef(new Animated.Value(task.completed ? 0.45 : 1)).current;
  const checkScale = useRef(new Animated.Value(1)).current;
  const menuRef = useRef(null);

  const p = PRIORITY[task.priority] || null;

  const openMenu = () => {
    menuRef.current.measure((x, y, w, h, pageX, pageY) => {
      setMenuPosition({ top: pageY + h + 4, right: 16 });
      setMenuVisible(true);
    });
  };

  const handleDelete = async () => {
    try {
      setMenuVisible(false);
      await api.delete(`tasks/${task._id}`);
      if (onUpdate) onUpdate();
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = () => {
    setMenuVisible(false);
    router.push({ pathname: '/tasks/[id]', params: { id: task._id } });
  };

  const handleToggle = async () => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 0.75, useNativeDriver: true, friction: 4 }),
      Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();

    const next = !completed;
    Animated.timing(fadeAnim, {
      toValue: next ? 0.45 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    try {
      const endpoint = groupId ? `groups/${groupId}/tasks/${task._id}` : `tasks/${task._id}`;
      await api.patch(endpoint, { completed: next });
      setCompleted(next);
      if (onUpdate) onUpdate();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Animated.View style={[s.card, p && { borderLeftColor: p.color }, { opacity: fadeAnim }]}>
      <TaskMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={menuPosition}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <View style={s.row}>
        {/* Check */}
        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
          <TouchableOpacity onPress={handleToggle} style={s.checkWrap} activeOpacity={0.8}>
            <View style={[s.check, completed && s.checkDone]}>
              {completed && <Ionicons name="checkmark" size={11} color="#fff" />}
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Content */}
        <View style={s.content}>
          <Text style={[s.title, completed && s.titleDone]} numberOfLines={1}>
            {task.title}
          </Text>
          {!!task.description?.trim() && (
            <Text style={s.desc} numberOfLines={1}>
              {task.description}
            </Text>
          )}
        </View>

        {/* Right: priority + menu */}
        <View style={s.right}>
          {p && (
            <View style={[s.badge, { backgroundColor: p.bg }]}>
              <View style={[s.badgeDot, { backgroundColor: p.color }]} />
            </View>
          )}
          <TouchableOpacity
            ref={menuRef}
            onPress={openMenu}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="ellipsis-vertical" size={15} color={BRAND.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 14,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderLeftWidth: 3,
    borderLeftColor: BRAND.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // ── Check ────────────────────────────────────────────────────
  checkWrap: { padding: 2 },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    backgroundColor: BRAND.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkDone: {
    backgroundColor: BRAND.accent,
    borderColor: BRAND.accent,
  },

  // ── Content ──────────────────────────────────────────────────
  content: { flex: 1, gap: 2 },
  title: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.text,
    letterSpacing: -0.2,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: BRAND.muted,
    fontFamily: 'Inter_400Regular',
  },
  desc: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    lineHeight: 16,
  },

  // ── Right ────────────────────────────────────────────────────
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
