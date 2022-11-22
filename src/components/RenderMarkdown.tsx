import * as React from "react";

import { Image, StyleSheet, Text, View } from "react-native";

/**
 * @param children the text that will be rendered as markdown
 * @returns Bootleg self coded markdown
 */
export default function RenderMarkdown({ children }: { children: string }) {
  // render markdown in react native components
  function GetMarkdownComponents({ i, child }: { i: number; child: string }) {
    let bolds = child.match(/\*\*(.*?)\*\*/g) || [];
    // let underlines = child.match(/\_(.*?)\_/g) || [];
    // extract all links in the following format from string [link name](link url)
    const links = child.match(/\[(.*?)\]\((.*?)\)/g) || [];
    //q: how to join to lists in js
    // extract all images in the following format from string ![alt text](image url)
    const images = [
      child.match(/!\[(.*?)\]\((.*?)\)/g)?.map((image) => {
        return {
          fulltext: image,
          text: image.split("](")[0].split("![")[1],
          src: image.split("](")[1].split(")")[0],
        };
      }) || [],
      child
        .match(/https:\/\/i.imgur.com\/(.*?)\.(jpg|png|gif)/g)
        ?.map((image) => {
          return {
            fulltext: image,
            text: image,
            src: image,
          };
        }) || [],
    ].flat();
    let italics = [...images.map((image) => image.fulltext), ...links].includes(
      child
    )
      ? []
      : child.match(/\*(.*?)\*/g) || [];

    // extract all headers in the following format from string #... or ##... or ###... or ####... or #####...
    const header = child.match(/^(#{1,6})\s(.*)/gm) || [];
    // extract all blockquotes in the following format from string >... or >>... or >>>...
    const blockQuote = child.match(/^(>)\s(.*)/gm) || [];
    // extract all code in the following format from string ```...``` or ```... or ...```

    const renderText = (text: string) => {
      return (
        <Text key={`markdownText: ${i}` + text} style={styles.text}>
          {text}
        </Text>
      );
    };

    const renderBold = (text: string) => {
      return (
        <Text key={`markdownBold: ${i}` + text} style={styles.bold}>
          {text}
        </Text>
      );
    };

    const renderItalic = (text: string) => {
      return (
        <Text key={`markdownItalic: ${i}` + text} style={styles.italic}>
          {text}
        </Text>
      );
    };

    const renderHeading = (text: string, level: number) => {
      switch (level) {
        case 1:
          return (
            <Text key={`markdownHeader1: ${i}` + text} style={styles.h1}>
              {text}
            </Text>
          );
        case 2:
          return (
            <Text key={`markdownHeader2: ${i}` + text} style={styles.h2}>
              {text}
            </Text>
          );
        case 3:
          return (
            <Text key={`markdownHeader3: ${i}` + text} style={styles.h3}>
              {text}
            </Text>
          );
        case 4:
          return (
            <Text key={`markdownHeader4: ${i}` + text} style={styles.h4}>
              {text}
            </Text>
          );
        case 5:
          return (
            <Text key={`markdownHeader5: ${i}` + text} style={styles.h5}>
              {text}
            </Text>
          );
        case 6:
          return (
            <Text key={`markdownHeader6: ${i}` + text} style={styles.h6}>
              {text}
            </Text>
          );
      }
      return (
        <Text key={`markdownHeader7: ${i}` + text} style={styles.text}>
          {text}
        </Text>
      );
    };

    const renderQuote = (text: string) => {
      return (
        <Text key={`markdownQuote: ${i}` + text} style={styles.quote}>
          {text}
        </Text>
      );
    };

    const renderImage = (text: string, src: string) => {
      return (
        <Image
          key={`markdownImage: ${i}` + text}
          style={styles.image}
          source={{ uri: src }}
        />
      );
    };

    return (
      <>
        {images !== undefined
          ? images?.map((image, i) => renderImage(image.text, image.src))
          : null}
        {header !== undefined
          ? header?.map((h, i) =>
              renderHeading(
                h.replace(/^(#{1,6}) /gm, ""),
                h.length - h.replace(/^(#{1,6}) /gm, "").length - 1
              )
            )
          : null}
        {blockQuote !== undefined && (
          <View style={styles.blockQuote} key={`afeas: ${i}`}>
            {blockQuote?.map((bq: string, i) =>
              renderQuote(bq.replace(/^(>) /gm, ""))
            )}
          </View>
        )}
        {bolds
          ? bolds?.map((b, i) => renderBold(b.replace(/\*\*/gm, "")))
          : null}
        {italics !== undefined
          ? italics?.map((i, index) => renderItalic(i.replace(/\*/gm, "")))
          : null}
        {![
          ...bolds,
          ...italics,
          ...header,
          ...blockQuote,
          ...images.map((image) => image.fulltext),
        ].includes(child) && renderText(child)}
      </>
    );
  }
  // TODO: lists
  return (
    <>
      {children.split("\n").map((child, i) => {
        return (
          <GetMarkdownComponents key={"GetMardown: " + i} i={i} child={child} />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  bold: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  italic: {
    fontSize: 16,
    color: "#000",
    fontStyle: "italic",
  },
  strike: {
    fontSize: 16,
    color: "#000",
    textDecorationLine: "line-through",
  },
  h1: {
    fontSize: 36,
    color: "#000",
    fontWeight: "bold",
  },
  h2: {
    fontSize: 32,
    color: "#000",
    fontWeight: "bold",
  },
  h3: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  h4: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  h5: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  h6: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  blockQuote: {},
  link: {
    fontSize: 16,
    color: "#000",
  },
  list: {
    fontSize: 16,
    color: "#000",
  },
  listItem: {
    fontSize: 16,
    color: "#000",
  },
  quote: {
    fontSize: 16,
    color: "#000",
  },
  code: {
    fontSize: 16,
    color: "#000",
  },
  codeBlock: {
    fontSize: 16,
    color: "#000",
  },
  image: {
    width: 200,
    height: 200,
  },
  table: {
    fontSize: 16,
    color: "#000",
  },
  tableRow: {
    fontSize: 16,
    color: "#000",
  },
  tableHeader: {
    fontSize: 16,
    color: "#000",
  },
  tableCell: {
    fontSize: 16,
    color: "#000",
  },
});
"add-outline"||"star-half"||"star"||"star-half"||"trophy"||"medal"