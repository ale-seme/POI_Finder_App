import React, { useState } from 'react'; //React Hook used for state management in functional components
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native'; //Components
import MapView, { Marker, Polyline } from 'react-native-maps'; //MapView as main map container
import axios from 'axios'; //HTTP client for maki requests
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App()  //main funcitonal component
{
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [coordinates1, setCoordinates1] = useState(null);
  const [coordinates2, setCoordinates2] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [mapType, setMapType] = useState('standard'); // Toggle map view
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [trafficEnabled, setTrafficEnabled] = useState(false);

  const API_KEY = 'kN4Xfz2trfBwkcnyHlx4GnF1zqBwc1wc';

  const getCoordinates = async (city) => //axsios is nice a good and modern promise-based HTTP client better than fetch()
  {
    try {
      const response = await axios.get(`https://api.tomtom.com/search/2/geocode/${city}.json?key=${API_KEY}`);
      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        const lat = result.position.lat;
        const lon = result.position.lon;
        return { lat: lat, lng: lon }; //return as an object
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      setError('Failed to get coordinates');
    }
  };

  const getRoute = async (origin, destination) => 
  {
    setLoading(true);//spinner
    try {
      const response = await axios.get(`https://api.tomtom.com/routing/1/calculateRoute/${origin.lat},${origin.lng}:${destination.lat},${destination.lng}/json?key=${API_KEY}&routeType=fastest&computeTravelTimeFor=all&traffic=${trafficEnabled}`);

      const route = response.data.routes[0].legs[0].points;
      const { travelTimeInSeconds, lengthInMeters, arrivalTime } = response.data.routes[0].legs[0].summary;

      // Log the values to the console for debugging
      console.log('Travel Time in Seconds:', travelTimeInSeconds);
      console.log('Length in Meters:', lengthInMeters);
      console.log('Arrival Time:', arrivalTime);

      const polyline = route.map((point) => ({ //just trasnforming this to an array of objects with lat and longi properties and storing inside polyline
        latitude: point.latitude,
        longitude: point.longitude,
      }));

      setRouteCoordinates(polyline);
      setRouteInfo({
        duration: formatDuration(travelTimeInSeconds),
        distance: formatDistance(lengthInMeters),
        departure: getCurrentTime(),
        arrival: arrivalTime ? new Date(arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      });
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch route');
      setLoading(false);
    }
  };

  const formatDuration = (durationInSeconds) => 
  {
    console.log('Formatting Duration:', durationInSeconds); // Log the input value
    if (isNaN(durationInSeconds) || durationInSeconds <= 0) return 'N/A';
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60); //leftover seconds after calculating hourse /60 to then convert to minutes
    return `${hours}h ${minutes}m`;
  };

  const formatDistance = (distanceInMeters) => {
    const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);
    return `${distanceInKilometers} km`;
  };

  const getCurrentTime = () => 
  {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async () => //triggered with get route
  {
    setError(null);//clearing errors
    setRouteCoordinates(null);
    setRouteInfo(null);
    setShowMap(true);//yayy time for the map
    try {
      const coords1 = await getCoordinates(city1);//from APi's
      const coords2 = await getCoordinates(city2);

      if (coords1 && coords2) {
        setCoordinates1(coords1);
        setCoordinates2(coords2);
        await getRoute(coords1, coords2);
      }
    } catch (error) {
      setError('Error fetching coordinates or route. Please try again.');
    }
  };

  const toggleMapType = () => 
  {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const toggleTraffic = async () => //triggered with the traffic button
  {
    setTrafficEnabled(!trafficEnabled);
    if (coordinates1 && coordinates2) {
      await getRoute(coordinates1, coordinates2);
    }
  };

  const switchCities = () => 
  {
    const temp = city1;
    setCity1(city2);
    setCity2(temp);
  };

  const closeMap = () => 
  {
    setShowMap(false);
    setCity1('');
    setCity2('');
    setRouteCoordinates(null);
    setRouteInfo(null);
  };

  return (
    <View style={styles.container}> {/*main wrapper*/} {/*JSX*/}
      {/* TomTom Logo */}
      <Image
        style={styles.logo}
        source={require('./assets/TomTom-logo-RGB_lockup.png')}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Icon name="dot-circle-o" size={20} color="blue" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter City 1"
            value={city1}
            onChangeText={setCity1} {/*callback fun to upate the value when is changed*/}
          />
        </View>
        <View style={styles.inputRow}>
          <Icon name="flag-checkered" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter City 2"
            value={city2}
            onChangeText={setCity2}
          />
        </View>
        <TouchableOpacity onPress={switchCities} style={styles.switchButton}>
          <Text style={styles.switchButtonText}>⇅</Text>
        </TouchableOpacity>{/*making it clickable*/}
      </View>
      <Button title="Get Route" onPress={handleSubmit} />
      {error && <Text style={styles.error}>{error}</Text>} {/*conditional rendering "short circuit"*/}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {!loading && routeCoordinates && (
        <View style={styles.routeCard}>
          <Text style={styles.routeCardText}>Route Calculated!</Text>
          <View style={styles.routeDetailsContainer}>
            <Text style={styles.routeDetails}>Distance: {routeInfo?.distance}</Text> {/*optional chaining not trowing error if is null or undefined*/}
            <Text style={styles.routeDetails}>Duration: {routeInfo?.duration}</Text>
          </View>
          <View style={styles.routeDetailsContainer}>
            <Text style={styles.routeDetails}>Departure: {routeInfo?.departure}</Text>
            <Text style={styles.routeDetails}>Arrival: {routeInfo?.arrival}</Text>
          </View>
        </View>
      )}

      {showMap && coordinates1 && coordinates2 && routeCoordinates && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            mapType={mapType}
            showsTraffic={trafficEnabled}
            initialRegion={{
              latitude: (coordinates1.lat + coordinates2.lat) / 2, //centering the map between the two
              longitude: (coordinates1.lng + coordinates2.lng) / 2,
              latitudeDelta: 10, //zoom (less is more)
              longitudeDelta: 10,
            }}
          >
            <Marker coordinate={coordinates1} title={city1} />
            <Marker coordinate={coordinates2} title={city2} />
            <Polyline coordinates={routeCoordinates} strokeColor="blue" strokeWidth={4} />
          </MapView>
          <TouchableOpacity onPress={closeMap} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTraffic} style={styles.trafficToggleButton}>
            <Text style={styles.trafficToggleButtonText}>Traffic</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMapType} style={styles.mapToggleButton}>
            <Text style={styles.mapToggleButtonText}>
              {mapType === 'standard' ? 'Satellite' : 'Standard'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ //defining all teh styles for the components
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 5,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
    position: 'relative',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  switchButton: {
    position: 'absolute',
    right: -30,
    top: '45%',
    transform: [{ translateY: -10 }],
  },
  switchButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapContainer: {
    width: '100%',
    height: '60%',
    marginTop: 20,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapToggleButton: {
    position: 'absolute',
    top: 90,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10,
  },
  mapToggleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trafficToggleButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10,
  },
  trafficToggleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  routeCard: {
    width: '90%', // Adjusted to expand horizontally
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  routeCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  routeDetailsContainer: {
    flexDirection: 'row', // with this i can spread orizontally the elements inside
    justifyContent: 'space-between', // Putting the space between details
    width: '100%',
  },
  routeDetails: {
    fontSize: 16,
    marginVertical: 2,
    marginHorizontal: 10, // Add horizontal margin for spacing
  },
});