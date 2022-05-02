import * as path from 'path';
import * as fs from 'fs';

class Store {
    filePath: string = path.join(process.cwd(), 'store.json');

    async isExist(path: string) {
        try {
            await fs.promises.stat(path);
            return true;
        } catch (error) {
            return false;
        }
    }

    async getKeyValue(key: string) {
        if (await this.isExist(this.filePath)) {
            const file = await fs.promises.readFile(this.filePath, 'utf-8');
            const data = JSON.parse(file);

            return data[key];
        }
        return null;
    }

    async saveKeyValue(key: string, value: string) {
        // console.log(filePath);                                          // /Users/vlady/Projects/playground/weather/store.json
        // console.log(path.basename(filePath));                           // store.json
        // console.log(path.dirname(filePath));                            // /Users/vlady/Projects/playground/weather
        // console.log(path.extname(filePath));                            // .json
        // console.log(path.relative(filePath, path.dirname(filePath)));   // ..
        // console.log(path.isAbsolute(filePath));                         // true
        // console.log(path.resolve('./'));                                // /Users/vlady/Projects/playground/weather
        // console.log(path.sep);                                          // /

        let data: any = {};

        if (await this.isExist(this.filePath)) {
            const file = await fs.promises.readFile(this.filePath, {encoding: 'utf8'});

            data = JSON.parse(file);
        }

        data[key] = value;

        await fs.promises.writeFile(this.filePath, JSON.stringify(data));
    }
}

const store = new Store();

export {store};
