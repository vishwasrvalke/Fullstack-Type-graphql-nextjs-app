export declare class Logger {
    private readonly logger;
    debugMode: boolean | LoggerNamespace[];
    constructor(logger: (message: string) => void, debugMode?: boolean | LoggerNamespace[]);
    /**
     * Logs a message inside given namespace.
     */
    log(namespace: LoggerNamespace, message: string): void;
    /**
     * Sets active namespaces. Pass `true` to enable all logging.
     */
    setDebugMode(debugMode: boolean | LoggerNamespace[]): void;
    isEnabled(namespace: LoggerNamespace): boolean;
}
export declare type LoggerNamespace = 'query' | 'query-params' | 'discovery' | 'info';
