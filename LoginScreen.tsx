import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const countries = [
  { code: 'TR', name: 'Türkiye', bbox: { minLat: 35, maxLat: 43, minLon: 25, maxLon: 45 } },
  { code: 'GR', name: 'Yunanistan', bbox: { minLat: 34, maxLat: 42, minLon: 19, maxLon: 29 } },
  { code: 'IT', name: 'İtalya', bbox: { minLat: 36, maxLat: 47, minLon: 6, maxLon: 19 } },
  { code: 'FR', name: 'Fransa', bbox: { minLat: 41, maxLat: 51, minLon: -5, maxLon: 9 } },
  { code: 'ES', name: 'İspanya', bbox: { minLat: 36, maxLat: 44, minLon: -9, maxLon: 4 } },
  { code: 'DE', name: 'Almanya', bbox: { minLat: 47, maxLat: 55, minLon: 5, maxLon: 16 } },
  // Daha fazla ülke eklenebilir
];

export default function LoginScreen() {
  const navigation = useNavigation();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const handlePress = () => {
    navigation.navigate('Map', { country: selectedCountry });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Alevio App</Text>
      <Text style={styles.subtitle}>Lütfen bir ülke seçin</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCountry.code}
          onValueChange={(itemValue) => {
            const found = countries.find(c => c.code === itemValue);
            if (found) setSelectedCountry(found);
          }}
          style={styles.picker}
        >
          {countries.map(country => (
            <Picker.Item key={country.code} label={country.name} value={country.code} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Görüntüle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    backgroundColor: 'red',
    width: 240,
    height: 240,
    marginBottom: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#d7263d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 16,
  },
  pickerContainer: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 24,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 60,
  },
  button: {
    backgroundColor: '#d7263d',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 