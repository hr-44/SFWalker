'use strict';
/* eslint no-console: 0 */

import React, { Component } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  AppRegistry,
  StyleSheet,
  Text,
  StatusBar,
  View,
  TextInput,
  ScrollView
} from 'react-native';

import convertGPS from './src/api';

const accessToken = 'pk.eyJ1IjoibWFmdGFsaW9uIiwiYSI6ImNpcmllbXViZDAyMTZnYm5yaXpnMjByMTkifQ.rSrkLVyRbL3c8W1Nm2_6kA';
Mapbox.setAccessToken(accessToken);

class MapExample extends Component {
  state = {
    center: {
      latitude: 37.76,
      longitude: -122.445
    },
    zoom: 13,
    userTrackingMode: Mapbox.userTrackingMode.follow,
    annotations: [{
      coordinates: [[37.8038329212967,-122.40498607552468],[37.80402008919458,-122.40345922804256],[37.80403232677321,-122.40335872902352],[37.804043223247334,-122.40326745009796],[37.8041535290931, -122.40238315931316],[37.80418009972615, -122.40232004358228],[37.80419669589443, -122.4022807324564]],
      type: 'polyline',
      strokeColor: '#00FB00',
      strokeWidth: 3,
      id: 'navigateLine'
    }, {
      coordinates: [37.8038329212967, -122.40498607552468],
      id: 'Start',
      type: 'point',
      title: 'Starting Location',
      annotationImage: {
        source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
        height: 15,
        width: 15
      }
    }, {
      coordinates: [37.80419669589443, -122.4022807324564],
      id: 'End',
      type: 'point',
      title: 'Destination',
      annotationImage: {
        source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
        height: 15,
        width: 15
      }
    }],

  };
  //In progress
  fixCoords = (coordinates) => {
    this.setState({
      coordinates: this.state.coordinates.map(function(item) {
      [item[0],item[1]] = [item[1], item[0]];
      })
    });
  };
  //In progress
  setCoords = (input, state) => {
    var coords = convertGPS(input);
  }

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
    console.log('onChangeUserTrackingMode', userTrackingMode);
  };

  componentWillMount() {
    this._offlineProgressSubscription = Mapbox.addOfflinePackProgressListener(progress => {
      console.log('offline pack progress', progress);
    });
    this._offlineMaxTilesSubscription = Mapbox.addOfflineMaxAllowedTilesListener(tiles => {
      console.log('offline max allowed tiles', tiles);
    });
    this._offlineErrorSubscription = Mapbox.addOfflineErrorListener(error => {
      console.log('offline error', error);
    });
  }

  componentWillUnmount() {
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
  }

  render() {
    return (
        <View style={styles.container}>
          <MapView
            ref={map => { this._map = map }}
            style={styles.map}
            initialCenterCoordinate={this.state.center}
            initialZoomLevel={this.state.zoom}
            initialDirection={0}
            rotateEnabled={true}
            scrollEnabled={true}
            zoomEnabled={true}
            showsUserLocation={true}
            userTrackingMode={this.state.userTrackingMode}
            annotations={this.state.annotations}
            annotationsAreImmutable
            onChangeUserTrackingMode={this.onChangeUserTrackingMode}
            onRegionDidChange={this.onRegionDidChange}
          />
          <View style={{opacity: 5}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter current location"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Enter Destination"
                />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 30,
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  },
  scrollView: {
    flex: 1
  }
});

AppRegistry.registerComponent('whimsicleBugle', () => MapExample);
