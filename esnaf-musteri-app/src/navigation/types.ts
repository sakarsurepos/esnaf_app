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
  Search: undefined;
  BusinessDetails: { businessId: string };
  ServiceDetails: { serviceId: string };
  Appointment: { serviceId: string };
  Profile: undefined;
  EditProfile: undefined;
  AddressManagement: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type ServiceDiscoveryStackParamList = {
  Category: undefined;
  ServiceList: { categoryId: string; categoryName: string };
  ServiceDetail: { serviceId: string };
  SearchResults: { query: string };
};

export type AppointmentStackParamList = {
  AppointmentList: undefined;
  AppointmentDetail: { appointmentId: string };
  CreateAppointment: { serviceId?: string; businessId?: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  AddressManagement: undefined;
  Settings: undefined;
  TestDev: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  WriteReview: { orderId: string; businessName: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Search: NavigatorScreenParams<ServiceDiscoveryStackParamList>;
  Appointments: NavigatorScreenParams<AppointmentStackParamList>;
  Favorites: undefined;
  Account: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  OnBoarding: undefined;
}; 