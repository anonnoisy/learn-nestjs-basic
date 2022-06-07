import { rm } from "fs/promises";
import { join } from "path";
import { getConnection, getConnectionManager } from "typeorm";

global.beforeEach(async () => {
	try {
		await rm(join(__dirname, '..', 'test.sqlite'))
	} catch (error) {}
});