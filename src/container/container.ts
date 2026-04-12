interface Container {
    get<T>(token: symbol): T;
    register<T>(token: symbol, factory: () => T): void;
}

export class DIContainer implements Container {
    private services = new Map<symbol, unknown>();
    private factories = new Map<symbol, () => unknown>();

    register<T>(token: symbol, factory: () => T): void {
        this.factories.set(token, factory);
    }

    get<T>(token: symbol): T {
        if (this.services.has(token)) {
            return this.services.get(token) as T;
        }

        const factory = this.factories.get(token);
        if (!factory) {
            throw new Error(`Service not registered: ${token.toString()}`);
        }

        const service = factory();
        this.services.set(token, service);
        return service as T;
    }
}

// Service tokens
export const TOKENS = {
    SubscriptionService: Symbol("SubscriptionService"),
    SubscriptionRepository: Symbol("SubscriptionRepository"),
    EmailService: Symbol("EmailService"),
    GithubService: Symbol("GithubService"),
    Logger: Symbol("Logger"),
} as const;

export const container = new DIContainer();
