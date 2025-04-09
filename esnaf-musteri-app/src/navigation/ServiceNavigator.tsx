import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServiceDiscoveryStackParamList } from './types';

// Hizmet keşfi ekranlarını import ediyoruz
import CategoryScreen from '../screens/service/CategoryScreen';
import ServiceListScreen from '../screens/service/ServiceListScreen';
import ServiceDetailScreen from '../screens/service/ServiceDetailScreen';

// Geçici placeholder bileşeni (SearchResults için)
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

const Stack = createNativeStackNavigator<ServiceDiscoveryStackParamList>();

const ServiceNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Category"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ title: 'Kategoriler' }}
      />
      <Stack.Screen
        name="ServiceList"
        component={ServiceListScreen}
        options={({ route }) => ({ title: route.params.categoryName })}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: 'Hizmet Detayı' }}
      />
      <Stack.Screen
        name="SearchResults"
        component={PlaceholderScreen}
        options={{ title: 'Arama Sonuçları' }}
      />
    </Stack.Navigator>
  );
};

export default ServiceNavigator; 