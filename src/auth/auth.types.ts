export type AuthUser = {
    username: string;
    displayName: string;
};

export type DemoCredential = {
    username: string;
    saltB64: string;
    passwordHashB64: string;
    displayName: string;
};
