import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import { Car } from '../services/api';

interface CarCardProps {
  car: Car;
  onPress: () => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onPress }) => {
  const transmissionColor =
    car.carType === 'automatic' ? '#F5E7D0' : '#D6F9DB';
  const transmissionText =
    car.carType === 'automatic' ? 'Automatic' : 'Manual';
    const transmissionTextColor =
    car.carType === 'automatic' ? '#997C4C' : '#10A024';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: car.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View
          style={[styles.transmissionTag, { backgroundColor: transmissionColor }]}>
          <Text style={[styles.transmissionText,{color:transmissionTextColor}]}>{transmissionText}</Text>
        </View>
        <Text style={styles.carName}>{car.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
   
  },
  imageContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
    backgroundColor: '#F5F5F5',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  transmissionTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  transmissionText: {
    color: '#997C4C',
    fontSize: 11,
    fontWeight: '600',
  },
  carName: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

