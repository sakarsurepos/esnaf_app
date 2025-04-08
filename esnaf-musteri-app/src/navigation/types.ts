import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
  ResetPassword: { token: string };
};

export type HomeStackParamList = {
  Home: undefined;
  BusinessDetails: { businessId: string };
  ServiceDetails: { serviceId: string };
  Appointment: { serviceId: string };
  Profile: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Appointments: undefined;
  Favorites: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  OnBoarding: undefined;
}; 