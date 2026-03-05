// app/index.jsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const MIN_DURATION = 2000;

const Index = () => {
  const { token, isLoading } = useAuth();
  const startTime = useRef(Date.now());
  const redirected = useRef(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animación entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  // Barra de progreso que se llena en MIN_DURATION
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: MIN_DURATION,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, []);

  // Redirección
  useEffect(() => {
    if (isLoading || redirected.current) return;
    redirected.current = true;
    const elapsed = Date.now() - startTime.current;
    const remaining = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(() => {
      router.replace(token ? '/(tabs)/tasks' : '/login');
    }, remaining);
  }, [isLoading]);

  return (
    <ImageBackground
      source={require('../img/hero.png')}
      style={styles.background}
      resizeMode="contain"
      imageStyle={{ backgroundColor: '#1D1C21' }}
    >
      {/* Contenido centrado */}
      <Animated.View
        style={[
          styles.heroContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      />

      {/* Barra de carga abajo */}
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
        <Text style={styles.statusText}>{status}</Text>
        <View style={styles.barBackground}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D1C21',
  },
  heroContainer: {
    flex: 1,
  },
  bottomContainer: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 60,
    gap: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Mulish_500Medium',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  barBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default Index;
