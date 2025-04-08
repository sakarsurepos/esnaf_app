import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeNavigator from './HomeNavigator';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Geçici placeholder bileşeni
const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
      {route.name} Ekranı (Yapım Aşamasında)
    </Text>
  </View>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'alert-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeNavigator} 
        options={{ 
          title: 'Ana Sayfa',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={PlaceholderScreen}
        options={{ 
          title: 'Arama',
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={PlaceholderScreen}
        options={{ 
          title: 'Randevular',
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={PlaceholderScreen}
        options={{ 
          title: 'Favoriler',
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={PlaceholderScreen}
        options={{ 
          title: 'Hesabım',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 