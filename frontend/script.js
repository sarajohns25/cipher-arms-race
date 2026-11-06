
// =============================================
// CIPHER ARMS RACE
// LEVEL 1: CAESAR CIPHER
// =============================================

let currentCiphertext = "";
let currentShift = 0;


// ---------------------------------------------
// CAESAR ENCRYPTION AND DECRYPTION
// ---------------------------------------------

function caesarCipher(text, shift) {

    return text.split("").map(char => {

        if (char >= "A" && char <= "Z") {
            const code = char.charCodeAt(0) - 65;

            return String.fromCharCode(
                ((code + shift + 26) % 26) + 65
            );
        }

        if (char >= "a" && char <= "z") {
            const code = char.charCodeAt(0) - 97;

            return String.fromCharCode(
                ((code + shift + 26) % 26) + 97
            );
        }

        return char;

    }).join("");
}


// ---------------------------------------------
// CAESAR HTML ELEMENTS
// ---------------------------------------------

const plaintextInput = document.getElementById("plaintext");
const shiftInput = document.getElementById("shift");

const encryptButton = document.getElementById("encrypt-btn");
const decryptButton = document.getElementById("decrypt-btn");

const ciphertextOutput = document.getElementById("ciphertext");
const decryptedOutput = document.getElementById("decrypted");


// ---------------------------------------------
// ALICE: CAESAR ENCRYPTION
// ---------------------------------------------

encryptButton.addEventListener("click", () => {

    const plaintext = plaintextInput.value;
    const shift = Number(shiftInput.value);

    if (plaintext.length === 0) {
        ciphertextOutput.textContent = "Please enter a message.";
        return;
    }

    if (
        shiftInput.value.trim() === "" ||
        !Number.isInteger(shift) ||
        shift < 0 ||
        shift > 25
    ) {
        ciphertextOutput.textContent =
            "Please enter a shift between 0 and 25.";
        return;
    }

    currentShift = shift;

    currentCiphertext = caesarCipher(
        plaintext,
        currentShift
    );

    ciphertextOutput.textContent = currentCiphertext;

    // Reset Eve's Caesar console
    attackButton.disabled = false;
    attackButton.textContent = "Eve: Start Brute Force Attack";

    eveCiphertext.textContent = currentCiphertext;
    attackProgress.textContent = "Waiting for attack...";
    progressFill.style.width = "0%";

    attackResults.replaceChildren();

    recoveredMessage.textContent = "Not recovered yet.";

    decryptedOutput.textContent =
        "Waiting for Bob to decrypt...";
});


// ---------------------------------------------
// BOB: CAESAR DECRYPTION
// ---------------------------------------------

decryptButton.addEventListener("click", () => {

    if (currentCiphertext === "") {
        decryptedOutput.textContent =
            "No encrypted message available.";
        return;
    }

    const decryptedMessage = caesarCipher(
        currentCiphertext,
        -currentShift
    );

    decryptedOutput.textContent = decryptedMessage;
});


// =============================================
// EVE: CAESAR BRUTE FORCE ATTACK
// =============================================

// English letter frequencies
const englishFrequencies = [
    8.17, 1.49, 2.78, 4.25, 12.70, 2.23,
    2.02, 6.09, 6.97, 0.15, 0.77, 4.03,
    2.41, 6.75, 7.51, 1.93, 0.10, 5.99,
    6.33, 9.06, 2.76, 0.98, 2.36, 0.15,
    1.97, 0.07
];


function scoreEnglish(text) {

    const counts = new Array(26).fill(0);
    let total = 0;

    for (const char of text.toUpperCase()) {

        if (char >= "A" && char <= "Z") {
            counts[char.charCodeAt(0) - 65]++;
            total++;
        }
    }

    if (total === 0) return -Infinity;

    let chiSquared = 0;

    for (let i = 0; i < 26; i++) {

        const expected =
            total * englishFrequencies[i] / 100;

        const difference = counts[i] - expected;

        chiSquared +=
            (difference * difference) / (expected + 0.01);
    }

    const commonWords = [
        "THE", "AND", "HELLO", "WORLD",
        "THIS", "THAT", "YOU", "ARE",
        "ATTACK", "SECRET", "MESSAGE"
    ];

    let wordBonus = 0;

    const words = text.toUpperCase().match(/[A-Z]+/g) || [];

    for (const word of words) {

        if (commonWords.includes(word)) {
            wordBonus += 15;
        }
    }

    return -chiSquared + wordBonus;
}


