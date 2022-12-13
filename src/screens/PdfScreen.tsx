import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Appbar } from "react-native-paper";
import { AuthenticatedStackParamsList } from "../navigation/AuthenticatedStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";

const PdfReader = ({ uri }: { uri: string }) => (
  <WebView javaScriptEnabled={true} style={{ flex: 1 }} source={{ uri }} />
);
type Props = NativeStackScreenProps<AuthenticatedStackParamsList, "PdfScreen">;
function PdfScreen({ route, navigation }: Props) {
  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ navigation }) => (
        <Appbar.Header style={{ backgroundColor: "white" }}>
          {navigation.canGoBack() && (
            // @ts-ignore
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
            />
          )}
          {/* @ts-ignore */}
          <Appbar.Content title={route.params.type.toLocaleUpperCase()} />
        </Appbar.Header>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.container}>
      <PdfReader uri={route.params.uri} />
    </View>
  );
}

export default PdfScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
