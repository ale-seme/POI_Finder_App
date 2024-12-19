# POI Finder App

## Overview

This is a simple mobile app built using **React Native** that allows users to find the fastest route between two cities using **TomTom APIs**. The app takes the names of two cities as input, fetches their geographical coordinates using the **TomTom Geocoding API**, and then calculates and displays the fastest route between them on a map. The app also supports toggling traffic information and switching between different map views (standard/satellite).

## Features
- Enter two city names to calculate the fastest route.
- Display the route on a map using **`react-native-maps`**.
- Toggle traffic information on the map.
- Switch between standard and satellite map views.
- Shows details like route duration, distance, departure, and arrival time.

## Technologies Used
- **React Native**: Framework for building native mobile apps using JavaScript and React.
- **Expo**: Platform for faster mobile app development and testing.
- **TomTom API**: Used for geocoding (getting coordinates from city names) and routing (calculating the fastest route).
- **Axios**: For making HTTP requests to TomTom's API.
- **React**: For handling the app's state and UI components.

## Installation

To get this project running on your local machine, follow these steps:

### 1. Install Node.js and npm
Make sure you have **Node.js** and **npm** installed on your system. You can download and install the latest version of Node.js from [nodejs.org](https://nodejs.org/).

To verify the installation, open your terminal/command prompt and type:
```bash
node -v
npm -v
2. Install Expo CLI
This app uses Expo for development. Install the Expo CLI globally using npm:

bash
Copy code
npm install -g expo-cli
3. Clone the repository
Clone the project repository to your local machine:

bash
Copy code
git clone <repository-url>
cd <project-directory>
4. Install dependencies
Navigate to the project folder and install the necessary dependencies using npm or yarn:

bash
Copy code
npm install
# or
yarn install
5. Set up the TomTom API
You need an API key from TomTom to access their geocoding and routing services.

Go to TomTom Developer Portal and create an account.
Create a new project to get your API key.
Once you have the key, replace the value of API_KEY in the App.js file with your actual API key:
javascript
Copy code
const API_KEY = 'your-api-key-here';
6. Start the app
After setting up the API key, you can run the app using Expo. From your terminal, run:

bash
Copy code
expo start
This will start the Expo development server and open a page in your browser. A QR code will be generated in your terminal or browser.

7. Scan the QR Code with Expo Go
To view the app on your physical device:

Download and install the Expo Go app from the App Store (iOS) or Google Play (Android).
Open the Expo Go app and scan the QR code that appears in your terminal or browser.
The app should now open on your mobile device, and you can interact with it directly!

Code Structure
App.js: Main file containing the app's logic and UI components. It includes functions for fetching coordinates from TomTom, calculating the route, and displaying the map with the route.
assets/: Directory containing images like the TomTom logo used in the app.
styles/: Contains the app’s styling and layout.
Notes
The app uses react-native-maps for displaying maps and route markers.
The axios library is used to make HTTP requests to the TomTom APIs for geocoding and routing.
Ensure that you replace the TomTom API key in App.js to access the services.
License
This project is open-source and available under the MIT License.

vbnet
Copy code

This is a complete **README.md** that covers everything you need to set up and run you
