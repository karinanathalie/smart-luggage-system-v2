import * as React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/Home';
import SignIn from './components/SignIn';
import HomePage from './components/HomePage';
import fillDataBaggage from './components/fillDataBaggage';
import profile from './components/profile';
const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator 
          screenOptions={{
          animation: 'none',
        }}>
        <Stack.Screen 
        name="Home" 
        component={Home} 
        options = {{
          headerShown: false
        }}
        />        
        <Stack.Screen 
        name="SignIn" 
        component={SignIn} 
        options = {{
          headerShown: false,
        }}
          />
        <Stack.Screen 
        name="HomePage" 
        component={HomePage} 
        options = {{
          headerShown: false,
        }}
          />
        <Stack.Screen 
        name="fillDataBaggage" 
        component={fillDataBaggage} 
        options = {{
          headerShown: false,
        }}
        />
        <Stack.Screen 
        name="profile" 
        component={profile} 
        options = {{
          headerShown: false,
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
