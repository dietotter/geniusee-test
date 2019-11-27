export const parseWeatherData = (rawData) => {
    const { data } = rawData

    const dataObject = {
        hours: [],
        temperature: []
    }

    // get forecast for the next 24 hours
    dataObject.hours = data.slice(0, 12).map((elem) => convertHours(elem.timestamp_local))

    dataObject.temperature = data.slice(0, 12).map((elem) => elem.temp)

    return dataObject
}

// convert hours to '01:00' format
const convertHours = (timestampLocal) => {
    // take hours out of a local time
    let hours = new Date(timestampLocal).getHours()

    if (hours < 10) {
        hours = '0' + hours
    }
    hours += ':00'

    return hours
}
