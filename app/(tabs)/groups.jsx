// app/(tabs)/groups/index.jsx
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useCallback, useState, useRef } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';
import { GroupCard } from '../../components/GroupCard';
import ScreenLayout from '../../components/ScreenLayout';
import colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

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

const EmptyState = () => (
  <View style={s.emptyWrap}>
    <Text style={s.emptyEmoji}>🗂️</Text>
    <Text style={s.emptyTitle}>Sin grupos aún</Text>
    <Text style={s.emptyDesc}>Crea uno o únete con un código.</Text>
  </View>
);

const Groups = () => {
  const [groups, setGroups] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(16);
      const fetchGroups = async () => {
        const data = await api.get('groups');
        setGroups(data.groups);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start();
      };
      fetchGroups();
    }, []),
  );

  const ListHeader = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {/* Action buttons */}
      <View style={s.actionsRow}>
        <TouchableOpacity
          style={s.btnPrimary}
          onPress={() => router.push('groups/new')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={s.btnPrimaryText}>Crear grupo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnOutline}
          onPress={() => router.push('groups/join')}
          activeOpacity={0.85}
        >
          <Ionicons name="link-outline" size={15} color={BRAND.primary} />
          <Text style={s.btnOutlineText}>Unirme</Text>
        </TouchableOpacity>
      </View>

      {/* Section label */}
      {groups.length > 0 && (
        <View style={s.labelRow}>
          <Text style={s.labelCount}>
            {groups.length} grupo{groups.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <ScreenLayout title="Mis Grupos">
      {/* Blobs */}
      <View style={s.blob1} />
      <View style={s.blob2} />

      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <GroupCard
              group={item}
              onPress={() => router.push(`groups/${item._id}`)}
              onUpdate={() => router.push(`/groups/${item._id}`)}
            />
          </Animated.View>
        )}
      />
    </ScreenLayout>
  );
};

const s = StyleSheet.create({
  // ── Blobs ────────────────────────────────────────────────────
  blob1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: BRAND.secondary,
    opacity: 0.18,
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    bottom: 80,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: BRAND.accent,
    opacity: 0.13,
    zIndex: 0,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // ── Action buttons ───────────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: BRAND.primary,
    borderRadius: 14,
    paddingVertical: 13,
    shadowColor: BRAND.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    letterSpacing: 0.1,
  },
  btnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: BRAND.card,
    borderRadius: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: BRAND.border,
  },
  btnOutlineText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.primary,
    letterSpacing: 0.1,
  },

  // ── Section label ────────────────────────────────────────────
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: BRAND.primary,
    letterSpacing: 0.5,
  },
  labelCount: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },

  // ── Empty ────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyEmoji: { fontSize: 44, marginBottom: 6 },
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
  },
});

export default Groups;
