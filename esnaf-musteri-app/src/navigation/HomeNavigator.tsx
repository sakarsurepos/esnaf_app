import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

// Ekranları import ediyoruz
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import BusinessDetailsScreen from '../screens/business/BusinessDetailsScreen';
// import ServiceDetailsScreen from '../screens/service/ServiceDetailsScreen';
// import AppointmentScreen from '../screens/appointment/AppointmentScreen';
// import ProfileScreen from '../screens/profile/ProfileScreen';
// import EditProfileScreen from '../screens/profile/EditProfileScreen';
// import NotificationsScreen from '../screens/notifications/NotificationsScreen';
// import SettingsScreen from '../screens/settings/SettingsScreen';

// Geçici placeholder bileşeni
import { View, Text } from 'react-native';

const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
      {route.name} Ekranı (Yapım Aşamasında)
    </Text>
    {route.params && (
      <Text style={{ marginTop: 10 }}>
        Parametreler: {JSON.stringify(route.params)}
      </Text>
    )}
  </View>
);

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="Home"
        component={HomeScreen}
        options={{ title: 'Ana Sayfa' }}
      />
      <Stack.Screen 
        name="Search"
        component={SearchScreen}
        options={{ 
          title: 'Arama',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="BusinessDetails"
        component={BusinessDetailsScreen}
        options={{ 
          title: 'İşletme Detayları',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="ServiceDetails"
        component={PlaceholderScreen}
        options={{ title: 'Hizmet Detayları' }}
      />
      <Stack.Screen 
        name="Appointment"
        component={PlaceholderScreen}
        options={{ title: 'Randevu Al' }}
      />
      <Stack.Screen 
        name="Profile"
        component={PlaceholderScreen}
        options={{ title: 'Profil' }}
      />
      <Stack.Screen 
        name="EditProfile"
        component={PlaceholderScreen}
        options={{ title: 'Profil Düzenle' }}
      />
      <Stack.Screen 
        name="Notifications"
        component={PlaceholderScreen}
        options={{ title: 'Bildirimler' }}
      />
      <Stack.Screen 
        name="Settings"
        component={PlaceholderScreen}
        options={{ title: 'Ayarlar' }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator; 