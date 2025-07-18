import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

interface Category {
  id: string;
  title: string;
}

interface Geometry {
  coordinates: number[];
}

interface Event {
  id: string;
  title: string;
  categories: Category[];
  geometries: Geometry[];
}

export default function MapScreen() {
  const route = useRoute();
  // @ts-ignore
  const { country } = route.params;
  const [fires, setFires] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('https://eonet.gsfc.nasa.gov/api/v2.1/events')
      .then((res) => {
        const allFires: Event[] = res.data.events.filter((event: Event) =>
          event.categories.some((cat: Category) => cat.id === '8' || cat.title.toLowerCase().includes('fire'))
        );
        // Seçilen ülkenin bounding box'ına göre filtrele
        const firesFiltered = allFires
          .filter(fire => {
            if (!fire.geometries || fire.geometries.length === 0) return false;
            const [lon, lat] = fire.geometries[0].coordinates;
            return (
              lat >= country.bbox.minLat && lat <= country.bbox.maxLat &&
              lon >= country.bbox.minLon && lon <= country.bbox.maxLon
            );
          })
          .slice(0, 100);
        setFires(firesFiltered);
        setLoading(false);
      })
      .catch((err) => {
        setError('Veri alınırken hata oluştu.');
        setLoading(false);
      });
  }, [country]);

  const initialRegion = {
    latitude: (country.bbox.minLat + country.bbox.maxLat) / 2,
    longitude: (country.bbox.minLon + country.bbox.maxLon) / 2,
    latitudeDelta: Math.abs(country.bbox.maxLat - country.bbox.minLat) * 1.2,
    longitudeDelta: Math.abs(country.bbox.maxLon - country.bbox.minLon) * 1.2,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#d7263d" />
          <Text style={styles.text}>Yükleniyor...</Text>
          <Text style={styles.text}>İnternet bağlantınıza göre bu işlem biraz zaman alabilir.</Text>
        </View>
      )}
      {error && (
        <View style={styles.centered}>
          <Text style={styles.text}>{error}</Text>
        </View>
      )}
      {!loading && !error && (
        <>
          <MapView style={{ width: '100%', height: '90%' }} initialRegion={initialRegion}>
            <UrlTile
              urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
              tileSize={256}
            />
            {fires.map((fire, idx) => (
              <Marker
                key={fire.id || idx}
                title={fire.title}
                coordinate={{
                  latitude: fire.geometries[0].coordinates[1],
                  longitude: fire.geometries[0].coordinates[0],
                }}
              />
            ))}
          </MapView>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>{country.name} ve çevresindeki yangınlar ({fires.length})</Text>
            {fires.length === 0 && <Text style={styles.text}>Yangın verisi bulunamadı.</Text>}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    color: '#d7263d',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
}); 