// Pause helper
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// ---------------------------------------------
// CAESAR EVE HTML ELEMENTS
// ---------------------------------------------

const attackButton = document.getElementById("attack-btn");

const eveCiphertext =
    document.getElementById("eve-ciphertext");

const attackProgress =
    document.getElementById("attack-progress");

const progressFill =
    document.getElementById("progress-fill");

const attackResults =
    document.getElementById("attack-results");

const recoveredMessage =
    document.getElementById("recovered-message");


// ---------------------------------------------
// EVE: RUN CAESAR BRUTE FORCE
// ---------------------------------------------

attackButton.addEventListener("click", async () => {

    if (currentCiphertext === "") {

        eveCiphertext.textContent =
            "No intercepted ciphertext available.";

        return;
    }

    const intercepted = currentCiphertext;

    attackButton.disabled = true;
    attackButton.textContent = "Attack in progress...";

    eveCiphertext.textContent = intercepted;

    attackProgress.textContent =
        "Initializing brute force attack...";

    progressFill.style.width = "0%";

    attackResults.replaceChildren();

    recoveredMessage.textContent =
        "Analyzing candidates...";

    const candidates = [];

    for (let shift = 0; shift < 26; shift++) {

        const candidate = caesarCipher(
            intercepted,
            -shift
        );

        const score = scoreEnglish(candidate);

        candidates.push({
            shift,
            plaintext: candidate,
            score
        });

        const attempt = document.createElement("div");

        attempt.className = "attack-attempt";

        attempt.textContent =
            `Shift ${shift}: ${candidate} | Score: ${score.toFixed(2)}`;

        attackResults.appendChild(attempt);

        progressFill.style.width =
            `${((shift + 1) / 26) * 100}%`;

        attackProgress.textContent =
            `Testing shift ${shift + 1} of 26...`;

        await wait(100);
    }

    candidates.sort((a, b) => b.score - a.score);

    const bestCandidate = candidates[0];

    recoveredMessage.textContent =
        `${bestCandidate.plaintext} (Shift ${bestCandidate.shift})`;

    attackProgress.textContent =
        "Attack completed. All 26 shifts tested.";

    for (const row of attackResults.children) {

        if (
            row.textContent.startsWith(
                `Shift ${bestCandidate.shift}:`
            )
        ) {
            row.classList.add("success");
        }
    }

    attackButton.textContent = "Attack completed";
});


// =============================================
// LEVEL 2: VIGENERE CIPHER
// =============================================

let currentVigenereCiphertext = "";
let currentVigenereKey = "";


// IMPORTANT: Eve's intercepted message collection
const vigenereSamples = [];


// ---------------------------------------------
// VIGENERE ENCRYPTION AND DECRYPTION
// ---------------------------------------------

function vigenereCipher(text, key, decrypt = false) {

    key = key.toUpperCase();

    let keyIndex = 0;

    return text.split("").map(char => {

        if (!/[a-zA-Z]/.test(char)) {
            return char;
        }

        const isUppercase = char >= "A" && char <= "Z";

        const base = isUppercase ? 65 : 97;

        const textValue = char.charCodeAt(0) - base;

        const keyValue =
            key.charCodeAt(keyIndex % key.length) - 65;

        let result;

        if (decrypt) {
            result = (textValue - keyValue + 26) % 26;
        } else {
            result = (textValue + keyValue) % 26;
        }

        keyIndex++;

        return String.fromCharCode(result + base);

    }).join("");
}


// ---------------------------------------------
// VIGENERE HTML ELEMENTS
// ---------------------------------------------

const vigenerePlaintext =
    document.getElementById("vigenere-plaintext");

const vigenereKey =
    document.getElementById("vigenere-key");

const vigenereEncryptButton =
    document.getElementById("vigenere-encrypt-btn");

