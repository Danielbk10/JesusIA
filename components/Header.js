import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from '../context/UserContext';
import { COLORS } from '../config/colorConfig';
import { FONTS } from '../config/fontConfig';

export default function Header({ onPressProfile, onPressMenu }) {
  const { user } = useUser();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={onPressMenu}
      >
        <View style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Image 
          source={require('../assets/images/jesus-logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={onPressProfile}
      >
        {user?.photoURL ? (
          <Image 
            source={{ uri: user.photoURL }} 
            style={styles.profileImage} 
          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  menuButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 24,
    height: 2,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 160,
    height: 60,
    marginBottom: 0,
  },
  // Subtítulo removido conforme solicitado
  profileButton: {
    marginLeft: 16,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
  },
  profilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  profilePlaceholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
