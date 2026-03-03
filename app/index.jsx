import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const index = () => {
  return (
    <View>
      <TouchableOpacity onPress={() => router.push('login')}>
        <Text style={{ marginTop: 50 }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;
