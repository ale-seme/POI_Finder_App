# POI Finder App

## Overview

The POI Finder App is a simple mobile application built using **React Native**. It allows users to find the fastest route between two cities using the **TomTom APIs**. Users can input the names of two cities, and the app fetches their geographical coordinates via the **TomTom Geocoding API**. The fastest route is then calculated and displayed on an interactive map. Additional features include toggling traffic information and switching between map views.

---

## Features

- Input two city names to calculate the fastest route.
- Display the route on a map using **`react-native-maps`**.
- Toggle live traffic information on the map.
- View route details such as:
  - Total distance (in kilometers).
  - Estimated travel duration.
  - Departure time.
  - Estimated arrival time.
- Toggle between map views (standard/traffic).
- Display success and error messages for enhanced user feedback.

---

## Technologies Used

- **React Native**: Framework for building mobile apps.
- **Expo**: For faster development and testing.
- **TomTom API**: Geocoding and routing services.
- **Axios**: HTTP client for API requests.
- **React**: State and UI component management.
- **React Native Maps**: For rendering interactive maps.

---

## Installation

Follow the steps below to set up and run the project:

### Prerequisites

Ensure you have the following installed:
- **Node.js** and **npm**: [Download here](https://nodejs.org/).
- **Expo CLI**: Install globally by running:
  ```bash
  npm install -g expo-cli

### Steps
-Clone the Repository:
git clone <repository-url>
cd <project-directory>

-Clone the project repository to your local machine

**Install Dependencies**

npm install
or
yarn install


**Set Up the TomTom API**

Sign up on the TomTom Developer Portal.
Create a new project to obtain your API key.
Replace the placeholder API key in App.js with your actual key:

const API_KEY = 'your-api-key-here'

-Run the App
-Start the app using Expo:

expo start

A development server will start, and a QR code will appear in the terminal or browser.
Open the Expo Go app (available on the App Store and Google Play), and scan the QR code to preview the app on your device.
From an Iphone you once you installed the app you can simply scan the QR code from the camera app, while from Android you need to do it grom the app.

## Usage
Open the app on your mobile device after scanning the QR code with Expo Go. Enter the names of two cities in the input fields and tap "Get Route".

**The app will display:**

- A loading spinner while fetching data.  
- Success or error messages depending on the result.  
- A map showing the fastest route between the two cities.  
- Toggle traffic information using the "Traffic On/Off" button.  
- View detailed route information, including:  
  - Total distance (in kilometers).  
  - Estimated duration of travel.  
  - Departure and estimated arrival times.  
- Use the "Close Map" button to reset and input new cities.

