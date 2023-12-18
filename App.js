import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, StatusBar } from 'react-native';
import xml2js from 'react-native-xml2js';
import AppBar from './AppBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch XML data
    fetch('https://flathub.org/api/v2/feed/new')
      .then((response) => response.text())
      .then((xmlData) => {
        // Parse XML data
        xml2js.parseString(xmlData, (error, result) => {
          if (error) {
            console.error('Error parsing XML:', error);
          } else {
            // Extract items from the parsed result
            const rssItems = result?.rss?.channel[0]?.item || [];
            setItems(rssItems);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching XML:', error);
      });
  }, []);

  const renderItem = ({ item }) => {
    const title = item.title[0];

    const imgSrcRegex = /<img src="(.*?)"/;
    const imgSrcMatch = item.description[0].match(imgSrcRegex);
    const imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;

    const descriptionRegex = /<p>(.*?)<\/p>/;
    const descriptionMatch = item.description[0].match(descriptionRegex);
    const descriptionText = descriptionMatch ? descriptionMatch[1] : null;

    return (
      <View style={styles.itemContainer}>
        {imgSrc && (
          <View>
            <Image source={{ uri: imgSrc }} style={styles.icon} />
          </View>
        )}
        <View>
          <Text>{title}</Text>
          {descriptionText && <Text>{descriptionText}</Text>}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <AppBar></AppBar>
      <View>
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
      <StatusBar style="auto" />
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row', // Display icon and title in a row
    alignItems: 'center', // Align items vertically in the center
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10, // Add some space between the icon and the title
  },
});
