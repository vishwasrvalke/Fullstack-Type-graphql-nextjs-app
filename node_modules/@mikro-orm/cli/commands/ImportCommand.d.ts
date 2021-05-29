import { Arguments, CommandModule } from 'yargs';
export declare class ImportCommand implements CommandModule {
    command: string;
    describe: string;
    /**
     * @inheritdoc
     */
    handler(args: Arguments): Promise<void>;
}
