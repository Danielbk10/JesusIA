import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      onComplete();
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error);
      onComplete(); // Continue mesmo com erro
    }
  };

  const renderPage1 = () => (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/onboarding1.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.indicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPage2 = () => (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/onboarding2.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.indicators}>
            <View style={styles.indicator} />
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPage3 = () => (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/onboarding3.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.indicators}>
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={[styles.indicator, styles.activeIndicator]} />
          </View>
          <TouchableOpacity style={styles.startButton} onPress={handleComplete}>
            <Text style={styles.startButtonText}>Começar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const pages = [renderPage1, renderPage2, renderPage3];

  return pages[currentPage]();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.6,
    maxWidth: 400,
    maxHeight: 500,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  indicators: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#666666',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#D4B896',
  },
  nextButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D4B896',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#D4B896',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#D4B896',
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  startButtonText: {
    color: '#2C2C2C',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
