import { CommandModule } from 'yargs';
export declare class DebugCommand implements CommandModule {
    command: string;
    describe: string;
    /**
     * @inheritdoc
     */
    handler(): Promise<void>;
    private static checkPaths;
}
