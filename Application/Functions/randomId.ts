export function randomString(length: number, chars: String) {
    let result = "";
    for (let i: number = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function generateDatabaseIdString() {
    let result = "";
    const CHARS =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const LENGTH = 24;

    for (let i: number = LENGTH; i > 0; --i)
        result += CHARS[Math.floor(Math.random() * CHARS.length)];

    return result;
}
