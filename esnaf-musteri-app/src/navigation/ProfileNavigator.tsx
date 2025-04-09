import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from './types';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import AddressManagementScreen from '../screens/profile/AddressManagementScreen';
import OrderHistoryScreen from '../screens/order/OrderHistoryScreen';
import OrderDetailScreen from '../screens/order/OrderDetailScreen';
import WriteReviewScreen from '../screens/reviews/WriteReviewScreen';
import { COLORS } from '../constants';
import { View, Text } from 'react-native';

// Geçici placeholder bileşenler için
const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
      {route.name} Ekranı (Yapım Aşamasında)
    </Text>
  </View>
);

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          borderBottomWidth: 1,
          borderBottomColor: '#f2f2f2',
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profilim',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Profili Düzenle',
        }}
      />
      <Stack.Screen
        name="AddressManagement"
        component={AddressManagementScreen}
        options={{
          title: 'Adreslerim',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={PlaceholderScreen}
        options={{
          title: 'Ayarlar',
        }}
      />
      <Stack.Screen
        name="TestDev"
        component={PlaceholderScreen}
        options={{
          title: 'Geliştirici Test',
        }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          title: 'Sipariş Geçmişim',
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          title: 'Sipariş Detayı',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{
          title: 'Değerlendirme Yaz',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator; 