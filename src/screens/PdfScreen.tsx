import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import Pdf from "react-native-pdf";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthenticatedStackParamsList } from "../navigation/AuthenticatedStack";
import { WebView } from "react-native-webview";
import { Appbar } from "react-native-paper";

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
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
            />
          )}
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
