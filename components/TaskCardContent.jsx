// components/TaskCardContent.jsx
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TaskMenu } from './TaskMenu';
import { router } from 'expo-router';
import { api } from '../services/api';

// ─── Design tokens ────────────────────────────────────────────────
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

const PRIORITY_LABEL = {
  high: { label: 'Alta', color: '#FF4757' },
  medium: { label: 'Media', color: '#FF6B35' },
  low: { label: 'Baja', color: '#06D6A0' },
};

export function TaskCardContent({ task, completed, toggleComplete, config, onUpdate, darkMode }) {
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [menuVisible, setMenuVisible] = useState(false);

  const checkScale = useRef(new Animated.Value(1)).current;
  const menuButtonRef = useRef(null);

  const titleColor = darkMode ? '#fff' : BRAND.text;
  const titleDone = darkMode ? 'rgba(255,255,255,0.4)' : BRAND.muted;
  const descColor = darkMode ? 'rgba(255,255,255,0.75)' : BRAND.muted;
  const borderColor = darkMode ? 'rgba(255,255,255,0.15)' : BRAND.border;
  const menuIconColor = darkMode ? 'rgba(255,255,255,0.85)' : BRAND.muted;

  const openMenu = () => {
    menuButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ top: pageY + height, right: 16 });
      setMenuVisible(true);
    });
  };

  const handleDelete = async () => {
    try {
      setMenuVisible(false);
      await api.delete(`tasks/${task._id}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setMenuVisible(false);
    router.push({ pathname: '/tasks/[id]', params: { id: task._id } });
  };

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 0.78, useNativeDriver: true, friction: 4 }),
      Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
    toggleComplete();
  };

  const priority = task.priority ? PRIORITY_LABEL[task.priority] : null;

  return (
    <>
      <TaskMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={menuPosition}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <View style={styles.container}>
        {/* ── Top: title + menu ── */}
        <View style={styles.topRow}>
          <View style={styles.topInfo}>
            <Text
              style={[
                styles.titulo,
                { color: titleColor },
                completed && { textDecorationLine: 'line-through', color: titleDone },
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
          </View>

          <TouchableOpacity
            ref={menuButtonRef}
            onPress={openMenu}
            style={[
              styles.menuButton,
              darkMode && {
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderColor: 'rgba(255,255,255,0.2)',
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="ellipsis-horizontal" size={16} color={menuIconColor} />
          </TouchableOpacity>
        </View>

        {/* ── Description ── */}
        {!!task.description?.trim() && (
          <Text style={[styles.descripcion, { color: descColor }]} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* ── Bottom: priority + complete ── */}
        <View style={[styles.bottomRow, { borderTopColor: borderColor }]}>
          {priority ? (
            <View style={[styles.priorityPill, { borderColor: priority.color + '55' }]}>
              <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
              <Text style={[styles.priorityText, { color: priority.color }]}>{priority.label}</Text>
            </View>
          ) : (
            <View />
          )}

          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <TouchableOpacity
              onPress={handleToggle}
              style={[
                styles.completeButton,
                completed && styles.completeButtonDone,
                darkMode &&
                  !completed && {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
              ]}
              activeOpacity={0.8}
            >
              {completed ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : (
                <View
                  style={[styles.radioEmpty, darkMode && { borderColor: 'rgba(255,255,255,0.6)' }]}
                />
              )}
              <Text
                style={[
                  styles.completeText,
                  completed && { color: '#fff' },
                  !completed && darkMode && { color: 'rgba(255,255,255,0.85)' },
                ]}
              >
                {completed ? 'Hecha ✓' : 'Completar'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  topInfo: {
    flex: 1,
  },

  // ── Título con Syne Bold — igual que los section-title del portfolio ──
  titulo: {
    fontSize: 16,
    fontFamily: 'Syne_700Bold', // ← display font, más carácter
    lineHeight: 22,
    letterSpacing: -0.3,
  },

  menuButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: BRAND.surface,
    borderWidth: 1,
    borderColor: BRAND.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    flexShrink: 0,
  },

  // ── Descripción con Space Mono — toque técnico coherente con el portfolio ──
  descripcion: {
    fontSize: 11,
    fontFamily: 'SpaceMono_400Regular', // ← monospace para descripción/detalles
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'SpaceMono_400Regular',
    letterSpacing: 0.2,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: BRAND.surface,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  completeButtonDone: {
    backgroundColor: BRAND.accent,
    borderColor: BRAND.accent,
  },
  radioEmpty: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: BRAND.muted,
  },
  completeText: {
    fontSize: 10,
    fontFamily: 'SpaceMono_400Regular',
    color: BRAND.muted,
    letterSpacing: 0.2,
  },
});
