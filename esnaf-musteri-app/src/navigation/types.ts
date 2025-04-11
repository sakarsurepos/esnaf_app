import { NavigatorScreenParams } from '@react-navigation/native';
import { ResourceType } from "../models/resources";

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
  Appointment: undefined;
  CreateAppointment: { serviceId?: string; businessId?: string };
  AppointmentList: undefined;
  AppointmentDetail: { appointmentId: string };
  AppointmentSummary: any;
  ResourceSelection: {
    businessId: string;
    resourceType: ResourceType;
    startTime: string;
    endTime?: string;
    serviceId: string;
    appointmentParams: any;
    multiSelect?: boolean;
  };
  Payment: {
    serviceName: string;
    serviceId: string;
    businessId: string;
    businessName: string;
    branchId?: string;
    staffId: string;
    staffName: string;
    appointmentTime: string;
    locationType: 'business' | 'address';
    address?: string;
    customerNote?: string;
    totalPrice: number;
    depositAmount: number;
    isFullPayment: boolean;
  };
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

export type CampaignStackParamList = {
  Campaigns: undefined;
  CampaignDetail: { campaignId: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Search: NavigatorScreenParams<ServiceDiscoveryStackParamList>;
  Transactions: NavigatorScreenParams<AppointmentStackParamList>;
  Favorites: undefined;
  Account: NavigatorScreenParams<ProfileStackParamList>;
  Campaigns: NavigatorScreenParams<CampaignStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  OnBoarding: undefined;
}; 