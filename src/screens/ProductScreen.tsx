import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useState } from "react";

import BottomSearch from "../components/Cart/BottomSearch";
import Cart from "../components/Cart/Cart";
import CartContext from "../context/CartContext";
import { GlobalStyles } from "../constants/styles";
import Holder from "../models/Holder";
import HolderContext from "../context/HolderContext";
import PersonelView from "../components/Cart/PersonelView";
import ProductContext from "../context/ProductContext";
import ProductTile from "../components/Product/ProductTile";
import SettingsContext from "../context/SettingsContext";
import TokenInfo from "../models/Users";

const { width } = Dimensions.get("screen");

const ProductScreen = ({ sell }: { sell?: boolean }) => {
  const { GET, selectedProducts } = useContext(ProductContext);
  const { GET: GET_HOLDER } = useContext(HolderContext);
  const { GET_categories, sideBySide } = useContext(SettingsContext);
  const { setBuyer, setSeller } = useContext(CartContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(0);
  function renderProducts(itemData: { item: any }) {
    return (
      <ProductTile
        product={itemData.item}
        selected={selected}
        setSelected={setSelected}
      />
    );
  }
  async function getProducts() {
    setRefreshing(true);
    await GET();
    await GET_HOLDER();
    await GET_categories();
    setBuyer({} as Holder);
    setSeller({} as TokenInfo);
    setRefreshing(false);
  }
  return (
    <>
      <View
        style={[
          { flex: 1 },
          sideBySide && {
            paddingBottom: 50,
            flexDirection: "row-reverse",
          },
        ]}
      >
        <View style={styles.cartView}>
          <View style={{ flex: 3 }}>
            <Cart sell={sell ? true : false} />
          </View>
          <View style={{ flex: 1 }}>
            <PersonelView />
          </View>
        </View>
        <View style={styles.productView}>
          <Text style={styles.text}>Producten</Text>
          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.id.toString() as string}
            renderItem={renderProducts}
            numColumns={Math.floor(width / 196)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => getProducts()}
              />
            }
          />
        </View>
      </View>
      <BottomSearch placeholder="Kies Lid Hier" />
    </>
  );
};
export default ProductScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: GlobalStyles.colors.textColorDark,
    textAlign: "right",
  },
  cartView: { flex: 1 },
  productView: { flex: 2 },
});
