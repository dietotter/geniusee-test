import AsyncStorage from '@react-native-community/async-storage'

const APP_STORAGE_KEY = '@weatherKey'

export const storeData = async (data) => {
    try {
        await AsyncStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
        console.log('Error storing data', e)
    }
}

export const getData = async () => {
    try {
        const data = await AsyncStorage.getItem(APP_STORAGE_KEY)

        return JSON.parse(data)
    } catch(e) {
        console.log('Error loading data', e)
    }
}
