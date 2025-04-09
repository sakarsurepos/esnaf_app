import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppointmentStackParamList } from './types';

import AppointmentListScreen from '../screens/appointment/AppointmentListScreen';
import AppointmentDetailScreen from '../screens/appointment/AppointmentDetailScreen';
import AppointmentScreen from '../screens/appointment/AppointmentScreen';

const Stack = createNativeStackNavigator<AppointmentStackParamList>();

const AppointmentNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="AppointmentList"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="AppointmentList"
        component={AppointmentListScreen}
        options={{ title: 'Randevularım' }}
      />
      <Stack.Screen 
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{ title: 'Randevu Detayı' }}
      />
      <Stack.Screen 
        name="CreateAppointment"
        component={AppointmentScreen}
        options={{ title: 'Randevu Oluştur' }}
      />
    </Stack.Navigator>
  );
};

export default AppointmentNavigator; 