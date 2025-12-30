import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CarLibraryScreen } from '../screens/CarLibraryScreen';
import { CarDetailScreen } from '../screens/CarDetailScreen';
import { AddCarScreen } from '../screens/AddCarScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CarLibrary"
      screenOptions={{
        headerShown: false,
        // animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CarLibrary" component={CarLibraryScreen} />
      <Stack.Screen
        name="CarDetail"
        component={CarDetailScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AddCar"
        component={AddCarScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen name="Services" component={ServicesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

