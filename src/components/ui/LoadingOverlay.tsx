import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import React from "react";
import { Button } from "react-native-paper";

function LoadingOverlay({
  message,
  show,
  onCancel,
}: {
  message: string;
  show: boolean;
  onCancel: Function;
}) {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" />
      <Button
        // style={({ pressed }: { pressed: boolean }) => [
        //   styles.button,
        //   pressed && {
        //     opacity: 0.7,
        //   },
        // ]}
        onPress={() => {
          onCancel(!show);
        }}
      >
        Cancel
      </Button>
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  // buttonText: {
  //   textAlign: "center",
  //   color: theme.colors.primary1,
  //   backgroundColor: theme.colors.primary5,
  // },
});
