import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CampaignStackParamList } from './types';
import CampaignsScreen from '../screens/campaign/CampaignsScreen';
import CampaignDetailScreen from '../screens/campaign/CampaignDetailScreen';

const Stack = createStackNavigator<CampaignStackParamList>();

const CampaignNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Campaigns"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Campaigns" component={CampaignsScreen} />
      <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
    </Stack.Navigator>
  );
};

export default CampaignNavigator; 