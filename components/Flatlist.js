import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import xml2js from 'react-native-xml2js';

export default function Flatlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('https://flathub.org/api/v2/feed/new')
      .then((response) => response.text())
      .then((xmlData) => {
        xml2js.parseString(xmlData, (error, result) => {
          if (error) {
            console.error('Error parsing XML:', error);
          } else {
            const rssItems = result?.rss?.channel[0]?.item || [];
            setItems(rssItems);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching XML:', error);
      });
  }, []);

  const openAppUrl = (appUrl) => {
    try {
      if (appUrl) {
        console.log('Opening app URL:', appUrl);
        Linking.openURL(appUrl);
      }
    } catch (error) {
      console.error('Error opening app URL:', error);
    }
  };

  const renderItem = ({ item }) => {
    const title = item.title[0];
    const imgSrcRegex = /<img src="(.*?)"/;
    const imgSrcMatch = item.description[0].match(imgSrcRegex);
    const imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;
    const descriptionRegex = /<p>(.*?)<\/p>/;
    const descriptionMatch = item.description[0].match(descriptionRegex);
    const descriptionText = descriptionMatch ? descriptionMatch[1] : null;
    const appUrl = item.link[0];
  
    return (
      <TouchableOpacity onPress={() => openAppUrl(appUrl)} style={styles.itemContainer}>
        {imgSrc && (
          <View>
            <Image source={{ uri: imgSrc }} style={styles.icon} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.titleText} variant="titleLarge">{title}</Text>
          {descriptionText && (
            <Text style={styles.descriptionText} variant="bodySmall" numberOfLines={2}>{descriptionText}</Text>
          )}
          {appUrl && (
            <View onPress={() => console.log('Testing URL:', appUrl)}>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  

  return (
    <ScrollView>
      <View>
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#3d3846',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  titleText: {
    color: 'white',
  },
  textContainer: {
    flex: 1,
  },
  descriptionText: {
    color: 'white',
    flexShrink: 1,
  },
});
