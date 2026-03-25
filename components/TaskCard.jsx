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
  high: {
    label: 'Alta',
    color: '#FF4757',
    bg: 'rgba(255,71,87,0.08)',
    glow: 'rgba(255,71,87,0.15)',
  },
  medium: {
    label: 'Media',
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.08)',
    glow: 'rgba(255,107,53,0.15)',
  },
  low: {
    label: 'Baja',
    color: '#06D6A0',
    bg: 'rgba(6,214,160,0.08)',
    glow: 'rgba(6,214,160,0.15)',
  },
};

export function TaskCard({ task, onUpdate, groupId }) {
  const [completed, setCompleted] = useState(task.completed);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const fadeAnim = useRef(new Animated.Value(task.completed ? 0.5 : 1)).current;
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
    } catch (e) {}
  };

  const handleEdit = () => {
    setMenuVisible(false);
    router.push({ pathname: '/tasks/[id]', params: { id: task._id } });
  };

  const handleToggle = async () => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 0.72, useNativeDriver: true, friction: 4 }),
      Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();

    const next = !completed;
    Animated.timing(fadeAnim, {
      toValue: next ? 0.5 : 1,
      duration: 280,
      useNativeDriver: true,
    }).start();

    try {
      const endpoint = groupId ? `groups/${groupId}/tasks/${task._id}` : `tasks/${task._id}`;
      await api.patch(endpoint, { completed: next });
      setCompleted(next);
      if (onUpdate) onUpdate();
    } catch (e) {}
  };

  return (
    <Animated.View
      style={[
        s.card,
        p && { borderLeftColor: p.color, shadowColor: p.color },
        { opacity: fadeAnim },
      ]}
    >
      <TaskMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={menuPosition}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Priority tint background */}
      {p && !completed && <View style={[s.priorityTint, { backgroundColor: p.bg }]} />}

      <View style={s.row}>
        {/* Check button */}
        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
          <TouchableOpacity onPress={handleToggle} activeOpacity={0.8} style={s.checkWrap}>
            <View
              style={[
                s.check,
                completed && s.checkDone,
                p && !completed && { borderColor: p.color },
              ]}
            >
              {completed ? (
                <Ionicons name="checkmark" size={11} color="#fff" />
              ) : (
                p && <View style={[s.checkInnerDot, { backgroundColor: p.color }]} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Text content */}
        <View style={s.content}>
          <Text
            style={[s.title, completed && s.titleDone, p && !completed && { color: BRAND.text }]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {!!task.description?.trim() && (
            <Text style={s.desc} numberOfLines={1}>
              {task.description}
            </Text>
          )}
        </View>

        {/* Right side */}
        <View style={s.right}>
          {p && !completed && (
            <View style={[s.priorityChip, { backgroundColor: p.bg, borderColor: p.color + '40' }]}>
              <Text style={[s.priorityLabel, { color: p.color }]}>{p.label}</Text>
            </View>
          )}
          <TouchableOpacity
            ref={menuRef}
            onPress={openMenu}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={s.menuBtn}
          >
            <Ionicons name="ellipsis-vertical" size={14} color={BRAND.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderLeftWidth: 3,
    borderLeftColor: BRAND.border,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: 'hidden',
  },

  // Subtle priority tint across the whole card
  priorityTint: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // ── Check ────────────────────────────────────────────────────
  checkWrap: { padding: 2 },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
  checkInnerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    opacity: 0.6,
  },

  // ── Content ──────────────────────────────────────────────────
  content: { flex: 1, gap: 3 },
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
    gap: 6,
    flexShrink: 0,
  },
  priorityChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priorityLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.2,
  },
  menuBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
