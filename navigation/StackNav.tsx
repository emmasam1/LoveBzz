import React from "react";
import EnterGeneratedCode from '@/screens/EnterGeneratedCode ';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EnterGeneratedCode" component={EnterGeneratedCode} />
      {/* Add other screens here */}
    </Stack.Navigator>
  );
};

export default StackNav;
