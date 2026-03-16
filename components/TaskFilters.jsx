// components/TaskFilters.jsx
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND = {
  primary: '#FF6B35',
  accent: '#06D6A0',
  border: '#FFD9C0',
  surface: '#FFF8F0',
  text: '#1A1A2E',
  muted: '#9B8EA8',
  card: '#FFFFFF',
};

const PRIORITY_CONFIG = {
  high: { label: 'Alta', color: '#FF4757', bg: '#FFF0F1' },
  medium: { label: 'Media', color: '#FF6B35', bg: '#FFF4F0' },
  low: { label: 'Baja', color: '#06D6A0', bg: '#EDFDF8' },
};

const TaskFilters = ({ onFilterChange }) => {
  const [completedActive, setCompletedActive] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const completedScale = useRef(new Animated.Value(1)).current;
  const priorityScale = useRef(new Animated.Value(1)).current;
  const priorityBtnRef = useRef(null);

  const bounce = (anim) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 0.9, useNativeDriver: true, friction: 4 }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  };

  const toggleCompleted = () => {
    bounce(completedScale);
    const next = !completedActive;
    setCompletedActive(next);
    // ✅ Siempre pasa el valor exacto — no depende de truthiness
    onFilterChange({ completed: next, priority: selectedPriority });
  };

  const openPriorityMenu = () => {
    priorityBtnRef.current.measure((x, y, w, h, pageX, pageY) => {
      setMenuPosition({ top: pageY + h + 6, right: 16 });
      setPriorityMenuVisible(true);
    });
  };

  const selectPriority = (p) => {
    bounce(priorityScale);
    const next = selectedPriority === p ? null : p;
    setSelectedPriority(next);
    setPriorityMenuVisible(false);
    onFilterChange({ completed: completedActive, priority: next });
  };

  const clearAll = () => {
    setCompletedActive(false);
    setSelectedPriority(null);
    onFilterChange({ completed: false, priority: null });
  };

  const hasFilters = completedActive || !!selectedPriority;
  const activePri = selectedPriority ? PRIORITY_CONFIG[selectedPriority] : null;

  return (
    <View style={s.wrapper}>
      <View style={s.row}>
        {/* Completed chip */}
        <Animated.View style={{ transform: [{ scale: completedScale }] }}>
          <TouchableOpacity
            onPress={toggleCompleted}
            style={[s.chip, completedActive && s.chipGreen]}
            activeOpacity={0.85}
          >
            {completedActive && <Ionicons name="checkmark-circle" size={13} color={BRAND.accent} />}
            <Text style={[s.chipText, completedActive && { color: BRAND.accent }]}>
              Completadas
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Priority chip */}
        <Animated.View style={{ transform: [{ scale: priorityScale }] }}>
          <TouchableOpacity
            ref={priorityBtnRef}
            onPress={openPriorityMenu}
            style={[
              s.chip,
              activePri && { backgroundColor: activePri.bg, borderColor: activePri.color + '55' },
            ]}
            activeOpacity={0.85}
          >
            {activePri ? (
              <View style={[s.dot, { backgroundColor: activePri.color }]} />
            ) : (
              <Ionicons name="funnel-outline" size={12} color={BRAND.muted} />
            )}
            <Text style={[s.chipText, activePri && { color: activePri.color }]}>
              {activePri ? activePri.label : 'Prioridad'}
            </Text>
            <Ionicons
              name={priorityMenuVisible ? 'chevron-up' : 'chevron-down'}
              size={11}
              color={activePri ? activePri.color : BRAND.muted}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Clear — solo visible con filtros activos */}
        {hasFilters && (
          <TouchableOpacity onPress={clearAll} style={s.clearBtn} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={14} color={BRAND.muted} />
            <Text style={s.clearText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Priority dropdown */}
      <Modal
        visible={priorityMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPriorityMenuVisible(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          onPress={() => setPriorityMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={[s.menu, { top: menuPosition.top, right: menuPosition.right }]}>
            <View style={s.menuHeader}>
              <Text style={s.menuHeaderText}>PRIORIDAD</Text>
            </View>
            {['high', 'medium', 'low'].map((p, i) => {
              const cfg = PRIORITY_CONFIG[p];
              const active = selectedPriority === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => selectPriority(p)}
                  style={[
                    s.menuItem,
                    active && { backgroundColor: cfg.bg },
                    i < 2 && { borderBottomWidth: 1, borderBottomColor: BRAND.border },
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={[s.menuDot, { backgroundColor: cfg.color }]} />
                  <Text
                    style={[
                      s.menuText,
                      active && { color: cfg.color, fontFamily: 'Inter_700Bold' },
                    ]}
                  >
                    {cfg.label}
                  </Text>
                  {active && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={cfg.color}
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BRAND.card,
    borderWidth: 1.5,
    borderColor: BRAND.border,
  },
  chipGreen: {
    backgroundColor: '#EDFDF8',
    borderColor: '#06D6A055',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.muted,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.07)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: BRAND.card,
    borderRadius: 16,
    width: 160,
    borderWidth: 1,
    borderColor: BRAND.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    overflow: 'hidden',
  },
  menuHeader: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: BRAND.surface,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  menuHeaderText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: BRAND.primary,
    letterSpacing: 1.2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  menuDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  menuText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.text,
  },
});

export default TaskFilters;
