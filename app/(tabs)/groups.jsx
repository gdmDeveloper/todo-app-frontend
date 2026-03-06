import { View, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { api } from '../../services/api';
import { GroupCard } from '../../components/GroupCard';
import ScreenLayout from '../../components/ScreenLayout';
import Button from '../../components/Button';
import colors from '../constants/colors';
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

  const handleCreateGroup = () => {
    router.push('groups/new');
  };

  return (
    <ScreenLayout title={'Mis Grupos'}>
      <View style={styles.container}>
        <Button
          icon={''}
          text={'Crear grupo'}
          onPress={handleCreateGroup}
          color={colors.glowYellow}
        ></Button>
        <Button icon={''} text={'Unirme a un grupo'}></Button>

        <FlatList
          data={groups}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <GroupCard
              group={item}
              onPress={() => router.push(`groups/${item._id}`)}
              onUpdate={() => router.push(`/groups/${item._id}`)}
            ></GroupCard>
          )}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 24,
  },
});

export default Groups;
