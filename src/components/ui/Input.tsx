import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { theme } from "../../context/Theme";

import React from "react";

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}: {
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  secure?: boolean;
  onUpdateValue: Function;
  value?: string | undefined;
  isInvalid?: boolean;
}): JSX.Element {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize={"none"}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={(e) => onUpdateValue(e)}
        value={value}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: theme.colors.textColorLight,
    marginBottom: 4,
  },
  labelInvalid: {
    color: theme.colors.errorMessage,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: theme.colors.primary1,
    borderRadius: 4,
    fontSize: 16,
  },
  inputInvalid: {
    backgroundColor: theme.colors.errorMessage,
  },
});
