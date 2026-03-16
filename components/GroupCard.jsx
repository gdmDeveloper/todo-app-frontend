// components/GroupCard.jsx
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TaskMenu } from './TaskMenu';
import { api } from '../services/api';

const BRAND = {
  primary: '#FF6B35',
  accent: '#06D6A0',
  secondary: '#FFD23F',
  border: '#FFD9C0',
  surface: '#FFF8F0',
  text: '#1A1A2E',
  muted: '#9B8EA8',
  card: '#FFFFFF',
};

const ACCENTS = [
  { color: '#FF6B35', dark: '#CC4A1A' },
  { color: '#06D6A0', dark: '#049970' },
  { color: '#FFD23F', dark: '#CC9A00' },
  { color: '#6C63FF', dark: '#4A43CC' },
  { color: '#FF2D78', dark: '#CC0050' },
];

const getAccent = (id = '') => ACCENTS[id.charCodeAt(id.length - 1) % ACCENTS.length];

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

export function GroupCard({ group, onUpdate, onPress }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const pressScale = useRef(new Animated.Value(1)).current;
  const menuRef = useRef(null);
  const accent = getAccent(group._id);

  const pressIn = () =>
    Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true, friction: 5 }).start();
  const pressOut = () =>
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();

  const openMenu = () => {
    menuRef.current.measure((x, y, w, h, pageX, pageY) => {
      setMenuPosition({ top: pageY + h + 4, right: 16 });
      setMenuVisible(true);
    });
  };

  const handleEdit = () => {
    setMenuVisible(false);
    router.push(`/groups/edit/${group._id}`);
  };

  const handleDelete = async () => {
    setMenuVisible(false);
    try {
      await api.delete(`groups/${group._id}`);
      if (onUpdate) onUpdate();
    } catch (e) {}
  };

  // ── Card content (shared between image and no-image variants) ──
  const CardContent = ({ dark = false }) => (
    <View style={s.cardInner}>
      {/* Menu button */}
      <TouchableOpacity
        ref={menuRef}
        onPress={openMenu}
        style={[
          s.menuBtn,
          !dark && { backgroundColor: 'rgba(0,0,0,0.15)', borderColor: 'rgba(255,255,255,0.15)' },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="ellipsis-horizontal" size={15} color="#fff" />
      </TouchableOpacity>

      {/* Bottom info */}
      <View style={s.cardBottom}>
        {group.description ? (
          <Text style={s.cardDesc} numberOfLines={1}>
            {group.description}
          </Text>
        ) : null}
        <Text style={s.cardTitle} numberOfLines={1}>
          {group.name}
        </Text>
        {group.members?.length > 0 && (
          <View style={s.memberRow}>
            <Ionicons name="people-outline" size={11} color="rgba(255,255,255,0.7)" />
            <Text style={s.memberText}>
              {group.members.length} miembro{group.members.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <>
      <TaskMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={menuPosition}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Animated.View style={[s.cardWrap, { transform: [{ scale: pressScale }] }]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          activeOpacity={1}
        >
          {group.coverImage ? (
            // ── Con imagen ──────────────────────────────────────
            <ImageBackground
              source={{ uri: group.coverImage }}
              style={s.card}
              imageStyle={s.cardImage}
              resizeMode="cover"
            >
              <View style={s.imageOverlay} />
              <CardContent dark />
            </ImageBackground>
          ) : (
            // ── Sin imagen — fondo de color con iniciales ───────
            <View style={[s.card, { backgroundColor: accent.dark }]}>
              <View style={[s.colorOverlay, { backgroundColor: accent.color + '22' }]} />
              {/* Blob decorativo */}
              <View style={[s.blob, { backgroundColor: accent.color + '33' }]} />
              {/* Iniciales centradas */}
              <View style={s.initialsWrap}>
                <Text style={s.initials}>{initials(group.name)}</Text>
              </View>
              <CardContent />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const s = StyleSheet.create({
  cardWrap: {
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    height: 120,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardImage: {
    borderRadius: 16,
  },

  // ── Overlays ─────────────────────────────────────────────────
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  colorOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  // ── Iniciales ────────────────────────────────────────────────
  initialsWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 36,
    fontFamily: 'Inter_800ExtraBold',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: -1,
  },

  // ── Card inner ───────────────────────────────────────────────
  cardInner: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },

  // ── Menu button ──────────────────────────────────────────────
  menuBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },

  // ── Bottom info ──────────────────────────────────────────────
  cardBottom: {
    gap: 2,
  },
  cardDesc: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.65)',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    letterSpacing: -0.3,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  memberText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.65)',
  },
});
