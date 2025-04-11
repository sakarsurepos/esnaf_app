import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AddressManagementScreen from '../screens/profile/AddressManagementScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import UserPackagesScreen from '../screens/profile/UserPackagesScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  AddressManagement: undefined;
  EditProfile: undefined;
  UserPackages: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profilim' }}
      />
      <Stack.Screen
        name="AddressManagement"
        component={AddressManagementScreen}
        options={{ title: 'Adreslerim' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Profili Düzenle' }}
      />
      <Stack.Screen
        name="UserPackages"
        component={UserPackagesScreen}
        options={{ title: 'Paketlerim' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator; 