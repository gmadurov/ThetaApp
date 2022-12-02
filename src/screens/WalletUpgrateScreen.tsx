// import {
//   Button,
//   Divider,
//   RadioButton,
//   TextInput,
//   TouchableRipple,
// } from "react-native-paper";
// import React, { useContext, useEffect, useState } from "react";
// import { ScrollView, StyleSheet, Text, View } from "react-native";

// import ApiContext from "../context/ApiContext";
// import FullContext from "../context/FullContext";
// import TokenInfo from "../models/Users";
// import { showMessage } from "react-native-flash-message";

// export enum Refund {
//   refund = "true",
//   notRefunc = "false",
// }
// export type WalletUpgrade = {
//   refund?: Refund;
//   seller?: TokenInfo;
//   amount?: number;
//   password?: string;
// };
// const WalletUpgrateScreen = () => {
//   const { ApiRequest } = useContext(ApiContext);
//   const [wallet, setWallet] = useState<WalletUpgrade>({
//     seller: {} as TokenInfo,
//     refund: Refund.notRefunc,
//     amount: 0,
//     password: "",
//   } as WalletUpgrade);

//   async function SubmitWalletUpgrade() {
//     // console.log(wallet);

//     let { res } = await ApiRequest<WalletUpgrade>("/api/walletupgrade/", {
//       method: "POST",
//       body: JSON.stringify(wallet),
//     });
//     if (res?.status === 201 || res?.status === 200) {
//       showMessage({
//         message: `Wallet Upgrade was successful`,
//         description: ``,
//         type: "success",
//         floating: true,
//         hideStatusBar: true,
//         autoHide: true,
//         duration: 2500,
//         position: "bottom",
//       });
//       setWallet({
//         refund: Refund.notRefunc,
//         amount: 0,
//         password: "",
//       } as WalletUpgrade);
//     } else if (res?.status === 501) {
//       showMessage({
//         message: `Failed to authenticate the seller`,
//         description: `The seller and password combination is not correct`,
//         type: "danger",
//         floating: true,
//         hideStatusBar: true,
//         autoHide: true,
//         duration: 4500,
//         position: "bottom",
//       });
//     } else {
//       showMessage({
//         message: `Wallet Upgrade was Unsuccessful`,
//         description: ``,
//         type: "danger",
//         floating: true,
//         hideStatusBar: true,
//         autoHide: true,
//         duration: 1500,
//         position: "bottom",
//       });
//     }
//   }

//   return (
//     <>
//       <ScrollView>
//         <TouchableRipple
//           onPress={() => setWallet({ ...wallet, refund: Refund.refund })}
//         >
//           <View style={styles.row}>
//             <Text>Refund</Text>
//             <RadioButton
//               value="first"
//               status={wallet.refund === Refund.refund ? "checked" : "unchecked"}
//               onPress={() => setWallet({ ...wallet, refund: Refund.refund })}
//             />
//           </View>
//         </TouchableRipple>
//         <Divider />
//         <TouchableRipple
//           onPress={() => setWallet({ ...wallet, refund: Refund.notRefunc })}
//         >
//           <View style={styles.row}>
//             <Text>Wallet Upgrade</Text>
//             <RadioButton
//               value="second"
//               status={
//                 wallet.refund === Refund.notRefunc ? "checked" : "unchecked"
//               }
//               onPress={() => setWallet({ ...wallet, refund: Refund.notRefunc })}
//             />
//           </View>
//         </TouchableRipple>
//         <TextInput
//           label="Hoeveelheid"
//           value={wallet.amount ? wallet.amount.toString() : ""}
//           keyboardType="numeric"
//           onChangeText={(text) =>
//             setWallet({ ...wallet, amount: Number(text) })
//           }
//         />
//         <TextInput
//           label="Tapper Wachtwoord"
//           secureTextEntry
//           value={wallet.password ? wallet.password : ""}
//           onChangeText={(text) => setWallet({ ...wallet, password: text })}
//         />
//         {/* TODO: add comment if it is a refund */}

//         <Button
//           disabled={
//             [undefined, null, "" as Refund].includes(wallet.refund) ||
//             [undefined, null, NaN].includes(wallet.amount) ||
//             [undefined, null, ""].includes(wallet.password) ||
//             [undefined, {} as TokenInfo].includes(wallet.seller) 
//               ? true
//               : false
//           }
//           onPress={SubmitWalletUpgrade}
//         >
//           Submit
//         </Button>
//       </ScrollView>
//     </>
//   );
// };

// export default WalletUpgrateScreen;

// const styles = StyleSheet.create({
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
// });
