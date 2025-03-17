let users = {}; // Store email and fingerprint credentials

async function registerFingerprint() {
    let email = document.getElementById("registerEmail").value;
    if (!email) {
        document.getElementById("status").innerText = "Enter an email to register.";
        return;
    }

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
                    id: new TextEncoder().encode(email), // Use email as unique ID
                    name: email,
                    displayName: email,
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

        users[email] = credential; // Store the credential for the email
        document.getElementById("status").innerText = "Fingerprint registered successfully!";
        console.log("Saved fingerprint for:", email, credential);
    } catch (error) {
        console.error("Registration failed:", error);
        document.getElementById("status").innerText = "Registration failed. Try again.";
    }
}

async function verifyFingerprint() {
    let email = document.getElementById("loginEmail").value;
    if (!email || !users[email]) {
        document.getElementById("status").innerText = "No fingerprint registered for this email.";
        return;
    }

    try {
        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32),
                timeout: 60000,
            },
        });

        if (users[email] && users[email].id === credential.id) {
            document.getElementById("status").innerText = "Fingerprint matched! Login successful.";
        } else {
            document.getElementById("status").innerText = "Fingerprint did not match. Try again.";
        }
    } catch (error) {
        console.error("Login failed:", error);
        document.getElementById("status").innerText = "Login failed. Try again.";
    }
}
