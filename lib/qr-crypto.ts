import crypto from "crypto";

const QR_SECRET = process.env.QR_HMAC_SECRET || "artisan_cafe_secret_key_2026_x89a";

export interface QrTokenPayload {
  tableNumber: number;
  tableId: string;
  tableSecretSalt: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Encodes and signs an ephemeral table session token
 */
export function generateSignedTableToken(
  tableId: string,
  tableNumber: number,
  tableSecretSalt: string,
  ttlHours = 8
): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + ttlHours * 3600;

  const payload: QrTokenPayload = {
    tableNumber,
    tableId,
    tableSecretSalt,
    issuedAt,
    expiresAt,
  };

  const serialized = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", QR_SECRET)
    .update(`${serialized}.${tableSecretSalt}`)
    .digest("base64url");

  return `${serialized}.${signature}`;
}

/**
 * Validates token signature, expiration and salt match
 */
export function verifyTableToken(
  tokenString: string,
  currentTableSalt: string
): { valid: boolean; payload?: QrTokenPayload; error?: string } {
  try {
    if (!tokenString) {
      return { valid: false, error: "Missing session token" };
    }

    const parts = tokenString.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "Invalid token format" };
    }

    const [serialized, receivedSignature] = parts;

    // Verify cryptographic signature against current table secret salt
    const expectedSignature = crypto
      .createHmac("sha256", QR_SECRET)
      .update(`${serialized}.${currentTableSalt}`)
      .digest("base64url");

    if (receivedSignature !== expectedSignature) {
      return { valid: false, error: "QR code has been rotated or signature is invalid." };
    }

    const payload: QrTokenPayload = JSON.parse(
      Buffer.from(serialized, "base64url").toString("utf8")
    );

    const now = Math.floor(Date.now() / 1000);
    if (now > payload.expiresAt) {
      return { valid: false, error: "Table session expired. Please scan fresh QR code." };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "Corrupted table session token." };
  }
}

