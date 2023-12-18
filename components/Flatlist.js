import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import xml2js from 'react-native-xml2js';
import { Text } from 'react-native-paper';

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
            <Text variant="titleLarge">{title}</Text>
            {descriptionText && <Text variant="bodySmall">{descriptionText}</Text>}
          </View>
        </View>
      );
    };
  
    return (
        <View>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
      paddingBottom: 5,
    },
    icon: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
  });
  