import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

import { parseWeatherData } from '../../util/parseData'

const WEATHER_KEY = 'd3434351b43f4a44beb83725a1c002b1'
const { width: screenWidth, height: screenHeight} = Dimensions.get('window')

const Weather = ({navigation}) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)

    // get data from weather API
    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true)
            const region = navigation.getParam('region', {})

            try {
                const url = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${region.latitude}&lon=${region.longitude}&key=${WEATHER_KEY}&hours=48`
                const response = await fetch(url)
                return await response.json()

            } catch (error) {
                return error
            }
        }

        fetchWeather().then(rawData => {
            // parse data so that it could be shown on chart
            setData(parseWeatherData(rawData))
            setLoading(false)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    const chartConfig = {
        backgroundGradientFrom: "#FFF",
        backgroundGradientTo: "#FFF",
        color: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        flex: 1
    }

    return (
            <ScrollView horizontal style={styles.container} contentContainerStyle={styles.contentContainer}>
                {loading && <ActivityIndicator style={{marginTop: 20}} size={'small'} color={'red'}/>}

                {data &&
                <LineChart
                    data={{
                        labels: [...data.hours],
                        datasets: [
                            {
                            data: [...data.temperature],
                            color: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
                            strokeWidth: 2
                        }]
                    }}
                    width={ screenWidth > screenHeight ? screenWidth : screenHeight }
                    height={300}
                    chartConfig={chartConfig}
                    yAxisSuffix={'ºC'}
                />
                }
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        alignItems: 'center'
    }
})

export default Weather
