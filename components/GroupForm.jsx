// components/GroupForm.jsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
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

export default function GroupForm({
  title,
  setTitle,
  description,
  setDescription,
  coverImage,
  pickImage,
  uploading,
  saving,
  onSave,
  headerTitle,
  onBack,
}) {
  const isEdit = headerTitle === 'Editar grupo';

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Hero / cover ── */}
        <TouchableOpacity onPress={pickImage} disabled={uploading} activeOpacity={0.9}>
          {coverImage ? (
            <View style={s.heroContainer}>
              <Image source={{ uri: coverImage }} style={s.heroImage} />
              <View style={s.heroOverlay} />
              <View style={s.headerOverImage}>
                <TouchableOpacity onPress={onBack} style={s.backBtnDark} activeOpacity={0.8}>
                  <Ionicons name="chevron-back" size={18} color="#fff" />
                </TouchableOpacity>
                <View style={s.changeBadge}>
                  <Ionicons name="camera-outline" size={13} color="#fff" />
                  <Text style={s.changeBadgeText}>Cambiar</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={s.heroPlaceholder}>
              <View style={s.headerOverImage}>
                <TouchableOpacity onPress={onBack} style={s.backBtnLight} activeOpacity={0.8}>
                  <Ionicons name="chevron-back" size={18} color={BRAND.text} />
                </TouchableOpacity>
              </View>

              {/* Blobs decorativos en el placeholder */}
              <View style={s.placeholderBlob1} />
              <View style={s.placeholderBlob2} />

              {uploading ? (
                <ActivityIndicator color={BRAND.primary} size="large" />
              ) : (
                <>
                  <View style={s.cameraIconWrap}>
                    <Ionicons name="camera-outline" size={28} color={BRAND.primary} />
                  </View>
                  <Text style={s.placeholderTitle}>Añadir portada</Text>
                  <Text style={s.placeholderSub}>Opcional · 16:9 recomendado</Text>
                </>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* ── Form ── */}
        <View style={s.formWrap}>
          {/* Label */}
          <TextInput
            style={s.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Nombre del grupo"
            placeholderTextColor={BRAND.muted}
            multiline
          />

          <View style={s.divider} />

          {/* Description */}
          <TextInput
            style={s.descInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Añade una descripción..."
            placeholderTextColor={BRAND.muted}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* ── Save button ── */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.saveBtn, saving && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={s.saveBtnText}>{isEdit ? 'Guardar cambios' : 'Crear grupo'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.bg },
  scroll: { paddingBottom: 140 },

  // ── Hero con imagen ──────────────────────────────────────────
  heroContainer: { width: '100%', height: 240 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  // ── Hero placeholder ─────────────────────────────────────────
  heroPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: BRAND.surface,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  placeholderBlob1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: BRAND.secondary,
    opacity: 0.25,
  },
  placeholderBlob2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BRAND.accent,
    opacity: 0.2,
  },
  cameraIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeholderTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: BRAND.text,
  },
  placeholderSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
  },

  // ── Header over image ────────────────────────────────────────
  headerOverImage: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : Platform.OS === 'web' ? 16 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtnDark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnLight: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#fff',
  },

  // ── Form ─────────────────────────────────────────────────────
  formWrap: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: BRAND.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: BRAND.text,
    letterSpacing: -0.5,
    paddingVertical: 4,
    minHeight: 44,
  },
  divider: {
    height: 1,
    backgroundColor: BRAND.border,
    marginVertical: 20,
  },
  descInput: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: BRAND.text,
    minHeight: 100,
    lineHeight: 24,
  },

  // ── Footer ───────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 102,
    left: 20,
    right: 20,
  },
  saveBtn: {
    backgroundColor: BRAND.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: BRAND.primary,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  saveBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    letterSpacing: 0.2,
  },
});