const vigenereDecryptButton =
    document.getElementById("vigenere-decrypt-btn");

const vigenereCiphertextOutput =
    document.getElementById("vigenere-ciphertext");

const vigenereDecryptedOutput =
    document.getElementById("vigenere-decrypted");


// ---------------------------------------------
// EVE VIGENERE HTML ELEMENTS
// ---------------------------------------------

const vigenereAttackButton =
    document.getElementById("vigenere-attack-btn");

const vigenereAttackStatus =
    document.getElementById("vigenere-attack-status");

const vigenereKeyProgress =
    document.getElementById("vigenere-key-progress");

const vigenereRecoveredKey =
    document.getElementById("vigenere-recovered-key");

const icChart =
    document.getElementById("ic-chart");

const vigenereRecoveredMessages =
    document.getElementById("vigenere-recovered-messages");


// ---------------------------------------------
// DISPLAY EVE'S INTERCEPTED MESSAGES
// ---------------------------------------------

function updateVigenereIntercepts() {

    const container = document.getElementById(
        "vigenere-intercepted"
    );

    const count = document.getElementById(
        "vigenere-sample-count"
    );

    count.textContent =
        `Messages collected: ${vigenereSamples.length}`;

    container.replaceChildren();

    vigenereSamples.forEach((message, index) => {

        const item = document.createElement("div");

        item.className = "intercepted-message";

        item.textContent =
            `Message ${index + 1}: ${message}`;

        container.appendChild(item);
    });
}


// ---------------------------------------------
// ALICE: VIGENERE ENCRYPTION
// ---------------------------------------------

vigenereEncryptButton.addEventListener("click", () => {

    const message = vigenerePlaintext.value;
    const key = vigenereKey.value.trim();

    if (!message.trim()) {

        vigenereCiphertextOutput.textContent =
            "Please enter a message.";

        return;
    }

    if (!/^[a-zA-Z]+$/.test(key)) {

        vigenereCiphertextOutput.textContent =
            "Key must contain English letters only.";

        return;
    }

    currentVigenereKey = key.toUpperCase();

    currentVigenereCiphertext = vigenereCipher(
        message,
        currentVigenereKey
    );

    vigenereCiphertextOutput.textContent =
        currentVigenereCiphertext;

    vigenereDecryptedOutput.textContent =
        "Waiting for Bob to decrypt...";

    // EVE INTERCEPTS THE CIPHERTEXT
    // This was missing in the previous file.

    vigenereSamples.push(currentVigenereCiphertext);

    updateVigenereIntercepts();

    // Reset Eve's attack display for new data
    vigenereAttackButton.disabled = false;

    vigenereAttackButton.textContent =
        "Eve: Analyze Vigenere Cipher";

    vigenereAttackStatus.textContent =
        "New ciphertext intercepted. Ready for analysis.";

    vigenereKeyProgress.textContent =
        "Waiting for key analysis...";

    vigenereRecoveredKey.textContent =
        "Not recovered yet.";

    icChart.replaceChildren();

    document.getElementById(
        "vigenere-key-letters"
    ).replaceChildren();

    vigenereRecoveredMessages.textContent =
        "Waiting for decryption...";
});


// ---------------------------------------------
// BOB: VIGENERE DECRYPTION
// ---------------------------------------------

vigenereDecryptButton.addEventListener("click", () => {

    if (!currentVigenereCiphertext) {

        vigenereDecryptedOutput.textContent =
            "No encrypted message available.";

        return;
    }

    const decryptedMessage = vigenereCipher(
        currentVigenereCiphertext,
        currentVigenereKey,
        true
    );

    vigenereDecryptedOutput.textContent =
        decryptedMessage;
});


// =============================================
// EVE: VIGENERE CRYPTANALYSIS ENGINE
// =============================================


// English letter frequencies
const vigenereEnglishFreq = [
    0.08167, 0.01492, 0.02782, 0.04253,
    0.12702, 0.02228, 0.02015, 0.06094,
    0.06966, 0.00153, 0.00772, 0.04025,
    0.02406, 0.06749, 0.07507, 0.01929,
    0.00095, 0.05987, 0.06327, 0.09056,
    0.02758, 0.00978, 0.02360, 0.00150,
    0.01974, 0.00074
];


