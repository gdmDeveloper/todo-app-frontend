import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';
import GroupCard from '../../components/GroupCard';

const Groups = () => {
  const [groups, setGroups] = useState([]);

  useFocusEffect(
    useCallback(() => {
      // ! TODO como funciona esto

      const fetchGroups = async () => {
        const data = await api.get('groups');
        setGroups(data.groups);
      };
      fetchGroups();
    }, []),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={() => router.push(`/groups/${item._id}`)}></GroupCard>
        )}
      />
      <View style={styles.botones}>
        <TouchableOpacity onPress={() => router.push('/groups/new')} style={styles.boton}>
          <Text>Crear grupo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/groups/join')} style={styles.boton}>
          <Text>Unirse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  form: {
    flex: 1,
    justifyContent: 'center', // centra verticalmente el formulario
    alignItems: 'center',
    gap: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  input: {
    padding: 10,
    border: '1px solid grey',
    borderRadius: 10,
  },
});

export default Groups;
