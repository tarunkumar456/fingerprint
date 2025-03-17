let fingerprintDB = []; // Temporary storage

async function registerFingerprint() {
    if (!window.PublicKeyCredential) {
        document.getElementById("status").innerText = "WebAuthn is not supported in this browser.";
        return;
    }

    try {
        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: new Uint8Array(32), 
                rp: { name: "Local App" },
                user: {
                    id: new Uint8Array(16),
                    name: "test-user",
                    displayName: "Test User",
                },
                pubKeyCredParams: [
                    { type: "public-key", alg: -7 },    // ES256
                    { type: "public-key", alg: -257 }  // RS256
                ],
                authenticatorSelection: { authenticatorAttachment: "platform" },
                timeout: 60000,
                attestation: "direct",
            },
        });

        fingerprintDB.push(credential); // Save in memory
        document.getElementById("status").innerText = "Fingerprint registered successfully!";
        console.log("Saved fingerprint:", credential);
    } catch (error) {
        console.error("Registration failed:", error);
        document.getElementById("status").innerText = "Registration failed. Try again.";
    }
}

async function verifyFingerprint() {
    if (!window.PublicKeyCredential) {
        document.getElementById("status").innerText = "WebAuthn is not supported in this browser.";
        return;
    }

    try {
        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32),
                timeout: 60000,
            },
        });

        if (fingerprintDB.some(fp => fp.id === credential.id)) {
            document.getElementById("status").innerText = "Fingerprint matched! Login successful.";
        } else {
            document.getElementById("status").innerText = "Fingerprint did not match. Try again.";
        }
    } catch (error) {
        console.error("Login failed:", error);
        document.getElementById("status").innerText = "Login failed. Try again.";
    }
}
