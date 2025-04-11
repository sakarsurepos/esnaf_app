import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppointmentStackParamList } from './types';

import AppointmentListScreen from '../screens/appointment/AppointmentListScreen';
import AppointmentDetailScreen from '../screens/appointment/AppointmentDetailScreen';
import AppointmentScreen from '../screens/appointment/AppointmentScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import ResourceSelectionScreen from '../screens/appointment/ResourceSelectionScreen';

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
        options={{ title: 'İşlemlerim' }}
      />
      <Stack.Screen 
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{ title: 'İşlem Detayı' }}
      />
      <Stack.Screen 
        name="CreateAppointment"
        component={AppointmentScreen}
        options={{ title: 'Randevu Oluştur' }}
      />
      <Stack.Screen 
        name="ResourceSelection"
        component={ResourceSelectionScreen}
        options={{ title: 'Kaynak Seçimi' }}
      />
      <Stack.Screen 
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Ödeme' }}
      />
    </Stack.Navigator>
  );
};

export default AppointmentNavigator; 