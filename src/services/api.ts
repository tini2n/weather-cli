// import * as https from 'https';
import axios from 'axios';

import {store} from './storage';

export const getIcon = (icon: string) => {
    switch (icon.slice(0, -1)) {
        case '01':
            return '☀️';
        case '02':
            return '🌤';
        case '03':
            return '☁️';
        case '04':
            return '☁️';
        case '09':
            return '🌧';
        case '10':
            return '🌦';
        case '11':
            return '🌩';
        case '13':
            return '❄️';
        case '50':
            return '🌫';

        default:
            return '🔮';
    }
};

export const getWeather = async (city: string) => {
    const token = await store.getKeyValue('token');

    // const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    // url.searchParams.append('q', city);
    // url.searchParams.append('appid', token);
    // url.searchParams.append('units', 'metric');

    // return new Promise((resolve, reject) => {
    //     https.get(url, response => {
    //         let res = '';

    //         response.on('data', chunk => (res += chunk));
    //         response.on('end', () => {
    //             resolve(JSON.parse(res));
    //         });

    //         response.on('error', error => {
    //             reject(error);
    //         });
    //     });
    // });

    const {data} = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            q: city,
            appid: token,
            units: 'metric'
        }
    });

    return data;
};
