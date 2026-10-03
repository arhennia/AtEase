const encoder = new TextEncoder();

export function razorpayKeys() {
  const keyId = Deno.env.get('RAZORPAY_KEY_ID') ?? '';
  const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
  const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') ?? '';
  const allowLive = Deno.env.get('RAZORPAY_ALLOW_LIVE') === 'true';
  return { keyId, keySecret, webhookSecret, allowLive };
}

export function keysAreUsable(keys: { keyId: string; keySecret: string; allowLive: boolean }) {
  if (!keys.keyId || !keys.keySecret) return 'Razorpay is not configured.';
  if (!keys.allowLive && !keys.keyId.startsWith('rzp_test_')) {
    return 'Test mode keys are required.';
  }
  return '';
}

export async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function safeEqual(left: string, right: string) {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function razorpayRequest(path: string, keyId: string, keySecret: string, body?: unknown) {
  const token = btoa(`${keyId}:${keySecret}`);
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const description = payload?.error?.description || 'Razorpay request failed.';
    throw new Error(description);
  }
  return payload;
}

export function paymentMatchesOrder(
  payment: Record<string, unknown>,
  orderId: string,
  amountPaise: number,
) {
  return (
    payment?.id &&
    payment.order_id === orderId &&
    payment.currency === 'INR' &&
    Number(payment.amount) === amountPaise &&
    payment.status === 'captured'
  );
}
