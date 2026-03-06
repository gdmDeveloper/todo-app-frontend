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
import colors from '../app/constants/colors';

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
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Imagen de portada como hero */}
        <TouchableOpacity onPress={pickImage} disabled={uploading} activeOpacity={0.9}>
          {coverImage ? (
            <View style={styles.heroContainer}>
              <Image source={{ uri: coverImage }} style={styles.heroImage} />
              <View style={styles.heroOverlay} />
              {/* Header encima de la imagen */}
              <View style={styles.headerOverImage}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={styles.editBadge}>
                  <Ionicons name="camera-outline" size={14} color="#fff" />
                  <Text style={styles.editBadgeText}>Cambiar</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.heroPlaceholder}>
              <View style={styles.headerOverImage}>
                <TouchableOpacity onPress={onBack} style={styles.backButtonDark}>
                  <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <Ionicons name="image-outline" size={36} color={colors.textMuted} />
              <Text style={styles.placeholderText}>Añadir imagen de portada</Text>
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Contenido del form */}
        <View style={styles.formContainer}>
          {/* Título grande estilo notion */}
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Nombre del grupo"
            placeholderTextColor={colors.textMuted}
            multiline
          />

          <View style={styles.divider} />

          {/* Descripción */}
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Añade una descripción..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>
      </ScrollView>

      {/* Botón guardar flotante abajo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>
                {headerTitle === 'Editar grupo' ? 'Guardar cambios' : 'Crear grupo'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 120 },

  // Hero imagen
  heroContainer: {
    width: '100%',
    height: 260,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header encima de imagen
  headerOverImage: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 16 : 52,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonDark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#fff',
  },

  // Form
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleInput: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    paddingVertical: 8,
    minHeight: 44,
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  descriptionInput: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    minHeight: 100,
    lineHeight: 24,
    textAlignVertical: 'top',
    padding: 10,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
});
