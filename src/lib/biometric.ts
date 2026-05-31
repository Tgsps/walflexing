// Face ID / Touch ID عبر WebAuthn (platform authenticator). اختياري بالكامل.
// المعرّف يُحفظ محلياً لهذا الجهاز فقط (مو ضمن بيانات التطبيق المُصدّرة).
const CRED_KEY = 'biometric_cred_v1';

function bufToB64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
function b64ToBuf(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

export async function biometricAvailable(): Promise<boolean> {
  try {
    return (
      typeof window.PublicKeyCredential !== 'undefined' &&
      (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
    );
  } catch {
    return false;
  }
}

export function hasBiometricCredential(): boolean {
  return !!localStorage.getItem(CRED_KEY);
}

export function clearBiometric(): void {
  localStorage.removeItem(CRED_KEY);
}

export async function registerBiometric(userName: string): Promise<boolean> {
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));
    const cred = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'عازب إسطنبول' },
        user: { id: userId, name: userName || 'user', displayName: userName || 'user' },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      },
    })) as PublicKeyCredential | null;
    if (!cred) return false;
    localStorage.setItem(CRED_KEY, bufToB64(cred.rawId));
    return true;
  } catch {
    return false;
  }
}

export async function verifyBiometric(): Promise<boolean> {
  try {
    const id = localStorage.getItem(CRED_KEY);
    if (!id) return false;
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{ id: b64ToBuf(id), type: 'public-key' }],
        userVerification: 'required',
        timeout: 60000,
      },
    });
    return !!assertion;
  } catch {
    return false;
  }
}
