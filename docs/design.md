
# Cipher Arms Race

## 1. Project Objective
An interactive cybersecurity demonstration showing how
different encryption techniques withstand cryptographic
attacks.

## 2. Participants

- Alice: Encrypts and sends messages.
- Bob: Receives and decrypts messages.
- Eve: Intercepts ciphertext and attempts to break encryption.

## 3. Cryptographic Levels

### Level 1: Caesar Cipher
- Encryption: Shift cipher.
- Attack: Brute force (all 26 shifts).
- Visualization: Candidate plaintexts and recovered message.

### Level 2: Vigenere Cipher
- Encryption: Polyalphabetic substitution.
- Attack: Index of coincidence and frequency analysis.
- Visualization: Key-length chart and letter-by-letter key recovery.

### Level 3: One-Time Pad
- Encryption: XOR with a random key.
- Attack: Reused-key attack.
- Visualization: Partial plaintext recovery.

### Level 4: Toy RSA
- Encryption: RSA with small primes.
- Attack: Integer factorization.
- Visualization: Factoring time versus key size.

### Level 5: Modern Hybrid Encryption
- RSA-OAEP 2048-bit + AES-GCM.
- Attack: No practical attack demonstrated.
- Implementation: Browser Web Crypto API.

### Bonus: Man-in-the-Middle
- Attack: Public-key substitution.
- Lesson: Importance of public-key authentication.

## 4. Technology Stack

- HTML
- CSS
- JavaScript
- Node.js
- WebSockets
- Chart.js
- Web Crypto API
- JavaScript BigInt

## 5. Architecture

Encryption and decryption happen inside the browsers.

The relay server forwards ciphertext only.

Eve receives intercepted ciphertext and performs
attacks independently in her browser.

## 6. Development Strategy

Phase 1: Caesar and Vigenere without a server.
Phase 2: Alice, Bob and Eve chat using WebSockets.
Phase 3: One-Time Pad and Toy RSA.
Phase 4: Modern hybrid encryption.
Phase 5: MITM demonstration and final polish.

## 7. Security Considerations

- Never transmit plaintext through the relay.
- Never transmit secret encryption keys through the relay.
- Use textContent instead of innerHTML.
- Restrict message sizes.
- Rate-limit incoming messages.
- Use random, expiring room identifiers.
- Do not store chat messages on the server.

## 8. Project Limitations

This project is educational and uses intentionally
weak cryptographic algorithms in early levels.

It is not intended for protecting real secrets.
