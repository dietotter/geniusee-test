import React, { useState, useRef, useCallback, useEffect } from 'react'

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native'

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { storeData, getData } from '../../util/asyncStorage'

const Map = ({navigation}) => {
    // set mapView ref so we could use its methods
    let mapRef = useRef(null)

    // saved places
    const [savedList, setSavedList] = useState(null)
    // toggle showing saved places
    const [showSaved, setShowSaved] = useState(false)
    // set initial state for region
    const [region, setRegion] = useState({
        latitude: 50.4016991,
        longitude: 30.2525131,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    })
    // no markers are shown initially
    const [marker, setMarker] = useState(null)

    // load saved places
    useEffect(() => {
        getData().then(data => {
            setSavedList(data)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    // useCallback to avoid rerendering due to recreating arrow functions
    const regionUpdate = useCallback((region) => {
        setRegion(region)
    }, [])

    // when map is pressed, move camera to that location and put marker
    const onMapPress = useCallback((e) => {
        const { latitudeDelta, longitudeDelta } = region
        const { coordinate: { latitude, longitude } } = e.nativeEvent
        mapRef.current.animateToRegion({latitude, longitude, latitudeDelta, longitudeDelta}, 0)
        setMarker(e.nativeEvent)
        setRegion({latitude, longitude, latitudeDelta, longitudeDelta})
    }, [region])

    // when save button is hit, save current marker
    const saveMarker = () => {
        const { coordinate: { latitude, longitude } } = marker

        const newSavedMarker = { latitude, longitude }

        let tempoList
        if (savedList) {
            tempoList = [...savedList]
            // don't save more than 5 locations
            if (savedList.length < 5) {
                tempoList.push(newSavedMarker)
            } else {
                tempoList.shift()
                tempoList.push(newSavedMarker)
            }
        } else {
            tempoList = [newSavedMarker]
        }

        storeData(tempoList).then(() => {
            setSavedList(tempoList)
        }).catch(error => {console.log(error)})
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.mapPart}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    onPress={onMapPress}
                    onPoiClick={onMapPress}
                    onRegionChange={regionUpdate}
                >
                    { marker &&
                    <Marker coordinate={marker.coordinate} title={marker.name}/>
                    }
                </MapView>

                <View style={styles.topButtonView}>
                    { marker &&
                    <TouchableOpacity
                        style={{...styles.button, marginRight: 16}}
                        activeOpacity={.7}
                        onPress={saveMarker}
                    >
                        <Text style={styles.buttonText}>
                            Save marker
                        </Text>
                    </TouchableOpacity>
                    }
                </View>

                <View style={styles.bottomButtonView}>
                    <TouchableOpacity
                        style={{...styles.button, marginLeft: 16}}
                        activeOpacity={.7}
                        onPress={() => { setShowSaved(!showSaved) }}
                    >
                        <Text style={styles.buttonText}>
                            {showSaved ? 'Hide saved' : 'Show saved'}
                        </Text>
                    </TouchableOpacity>
                    { marker &&
                    <TouchableOpacity
                        style={{...styles.button, marginRight: 16}}
                        activeOpacity={.7}
                        onPress={() => { navigation.navigate('Weather', {
                            region
                        })}}
                    >
                        <Text style={styles.buttonText}>
                            Show weather
                        </Text>
                    </TouchableOpacity>
                    }
                </View>
            </View>

            {showSaved &&
            <ScrollView styles={styles.savedContainer}>
                {savedList && savedList.map((item, i) => (
                    <TouchableOpacity key={i} style={styles.listItem} onPress={() => {
                        const { latitude, longitude } = item
                        onMapPress({nativeEvent: {coordinate: { latitude, longitude }}})}
                    }>
                        <Text>{`Point: ${item.latitude}, ${item.longitude}`}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 5
    },
    mapPart: {
        flex: 1
    },
    bottomButtonView: {
        position: 'absolute',
        display: 'flex',
        width: '100%',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    topButtonView: {
        position: 'absolute',
        display: 'flex',
        width: '100%',
        top: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(100, 100, 100, 0.2)',
        borderRadius: 4,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 16
    },
    savedContainer: {
        flex: 1
    },
    listItem: {
        width: '100%',
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
        justifyContent: 'center',
        paddingHorizontal: 8
    }
})

export default Map
