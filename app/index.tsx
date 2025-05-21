import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import Contact from "./screen/Contact";
import Document from "./screen/Document";
import Profile from "./screen/Profile";

export default function Navigation() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Contact"
        component={Contact}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Icon name="contacts" size={30} style={{ marginTop: 3 }} />
          ),
          tabBarStyle: {
            backgroundColor: "#f8f8f8",
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            paddingVertical: 2,
            color: "#000",
          },
        }}
      />
      <Tab.Screen
        name="Document"
        component={Document}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Icon name="text-snippet" size={30} style={{ marginTop: 3 }} />
          ),
          tabBarStyle: {
            backgroundColor: "#f8f8f8",
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            paddingVertical: 2,
            color: "#000",
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Icon name="manage-accounts" size={30} style={{ marginTop: 3 }} />
          ),
          tabBarStyle: {
            backgroundColor: "#f8f8f8",
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            paddingVertical: 2,
            color: "#000",
          },
        }}
      />
    </Tab.Navigator>
  );
}
