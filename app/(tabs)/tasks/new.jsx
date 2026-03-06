// app/tasks/new.jsx
import { useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import TaskForm from '../../../components/TaskForm';
import { api } from '../../../services/api';

export default function NewTask() {
  const [saving, setSaving] = useState(false);
  const { groupId } = useLocalSearchParams();

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (groupId) {
        await api.post(`groups/${groupId}/tasks`, values);
        router.replace(`/groups/${groupId}`);
      } else {
        await api.post('tasks', values);
        router.back();
      }
    } catch {
      Alert.alert('Error', 'No se pudo crear la tarea');
    } finally {
      setSaving(false);
    }
  };

  return (
    <TaskForm key={Date.now()} onSave={handleSave} saving={saving} headerTitle={'Nueva tarea'} />
  );
}
