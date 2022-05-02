import {Command, Flags} from '@oclif/core';

export default abstract class extends Command {
    async run() {
        console.log('weather');
    }
}
