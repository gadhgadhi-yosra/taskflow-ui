const { auth, db } = require("../config/firebase");

// Helper: Get full user profile from Firestore + Auth
const getUserProfile = async (uid) => {
  const userRecord = await auth.getUser(uid);
  const doc = await db.collection("users").doc(uid).get();

  const firestoreData = doc.exists ? doc.data() : {};
  return {
    uid,
    email: userRecord.email,
    name: userRecord.displayName || firestoreData.name,
    emailVerified: userRecord.emailVerified,
    createdAt: firestoreData.createdAt?.toDate() || userRecord.metadata.creationTime,
    photoURL: userRecord.photoURL || null,
  };
};

// POST /api/auth/signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Signup request:", { name, email, password: "******" });

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are required" });
  }

  try {
    const userRecord = await auth.createUser({ email, password, displayName: name });
    const uid = userRecord.uid;

    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date(),
    });

    const customToken = await auth.createCustomToken(uid);

    const profile = {
      uid,
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      message: "User created",
      user: profile,
      token: customToken,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
};

// SIGN IN
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    // Verify user exists
    const userRecord = await auth.getUserByEmail(email);

    // Generate custom token (client will sign in with email/password via SDK)
    const customToken = await auth.createCustomToken(userRecord.uid);

    // Return full user profile
    const profile = await getUserProfile(userRecord.uid);

    res.json({
      message: "Login ready — use Firebase SDK to sign in with email/password",
      user: profile,
      token: customToken,
      warning: "For production: Use client SDK signInWithEmailAndPassword()",
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid email or password" });
  }
};

// Verify JWT (ID Token)
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = await getUserProfile(decoded.uid); // Attach full profile
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// LOGOUT - Revoke all refresh tokens (forces re-login)
const logout = async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = await auth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Revoke all refresh tokens for this user
    await auth.revokeRefreshTokens(uid);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { signup, signin, verifyToken, logout };

