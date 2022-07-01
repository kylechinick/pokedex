export default class OpenWeatherService {
  static async getCurrentTemperature() {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=portland,oregon&appid=46ec625f0017a461c68de06748c4edcc&units=imperial`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      return error.message;
    }
  }

  static async get16DayForecast() {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/?q=portland,oregon&cnt=3&appid=46ec625f0017a461c68de06748c4edcc`
    );
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }
  catch(error) {
    return error.message;
  }
}
