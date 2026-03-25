// app/(tabs)/groups/join.jsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../services/api';

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

const JoinGroup = () => {
  const [code, setCode] = useState('');
  const [groupInfo, setGroupInfo] = useState(null);
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');

  const cardAnim = new Animated.Value(0);

  const animateCard = () => {
    Animated.spring(cardAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const handleSearch = async () => {
    if (!code.trim()) return;
    setError('');
    setGroupInfo(null);
    setSearching(true);
    try {
      const data = await api.get(`groups/search?code=${code.trim()}`);
      setGroupInfo(data);
      animateCard();
    } catch {
      setError('No se encontró ningún grupo con ese código.');
    } finally {
      setSearching(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post('groups/join', { groupId: groupInfo.id });
      router.replace('groups');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Blobs */}
      <View style={s.blob1} />
      <View style={s.blob2} />

      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
        <Ionicons name="chevron-back" size={18} color={BRAND.text} />
      </TouchableOpacity>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Buscar grupo</Text>
        <Text style={s.subtitle}>Introduce el código de invitación que te han compartido.</Text>
      </View>

      {/* Input */}
      <View style={[s.inputWrap, focused && s.inputWrapFocused]}>
        <Ionicons name="key-outline" size={18} color={focused ? BRAND.primary : BRAND.muted} />
        <TextInput
          value={code}
          onChangeText={(t) => {
            setCode(t.toUpperCase());
            setError('');
            setGroupInfo(null);
          }}
          placeholder="Ej: 18B97C0F"
          placeholderTextColor={BRAND.muted}
          autoCapitalize="characters"
          autoCorrect={false}
          style={s.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={handleSearch}
        />
        {code.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setCode('');
              setGroupInfo(null);
              setError('');
            }}
          >
            <Ionicons name="close-circle" size={18} color={BRAND.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search button */}
      <TouchableOpacity
        style={[s.searchBtn, (!code.trim() || searching) && { opacity: 0.6 }]}
        onPress={handleSearch}
        disabled={!code.trim() || searching}
        activeOpacity={0.85}
      >
        {searching ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="search" size={16} color="#fff" />
            <Text style={s.searchBtnText}>Buscar</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Error */}
      {!!error && (
        <View style={s.errorWrap}>
          <Ionicons name="alert-circle-outline" size={15} color={BRAND.primary} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {/* Result card */}
      {groupInfo && (
        <Animated.View
          style={[
            s.resultCard,
            {
              opacity: cardAnim,
              transform: [
                { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
              ],
            },
          ]}
        >
          {/* Group info */}
          <View style={s.resultHeader}>
            <View style={s.resultIconWrap}>
              <Text style={s.resultIconText}>
                {groupInfo.name
                  ?.split(' ')
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase())
                  .join('')}
              </Text>
            </View>
            <View style={s.resultInfo}>
              <Text style={s.resultName}>{groupInfo.name}</Text>
              {!!groupInfo.description && (
                <Text style={s.resultDesc} numberOfLines={2}>
                  {groupInfo.description}
                </Text>
              )}
            </View>
          </View>

          <View style={s.resultDivider} />

          {/* Members count */}
          <View style={s.resultMeta}>
            <Ionicons name="people-outline" size={14} color={BRAND.muted} />
            <Text style={s.resultMetaText}>
              {groupInfo.totalMembers} miembro{groupInfo.totalMembers !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Action */}
          {groupInfo.isMember ? (
            <View style={s.alreadyMemberWrap}>
              <Ionicons name="checkmark-circle" size={16} color={BRAND.accent} />
              <Text style={s.alreadyMemberText}>Ya eres miembro de este grupo</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[s.joinBtn, joining && { opacity: 0.6 }]}
              onPress={handleJoin}
              disabled={joining}
              activeOpacity={0.85}
            >
              {joining ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="enter-outline" size={16} color="#fff" />
                  <Text style={s.joinBtnText}>Unirme al grupo</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
    paddingHorizontal: 24,
    paddingTop: 56,
  },

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

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 1,
  },

  header: { marginBottom: 28, zIndex: 1 },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: BRAND.primary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_800ExtraBold',
    color: BRAND.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    lineHeight: 20,
  },

  // ── Input ────────────────────────────────────────────────────
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BRAND.card,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 12,
    zIndex: 1,
  },
  inputWrapFocused: {
    borderColor: BRAND.primary,
    shadowColor: BRAND.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: 2,
  },

  // ── Search button ────────────────────────────────────────────
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: BRAND.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    zIndex: 1,
  },
  searchBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },

  // ── Error ────────────────────────────────────────────────────
  errorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD0D0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    zIndex: 1,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: BRAND.primary,
  },

  // ── Result card ──────────────────────────────────────────────
  resultCard: {
    backgroundColor: BRAND.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: BRAND.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    zIndex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  resultIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: BRAND.surface,
    borderWidth: 1,
    borderColor: BRAND.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  resultIconText: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    color: BRAND.primary,
    letterSpacing: -0.5,
  },
  resultInfo: { flex: 1 },
  resultName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  resultDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    lineHeight: 17,
  },
  resultDivider: {
    height: 1,
    backgroundColor: BRAND.border,
    marginBottom: 12,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  resultMetaText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },

  // ── Already member ───────────────────────────────────────────
  alreadyMemberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EDFDF8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B8F2E3',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  alreadyMemberText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.accent,
  },

  // ── Join button ──────────────────────────────────────────────
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.accent,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: BRAND.accent,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  joinBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
});

export default JoinGroup;
