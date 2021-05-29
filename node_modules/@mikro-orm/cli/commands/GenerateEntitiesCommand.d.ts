import yargs, { Arguments, Argv, CommandModule } from 'yargs';
export declare type Options = {
    dump: boolean;
    save: boolean;
    path: string;
};
export declare class GenerateEntitiesCommand<U extends Options = Options> implements CommandModule<unknown, U> {
    command: string;
    describe: string;
    /**
     * @inheritdoc
     */
    builder(args: Argv): yargs.Argv<U>;
    /**
     * @inheritdoc
     */
    handler(args: Arguments<U>): Promise<void>;
}
