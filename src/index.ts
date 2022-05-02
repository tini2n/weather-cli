import {Command, Flags} from '@oclif/core';
import {bgBlue, bgRed, bgGreen, green} from 'chalk';
import axios, {AxiosError} from 'axios';

import {store} from './services/storage';
import {getWeather, getIcon} from './services/api';
import {printHelp, printWeather} from './services/log';

import {parseArgs} from './helpers/args';

// export {run} from '@oclif/core';

class Weather extends Command {
    static description = 'Get weather';

    static examples = [
        `$ oex hello friend --from oclif
           hello friend from oclif! (./src/commands/hello/index.ts)
        `
    ];

    static args = [{name: 'city'}];

    static flags = {
        token: Flags.string({char: 't', description: 'OpenWeather token'}),
        help: Flags.boolean({char: 'h', description: 'City to lookup weather'}),
        save: Flags.boolean({char: 's', description: 'Save to DB'}),
        get: Flags.boolean({char: 'g', description: 'Get saved from DB'})
    };

    printInfo(string: string | any) {
        console.log(bgGreen`${typeof string === 'string' ? string : JSON.stringify(string)}`);
    }

    printError(string: string | any) {
        console.log(bgRed`${typeof string === 'string' ? string : JSON.stringify(string)}`);
    }

    async getForecast(city: string) {
        try {
            const data = await getWeather(city);

            // console.log(data);

            return data;
        } catch (error) {
            const e: any = error;
            if (e.response.status === 404) {
                this.printError('Smth wrong with city');
            } else if (e.response.status === 401) {
                this.printError('Smth wrong with token');
            } else {
                this.printError(error);
            }

            if (axios.isAxiosError(error)) {
                // this.printError(error);
                // Access to config, request, and response
            } else {
                // console.error('stock', error);
                // Just a stock error
            }
        }
    }

    async saveToken(token: string) {
        if (!token.length) {
            console.error('Token is empty');
            return;
        }

        try {
            await store.saveKeyValue('token', token);
            console.log(green(`Token saved`));
        } catch (error) {
            console.error(error);
        }
    }

    async saveCity(city: string) {
        if (!city.length) {
            console.error('City is empty');
            return;
        }

        try {
            await store.saveKeyValue('city', city);
            console.log(green(`City saved`));
        } catch (error) {
            console.error(error);
        }
    }

    async getToken(withLog = true) {
        try {
            const token = await store.getKeyValue('token');

            withLog && console.log(`Token: ${token}`);

            return token;
        } catch (error) {
            console.error(error);
        }
    }

    async getCity(withLog = true) {
        try {
            const city = await store.getKeyValue('city');

            withLog && console.log(bgBlue`City: ${city}`);

            return city;
        } catch (error) {
            console.error(error);
        }
    }

    async run() {
        const {args, flags} = await this.parse(Weather);
        const savedCity = await this.getCity(false);

        if (flags.get && savedCity) {
            console.log(bgBlue`Saved city: ${savedCity}`);
        }

        if (args.city) {
            const data = await this.getForecast(args.city);
            printWeather(data, getIcon(data.weather[0].icon));
            if (flags.save) {
                await this.saveCity(args.city);
            }
        }

        if (flags.token?.length) {
            const alreadySavedToken: any = await this.getToken();

            if (!alreadySavedToken || alreadySavedToken === 'null') {
                await this.saveToken(flags.token);
            } else {
                this.printError('Error: token already saved!');
            }
        }

        if (flags.token && flags.save) {
            await this.getToken();
        }

        if (flags.help) {
            printHelp();
        }

        if (!args.city && savedCity && Object.keys(flags).length === 0) {
            const data = await this.getForecast(savedCity);
            printWeather(data, getIcon(data.weather[0].icon));
        }

        // console.log(args, flags);
    }
}

// export default Weather;
export = Weather;
