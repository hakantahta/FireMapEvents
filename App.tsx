import React from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import axios from 'axios';

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

interface State {
  fires: Event[];
  loading: boolean;
  error: string | null;
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      fires: [],
      loading: true,
      error: null,
    };
    console.log('App constructor çalıştı');
  }

  renderMarkers() {
    try {
      const firesWithCoords = this.state.fires
        .filter(fire =>
          fire.geometries &&
          fire.geometries.length > 0 &&
          Array.isArray(fire.geometries[0].coordinates) &&
          fire.geometries[0].coordinates.length === 2 &&
          typeof fire.geometries[0].coordinates[0] === 'number' &&
          typeof fire.geometries[0].coordinates[1] === 'number'
        )
        // Türkiye ve çevresi için filtre
        .filter(fire => {
          const lon = fire.geometries[0].coordinates[0];
          const lat = fire.geometries[0].coordinates[1];
          return lat >= 35 && lat <= 43 && lon >= 25 && lon <= 45;
        })
        .slice(0, 100);
      console.log('Marker için uygun yangınlar:', firesWithCoords);
      return firesWithCoords.map((fire, idx) => (
        <Marker
          key={fire.id || idx}
          title={fire.title}
          coordinate={{
            latitude: fire.geometries[0].coordinates[1],
            longitude: fire.geometries[0].coordinates[0],
          }}
        />
      ));
    } catch (err) {
      console.log('renderMarkers HATASI:', err);
      return null;
    }
  }

  componentDidMount() {
    console.log('componentDidMount çalıştı');
    axios
      .get('https://eonet.gsfc.nasa.gov/api/v2.1/events')
      .then((res) => {
        console.log('API yanıtı:', res.data);
        // Sadece yangın (wildfire) olaylarını filtrele
        const fires: Event[] = res.data.events.filter((event: Event) =>
          event.categories.some((cat: Category) => cat.id === '8' || cat.title.toLowerCase().includes('fire'))
        );
        console.log('Filtrelenmiş yangınlar:', fires);
        this.setState({ fires, loading: false });
      })
      .catch((error) => {
        console.log('API HATASI:', error);
        this.setState({ error: error.message, loading: false });
      });
  }

  render() {
    const { loading, fires, error } = this.state;
    // Harita başlangıcı Türkiye
    const initialRegion = {
      latitude: 39.0, // Türkiye'nin yaklaşık merkezi
      longitude: 35.0,
      latitudeDelta: 5,
      longitudeDelta: 5,
    };
    console.log('render çalıştı, loading:', loading, 'error:', error, 'fires:', fires);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {loading && <Text style={styles.text}>Yükleniyor...</Text>}
        {error && <Text style={styles.text}>Hata: {error}</Text>}
        {!loading && !error && (
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={initialRegion}
            >
              <UrlTile
                urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
                tileSize={256}
              />
              {this.renderMarkers()}
            </MapView>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.header}>Yangın Olayları ({fires.length})</Text>
              {fires.length === 0 && <Text style={styles.text}>Yangın verisi bulunamadı.</Text>}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});
