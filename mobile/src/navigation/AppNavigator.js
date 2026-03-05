import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import VerifyScreen from '../screens/VerifyScreen';
import GuestChatScreen from '../screens/GuestChatScreen';
import ResultsScreen from '../screens/ResultsScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import PaymentScreen from '../screens/PaymentScreen';
import HostDashboardScreen from '../screens/HostDashboardScreen';
import CreateListingScreen from '../screens/CreateListingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="CreateListing" component={CreateListingScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="GuestChat" component={GuestChatScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="HostDashboard" component={HostDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
