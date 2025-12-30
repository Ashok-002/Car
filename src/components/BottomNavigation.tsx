import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type BottomNavigationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;

export const BottomNavigation: React.FC = () => {
  const navigation = useNavigation<BottomNavigationNavigationProp>();
  const route = useRoute();

  const getActiveTab = () => {
    const routeName = route.name;
    if (routeName === 'Home') return 'home';
    if (routeName === 'CarLibrary') return 'library';
    if (routeName === 'Services') return 'services';
    if (routeName === 'Profile') return 'profile';
    return 'library';
  };

  const activeTab = getActiveTab();

  const handleTabPress = (tabId: string) => {
    switch (tabId) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'library':
        navigation.navigate('CarLibrary');
        break;
      case 'services':
        navigation.navigate('Services');
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
    }
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: require('../Assest/home.png'), screenName: 'Home' },
    { id: 'library', label: 'Car Library', icon: require('../Assest/Car_Auto.png'), screenName: 'CarLibrary' },
    { id: 'services', label: 'Services', icon: require('../Assest/Group.png'), screenName: 'Services' },
    { id: 'profile', label: 'Profile', icon: require('../Assest/Group.png'), screenName: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}>
            <Image
              source={tab.icon}
              style={[
                styles.icon,
                { tintColor: isActive ? '#A855F7' : '#FFFFFF' },
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#A855F7',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
});

