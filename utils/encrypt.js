const crypto = require("crypto");
const secret = process.env.ENCRYPTION_SECRET;

function encrypt(text) {
  // Derive a 32-byte key from the secret
  const key = crypto.createHash("sha256").update(secret).digest();
  // Use a fixed IV for simplicity, but in production use a random IV and store it with the ciphertext
  const iv = Buffer.alloc(16, 0); // 16 bytes IV for AES-256-CTR
  const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

module.exports = { encrypt };