// ---------------------------------------------
// HELPER: EXTRACT ENGLISH LETTERS
// ---------------------------------------------

function extractLetters(text) {

    return text.toUpperCase().replace(/[^A-Z]/g, "");
}


// ---------------------------------------------
// STAGE 1: INDEX OF COINCIDENCE
// ---------------------------------------------

function calculateIC(text) {

    const letters = extractLetters(text);

    const counts = new Array(26).fill(0);

    for (const char of letters) {

        counts[char.charCodeAt(0) - 65]++;
    }

    const n = letters.length;

    if (n < 2) return 0;

    let numerator = 0;

    for (const count of counts) {

        numerator += count * (count - 1);
    }

    return numerator / (n * (n - 1));
}


// ---------------------------------------------
// BUILD GROUPS FOR EACH KEY POSITION
// Key restarts at the beginning of each message.
// ---------------------------------------------

function buildVigenereGroups(samples, keyLength) {

    const groups = Array.from(
        { length: keyLength },
        () => ""
    );

    for (const sample of samples) {

        const letters = extractLetters(sample);

        for (let i = 0; i < letters.length; i++) {

            const position = i % keyLength;

            groups[position] += letters[i];
        }
    }

    return groups;
}


// ---------------------------------------------
// FIND THE MOST LIKELY KEY LENGTH
// ---------------------------------------------

function detectVigenereKeyLength(samples) {

    const results = [];

    const maxKeyLength = 12;

    for (let length = 1; length <= maxKeyLength; length++) {

        const groups = buildVigenereGroups(
            samples,
            length
        );

        if (groups.some(group => group.length < 20)) {
            continue;
        }

        const averageIC =
            groups.reduce(
                (sum, group) => sum + calculateIC(group),
                0
            ) / length;

        results.push({
            length,
            ic: averageIC
        });
    }

    if (results.length === 0) {

        return {
            bestLength: null,
            results: []
        };
    }

    const highestIC = Math.max(
        ...results.map(result => result.ic)
    );

    // Key-length multiples can also have high IC.
    // Prefer the shortest candidate near the strongest peak.

    const plausible = results.filter(
        result => result.ic >= highestIC * 0.90
    );

    plausible.sort((a, b) => a.length - b.length);

    return {
        bestLength: plausible[0].length,
        results
    };
}


// ---------------------------------------------
// STAGE 2: RECOVER ONE KEY LETTER
// Using chi-squared frequency analysis.
// ---------------------------------------------

function recoverKeyLetter(group) {

    const n = group.length;

    let bestShift = 0;
    let bestScore = Infinity;

    for (let shift = 0; shift < 26; shift++) {

        const counts = new Array(26).fill(0);

        for (const char of group) {

            const cipherValue = char.charCodeAt(0) - 65;

            const plainValue =
                (cipherValue - shift + 26) % 26;

            counts[plainValue]++;
        }

        let chiSquared = 0;

        for (let i = 0; i < 26; i++) {

            const expected =
                n * vigenereEnglishFreq[i];

            const difference =
                counts[i] - expected;

            chiSquared +=
                (difference * difference) /
                (expected + 0.01);
        }

        if (chiSquared < bestScore) {

            bestScore = chiSquared;

            bestShift = shift;
        }
    }

    return {
        letter: String.fromCharCode(65 + bestShift),
        shift: bestShift,
        score: bestScore
    };
}


// ---------------------------------------------
// DISPLAY RECOVERED KEY LETTERS
// ---------------------------------------------

function displayRecoveredLetters(recovered) {

    const container = document.getElementById(
        "vigenere-key-letters"
    );

    container.replaceChildren();

    recovered.forEach((item, index) => {

        const box = document.createElement("div");

        box.className = "key-letter";

        const letter = document.createElement("strong");

        letter.textContent = item.letter;

        const label = document.createElement("span");

        label.textContent = `Position ${index + 1}`;

        box.append(letter, label);

        container.appendChild(box);
    });
}


