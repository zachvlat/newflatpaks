import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { XMLParser } from 'fast-xml-parser';

export default function Flatlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch('https://flathub.org/api/v2/feed/new');
        const xmlData = await response.text();

        // Parse XML safely
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '',
          textNodeName: 'text',
        });

        const result = parser.parse(xmlData);
        const rssItems = result?.rss?.channel?.item || [];
        setItems(Array.isArray(rssItems) ? rssItems : [rssItems]);
      } catch (error) {
        console.error('Error fetching or parsing XML:', error);
      }
    };

    fetchFeed();
  }, []);

  const openAppUrl = (appUrl) => {
    if (appUrl) {
      console.log('Opening app URL:', appUrl);
      Linking.openURL(appUrl).catch((err) => console.error('Error opening URL:', err));
    }
  };

  const renderItem = ({ item }) => {
    const title = item.title;
    const description = item.description || '';

    // Extract image and description text
    const imgSrcMatch = description.match(/<img src="(.*?)"/);
    const imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;

    const descriptionMatch = description.match(/<p>(.*?)<\/p>/);
    const descriptionText = descriptionMatch ? descriptionMatch[1] : '';

    const appUrl = item.link;

    return (
      <TouchableOpacity onPress={() => openAppUrl(appUrl)} style={styles.itemContainer}>
        {imgSrc && <Image source={{ uri: imgSrc }} style={styles.icon} />}
        <View style={styles.textContainer}>
          <Text style={styles.titleText} variant="titleLarge">{title}</Text>
          {descriptionText ? (
            <Text style={styles.descriptionText} variant="bodySmall" numberOfLines={2}>
              {descriptionText}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <View>
        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          numColumns={2} // 👈 two columns
          columnWrapperStyle={styles.row} // 👈 style for spacing between columns
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    backgroundColor: '#3d3846',
    flex: 1,
    margin: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 10,
    borderRadius: 10,
  },
  titleText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textContainer: {
    flex: 1,
  },
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
});
