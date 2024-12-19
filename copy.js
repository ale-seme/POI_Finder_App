import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

export default function App() {
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [coordinates1, setCoordinates1] = useState(null);
  const [coordinates2, setCoordinates2] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [trafficEnabled, setTrafficEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const API_KEY = 'kN4Xfz2trfBwkcnyHlx4GnF1zqBwc1wc';

  const screenWidth = Dimensions.get('window').width;

  const getCoordinates = async (city) => {
    try {
      const response = await axios.get(
        `https://api.tomtom.com/search/2/geocode/${city}.json?key=${API_KEY}`
      );
      if (response.data.results && response.data.results.length > 0) {
        const { lat, lon } = response.data.results[0].position;
        return { lat, lng: lon };
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      throw new Error('Invalid city input or failed to get coordinates.');
    }
  };

  const getRoute = async (origin, destination) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.tomtom.com/routing/1/calculateRoute/${origin.lat},${origin.lng}:${destination.lat},${destination.lng}/json?key=${API_KEY}`
      );

      const route = response.data.routes[0]?.legs[0]?.points || [];
      const summary = response.data.routes[0]?.legs[0]?.summary;

      if (!summary) throw new Error('Invalid routing summary');

      const polyline = route.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));

      const durationInSeconds = summary.durationInSeconds || 0;
      const lengthInMeters = summary.lengthInMeters || 0;

      setRouteCoordinates(polyline);

      setRouteInfo({
        duration: formatDuration(durationInSeconds),
        distance: formatDistance(lengthInMeters),
        departure: getCurrentTime(),
        arrival: calculateArrivalTime(durationInSeconds),
      });

      setLoading(false);

      // Display success message
      setSuccessMessage(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setSuccessMessage(false));
        }, 3000);
      });
    } catch (error) {
      setError('Failed to fetch route');
      setLoading(false);
    }
  };

  const formatDistance = (lengthInMeters) => {
    return lengthInMeters ? `${(lengthInMeters / 1000).toFixed(2)} km` : 'N/A';
  };

  const formatDuration = (durationInSeconds) => {
    if (isNaN(durationInSeconds) || durationInSeconds <= 0) return 'N/A';
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateArrivalTime = (durationInSeconds) => {
    if (isNaN(durationInSeconds) || durationInSeconds <= 0) return 'N/A';
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + durationInSeconds * 1000);
    return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async () => {
    setError(null);
    setRouteCoordinates(null);
    setRouteInfo(null);
    setShowMap(true);
    setSuccessMessage(false);
    setLoading(true);
    try {
      const coords1 = await getCoordinates(city1);
      const coords2 = await getCoordinates(city2);

      if (coords1 && coords2) {
        setCoordinates1(coords1);
        setCoordinates2(coords2);
        await getRoute(coords1, coords2);
      }
    } catch (error) {
      setError('Error fetching coordinates or route. Please try again.');
      setLoading(false);
      setShowMap(false); // Hide map if there's an error
    }
  };

  const toggleTraffic = () => {
    setTrafficEnabled(!trafficEnabled);
  };

  const closeMap = () => {
    setShowMap(false);
    setCity1('');
    setCity2('');
    setRouteCoordinates(null);
    setRouteInfo(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.logo}
        source={require('./assets/TomTom-logo-RGB_lockup.png')}
        resizeMode="contain"
      />
      {!showMap && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter City 1"
            value={city1}
            onChangeText={setCity1}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter City 2"
            value={city2}
            onChangeText={setCity2}
          />
          <Button title="Get Route" onPress={handleSubmit} />
          {error && <Text style={styles.error}>{error}</Text>}
          {loading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </>
      )}
      {showMap && (
        <>
          {loading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {routeCoordinates && (
            <>
              <MapView
                style={[styles.map, { width: screenWidth }]}
                initialRegion={{
                  latitude: (coordinates1.lat + coordinates2.lat) / 2,
                  longitude: (coordinates1.lng + coordinates2.lng) / 2,
                  latitudeDelta: 5,
                  longitudeDelta: 5,
                }}
                showsTraffic={trafficEnabled}
              >
                <Marker coordinate={coordinates1} title={city1} />
                <Marker coordinate={coordinates2} title={city2} />
                <Polyline coordinates={routeCoordinates} strokeColor="blue" strokeWidth={4} />
              </MapView>
              <View style={styles.routeInfo}>
                {routeInfo && (
                  <>
                    <Text style={styles.infoText}>Distance: {routeInfo.distance}</Text>
                    <Text style={styles.infoText}>Duration: {routeInfo.duration}</Text>
                    <Text style={styles.infoText}>Departure: {routeInfo.departure}</Text>
                    <Text style={styles.infoText}>Arrival: {routeInfo.arrival}</Text>
                  </>
                )}
              </View>
              <Button title="Toggle Traffic" onPress={toggleTraffic} />
              <Button title="Close Map" onPress={closeMap} />
            </>
          )}
        </>
      )}
      {successMessage && (
        <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}>
          <Text style={styles.successText}>Route Calculated Successfully!</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  map: {
    height: 400,
    marginVertical: 20,
  },
  routeInfo: {
    marginVertical: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  successMessage: {
    position: 'absolute',
    top: 80,
    left: '10%',
    right: '10%',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    zIndex: 999,
    elevation: 5,
    alignItems: 'center',
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
  },
});