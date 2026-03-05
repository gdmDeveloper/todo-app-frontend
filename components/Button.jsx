import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

export default function CustomButton({
  text,
  onPress,
  color = '#4A90E2',
  disabled = false,
  loading = false,
  outline = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        outline ? styles.outlineButton : { backgroundColor: disabled ? '#ccc' : color },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? color : '#fff'} />
      ) : (
        <Text style={[styles.text, outline && { color }, disabled && { color: '#888' }]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    elevation: 4,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#9B59B6',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter_400Regular',
  },
});
