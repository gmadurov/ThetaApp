import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../../context/Theme";

import React from "react";

function Button({
  children,
  onPressFunction,
}: {
  children: React.ReactNode;
  onPressFunction: Function;
}): JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={(e) => onPressFunction(e)}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.primary5,
    elevation: 2,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: theme.colors.textColorLight,
    fontSize: 16,
    fontWeight: "bold",
  },
});
