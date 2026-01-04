const enc = new TextEncoder();

function toBase64(bytes: Uint8Array) {
    let s = "";
    bytes.forEach((b) => (s += String.fromCharCode(b)));
    return btoa(s);
}
function fromBase64(b64: string) {
    const s = atob(b64);
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
}

export async function pbkdf2Hash(password: string, saltB64: string) {
    const salt = fromBase64(saltB64);

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt,
            iterations: 210_000,
            hash: "SHA-256",
        },
        keyMaterial,
        256
    );

    return toBase64(new Uint8Array(bits));
}

// comparación “constant-ish time”
export function safeEqual(a: string, b: string) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

// util para generar salt cuando quieras crear un usuario demo
export function makeSaltB64() {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return toBase64(salt);
}
