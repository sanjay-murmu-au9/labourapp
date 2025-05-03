import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import PhoneLoginScreen from '../screens/PhoneLoginScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import UserNameScreen from '../screens/UserNameScreen';
import OccupationScreen from '../screens/OccupationScreen';
import { LocationScreen } from '../screens/LocationScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import JobsScreen from '../screens/JobsScreen';
import { JobsProviderScreen } from '../screens/JobsProviderScreen';
import { RootStackParamList, UserProfile } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  initialUser: UserProfile | null;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ initialUser }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialUser ? "Jobs" : "PhoneLogin"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#128C7E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="PhoneLogin"
          component={PhoneLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserName"
          component={UserNameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Occupation"
          component={OccupationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Jobs"
          component={JobsScreen}
          options={{ headerShown: false }}
          initialParams={initialUser ? { userProfile: initialUser } : undefined}
        />
        <Stack.Screen
          name="JobsProvider"
          component={JobsProviderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={{
            title: 'LabourApp',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserDetails"
          component={UserDetailsScreen}
          options={{
            headerShown: true,
            title: 'Profile',
            headerTintColor: '#fff'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};