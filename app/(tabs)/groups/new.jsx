import { useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../../services/api';
import GroupForm from '../../../components/GroupForm';
import { uploadImage } from '../../../services/uploadImage';

export default function NewGroup() {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUploading(true);
      const url = await uploadImage(result.assets[0]);
      setCoverImage(url);
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    await api.post('groups', {
      name: title,
      description,
      coverImage,
    });
    setSaving(false);
    router.back();
  };

  return (
    <GroupForm
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      coverImage={coverImage}
      pickImage={pickImage}
      uploading={uploading}
      saving={saving}
      onSave={handleSave}
      headerTitle="Nuevo grupo"
      onBack={() => router.back()}
    />
  );
}
