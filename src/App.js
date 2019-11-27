import React from 'react'
import 'react-native-gesture-handler'
import { AppNavigator } from './navigation'

import {
  View
} from 'react-native'

const App = () => {
  return (
      <View style={{flex: 1}}>
          <AppNavigator/>
      </View>
  )
}

export default App
