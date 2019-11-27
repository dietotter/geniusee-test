import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import { Map, Weather } from '../screen'

const AppNavigator = createStackNavigator(
    {
        Map: {
            screen: Map,
            navigationOptions: {
                header: null
            }
        },
        Weather: {
            screen: Weather,
            navigationOptions: {
                headerTitle: 'Weather'
            }
        }
    },
    {
        initialRouteName: 'Map'
    }
)

export default createAppContainer(AppNavigator)
