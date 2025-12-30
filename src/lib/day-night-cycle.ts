import * as SunCalc from 'suncalc';

export interface DayNightInfo {
  isDaytime: boolean;
  opacity: number;
  sunPosition: number;
  currentTime: Date;
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
}

export function calculateDayNight(lat: number, lng: number, date: Date = new Date()): DayNightInfo {
  const times = SunCalc.getTimes(date, lat, lng);
  const sunPosition = SunCalc.getPosition(date, lat, lng);

  const currentTime = date.getTime();
  const sunrise = times.sunrise.getTime();
  const sunset = times.sunset.getTime();
  const solarNoon = times.solarNoon.getTime();

  const isDaytime = currentTime >= sunrise && currentTime <= sunset;

  let opacity = 0;

  if (!isDaytime) {
    opacity = 0.7;
  } else {
    const totalDaylight = sunset - sunrise;
    const timeFromNoon = Math.abs(currentTime - solarNoon);
    const noonToSunset = Math.abs(sunset - solarNoon);

    if (timeFromNoon > noonToSunset * 0.8) {
      const duskProgress = (timeFromNoon - noonToSunset * 0.8) / (noonToSunset * 0.2);
      opacity = Math.min(0.4, duskProgress * 0.4);
    }
  }

  return {
    isDaytime,
    opacity,
    sunPosition: sunPosition.altitude,
    currentTime: date,
    sunrise: times.sunrise,
    sunset: times.sunset,
    solarNoon: times.solarNoon,
  };
}
