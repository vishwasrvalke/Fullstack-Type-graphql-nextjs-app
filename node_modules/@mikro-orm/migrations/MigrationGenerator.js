"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationGenerator = void 0;
const fs_extra_1 = require("fs-extra");
const core_1 = require("@mikro-orm/core");
class MigrationGenerator {
    constructor(driver, namingStrategy, options) {
        this.driver = driver;
        this.namingStrategy = namingStrategy;
        this.options = options;
    }
    async generate(diff, path) {
        path = core_1.Utils.normalizePath(path || this.options.path);
        await fs_extra_1.ensureDir(path);
        const timestamp = new Date().toISOString().replace(/[-T:]|\.\d{3}z$/ig, '');
        const className = this.namingStrategy.classToMigrationName(timestamp);
        const fileName = `${this.options.fileName(timestamp)}.${this.options.emit}`;
        let ret;
        if (this.options.emit === 'js') {
            ret = this.generateJSMigrationFile(className, diff);
        }
        else {
            ret = this.generateTSMigrationFile(className, diff);
        }
        await fs_extra_1.writeFile(path + '/' + fileName, ret);
        return [ret, fileName];
    }
    createStatement(sql, padLeft) {
        if (sql) {
            const padding = ' '.repeat(padLeft);
            return `${padding}this.addSql('${sql.replace(/['\\]/g, '\\\'')}');\n`;
        }
        return '\n';
    }
    generateJSMigrationFile(className, diff) {
        let ret = `'use strict';\n`;
        ret += `Object.defineProperty(exports, '__esModule', { value: true });\n`;
        ret += `const Migration = require('@mikro-orm/migrations').Migration;\n\n`;
        ret += `class ${className} extends Migration {\n\n`;
        ret += `  async up() {\n`;
        diff.forEach(sql => ret += this.createStatement(sql, 4));
        ret += `  }\n\n`;
        ret += `}\n`;
        ret += `exports.${className} = ${className};\n`;
        return ret;
    }
    generateTSMigrationFile(className, diff) {
        let ret = `import { Migration } from '@mikro-orm/migrations';\n\n`;
        ret += `export class ${className} extends Migration {\n\n`;
        ret += `  async up(): Promise<void> {\n`;
        diff.forEach(sql => ret += this.createStatement(sql, 4));
        ret += `  }\n\n`;
        ret += `}\n`;
        return ret;
    }
}
exports.MigrationGenerator = MigrationGenerator;
