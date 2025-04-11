import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileNavigator';
import ServiceNavigator from './ServiceNavigator';
import AppointmentNavigator from './AppointmentNavigator';
import CampaignNavigator from './CampaignNavigator';
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

// İşlemler (Transactions) için geçici ekran (Randevular ve satın alınan hizmetleri birleştirecek)
const TransactionsScreen = () => (
  <View style={{ flex: 1 }}>
    {/* Bu ekran, AppointmentNavigator.tsx içinde tam olarak geliştirilebilir */}
    <AppointmentNavigator />
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
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Campaigns') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
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
        component={ServiceNavigator}
        options={{ 
          title: 'Keşfet',
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={AppointmentNavigator}
        options={{ 
          title: 'İşlemler',
        }}
      />
      <Tab.Screen 
        name="Campaigns" 
        component={CampaignNavigator}
        options={{ 
          title: 'Kampanyalar',
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
        component={ProfileNavigator}
        options={{ 
          title: 'Hesabım',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 