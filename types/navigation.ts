import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyOTP: {
    phone: string;
    mode: 'login' | 'register';
    name?: string;
  };
  ForgotAccess: undefined;
};

export type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export type VerifyOTPScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerifyOTP'>;
  route: RouteProp<AuthStackParamList, 'VerifyOTP'>;
};

export type ForgotAccessScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotAccess'>;
};