// ---------------------------------------------
// EVE: RUN COMPLETE VIGENERE ATTACK
// ---------------------------------------------

vigenereAttackButton.addEventListener("click", async () => {

    const samples = [...vigenereSamples];

    const totalLetters = samples.reduce(
        (sum, message) => sum + extractLetters(message).length,
        0
    );

    // Require enough ciphertext
    if (totalLetters < 200) {

        vigenereAttackStatus.textContent =
            `Insufficient ciphertext: ${totalLetters}/200 letters collected. Encrypt more messages using the same key.`;

        return;
    }

    vigenereAttackButton.disabled = true;

    vigenereAttackButton.textContent =
        "Analyzing...";

    icChart.replaceChildren();

    document.getElementById(
        "vigenere-key-letters"
    ).replaceChildren();

    vigenereRecoveredKey.textContent =
        "Analyzing...";

    vigenereRecoveredMessages.textContent =
        "Waiting for key recovery...";


    // -----------------------------------------
    // STAGE 1: DETECT KEY LENGTH
    // -----------------------------------------

    vigenereAttackStatus.textContent =
        "Calculating Index of Coincidence...";

    await wait(500);

    const detection = detectVigenereKeyLength(samples);

    if (detection.bestLength === null) {

        vigenereAttackStatus.textContent =
            "Not enough data for key-length analysis.";

        vigenereAttackButton.disabled = false;

        vigenereAttackButton.textContent =
            "Retry Attack";

        return;
    }


    // -----------------------------------------
    // DISPLAY IC RESULTS
    // -----------------------------------------

    const maxIC = Math.max(
        0.01,
        ...detection.results.map(item => item.ic)
    );

    detection.results.forEach(result => {

        const row = document.createElement("div");

        row.className = "ic-row";

        if (result.length === detection.bestLength) {
            row.classList.add("best");
        }

        const label = document.createElement("span");

        label.textContent =
            `Length ${result.length}`;

        const track = document.createElement("div");

        track.className = "ic-bar-track";

        const bar = document.createElement("div");

        bar.className = "ic-bar";

        bar.style.width =
            `${(result.ic / maxIC) * 100}%`;

        track.appendChild(bar);

        const value = document.createElement("span");

        value.textContent =
            result.ic.toFixed(4);

        row.append(label, track, value);

        icChart.appendChild(row);
    });

    vigenereAttackStatus.textContent =
        `Most likely key length: ${detection.bestLength}`;

    await wait(700);


    // -----------------------------------------
    // STAGE 2: RECOVER KEY LETTERS
    // -----------------------------------------

    vigenereKeyProgress.textContent =
        "Analyzing each key position...";

    const groups = buildVigenereGroups(
        samples,
        detection.bestLength
    );

    const recovered = [];

    for (let i = 0; i < groups.length; i++) {

        const result = recoverKeyLetter(groups[i]);

        recovered.push(result);

        displayRecoveredLetters(recovered);

        vigenereKeyProgress.textContent =
            `Recovering key letter ${i + 1} of ${groups.length}...`;

        await wait(400);
    }


    // -----------------------------------------
    // FINAL RECOVERED KEY
    // -----------------------------------------

    const recoveredKey = recovered
        .map(item => item.letter)
        .join("");

    vigenereRecoveredKey.textContent =
        recoveredKey;

    vigenereKeyProgress.textContent =
        "Key recovery completed.";


    // -----------------------------------------
    // DECRYPT INTERCEPTED MESSAGES
    // -----------------------------------------

    vigenereRecoveredMessages.replaceChildren();

    samples.forEach((ciphertext, index) => {

        const plaintext = vigenereCipher(
            ciphertext,
            recoveredKey,
            true
        );

        const result = document.createElement("div");

        result.className = "recovered-message";

        result.textContent =
            `Message ${index + 1}: ${plaintext}`;

        vigenereRecoveredMessages.appendChild(result);
    });


    // -----------------------------------------
    // FINISH ATTACK
    // -----------------------------------------

    vigenereAttackButton.textContent =
        "Attack completed";

    vigenereAttackButton.disabled = false;

});
