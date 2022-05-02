import {bgBlue, bgRed, bgGreen, bgYellow, green} from 'chalk';

export const printHelp = () => {
    console.log(bgBlue(`Get weather by your location \nor by the city`));
};

export const printWeather = (data: any, icon: string) => {
    console.log(bgBlue`CITY: ${data.name}`);
    console.log(bgBlue`${icon}  ${data.weather[0].description}`);
    console.log(bgBlue`TEMP: ${data.main.temp} | FL: ${data.main.feels_like}`);
    console.log(bgBlue`HUM: ${data.main.temp}`);
    console.log(bgBlue`WIND SP: ${data.wind.speed}`);
};
