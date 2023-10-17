import { rm, readFile } from 'fs/promises';
import * as fs from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';

global.beforeEach(async () => {
    try {
        const path = join(__dirname, '../', <string>process.env.DATABASE);
        if (fs.existsSync(path)) {
            await rm(path);
        }
    } catch (error) {
        Logger.error(error, "Error in global beforeEach");
    }
});