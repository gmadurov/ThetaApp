import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import ApiContext from "../context/ApiContext";
import { useContext } from "react";

const WalletUpgrade = () => {
  const { ApiRequest } = useContext(ApiContext);
  const [amount, setAmount] = useState(0.0);
  const redirect = async () => {
    const response = await ApiRequest("wallet/upgrade", {
      method: "GET",
      body: {},
    });
    console.log(response);
  };
  return (
    // make a form that sends a request to the api to upgrade the wallet
    // the amount is the amount of money the user wants to add to his wallet
    <View style={styles.container}>
      <Text>WalletUpgrade</Text>
      <input
        type="number"
        name="amount"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      <button onClick={redirect}>send</button>
    </View>
  );
};

export default WalletUpgrade;

const styles = StyleSheet.create({ container: {} });
