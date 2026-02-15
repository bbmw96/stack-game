require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const os = require("os");
const { stmts } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ═══ Middleware ═══
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "stack-game-change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ═══ Passport ═══
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = stmts.findUserById.get(id);
  done(null, user || null);
});

function findOrCreateUser(provider, profile) {
  let user = stmts.findUser.get(provider, profile.id);
  if (!user) {
    const result = stmts.createUser.run(
      provider, profile.id,
      profile.displayName || "Player",
      profile.emails?.[0]?.value || null,
      profile.photos?.[0]?.value || null
    );
    user = stmts.findUserById.get(result.lastInsertRowid);
  } else {
    stmts.updateProfile.run(
      profile.displayName || user.display_name,
      profile.emails?.[0]?.value || user.email,
      profile.photos?.[0]?.value || user.avatar_url,
      user.id
    );
    user = stmts.findUserById.get(user.id);
  }
  return user;
}

// ═══ Google OAuth ═══
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy = require("passport-google-oauth20").Strategy;
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/google/callback`,
  }, (a, r, profile, done) => done(null, findOrCreateUser("google", profile))));
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/?auth=failed" }),
    (req, res) => res.redirect("/?auth=success"));
  console.log("  ✅ Google OAuth ready");
} else {
  console.log("  ⚠️  Google OAuth not configured");
}

// ═══ LinkedIn OAuth ═══
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/linkedin/callback`,
    scope: ["openid", "profile", "email"],
  }, (a, r, profile, done) => done(null, findOrCreateUser("linkedin", profile))));
  app.get("/auth/linkedin", passport.authenticate("linkedin"));
  app.get("/auth/linkedin/callback",
    passport.authenticate("linkedin", { failureRedirect: "/?auth=failed" }),
    (req, res) => res.redirect("/?auth=success"));
  console.log("  ✅ LinkedIn OAuth ready");
} else {
  console.log("  ⚠️  LinkedIn OAuth not configured");
}

// ═══ API Routes ═══
app.get("/api/me", (req, res) => {
  if (!req.user) return res.json({ loggedIn: false });
  const u = req.user;
  res.json({ loggedIn: true, user: {
    id: u.id, name: u.display_name, email: u.email, avatar: u.avatar_url,
    provider: u.provider, bestScore: u.best_score, gamesPlayed: u.games_played,
    totalPerfects: u.total_perfects, bestCombo: u.best_combo,
    totalScore: u.total_score, xp: u.xp,
    achievements: JSON.parse(u.achievements || "[]"),
  }});
});

app.post("/api/score", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  const { score, maxCombo, perfects, zone, xpEarned, achievements } = req.body;
  if (typeof score !== "number" || score < 0) return res.status(400).json({ error: "Invalid" });
  stmts.insertScore.run(req.user.id, score, maxCombo || 0, perfects || 0, zone || "");
  const merged = [...new Set([...JSON.parse(req.user.achievements || "[]"), ...(achievements || [])])];
  stmts.updateStats.run(score, perfects || 0, maxCombo || 0, score, xpEarned || 0, JSON.stringify(merged), req.user.id);
  const updated = stmts.findUserById.get(req.user.id);
  res.json({ success: true, user: { bestScore: updated.best_score, gamesPlayed: updated.games_played, xp: updated.xp }});
});

app.get("/api/leaderboard", (req, res) => {
  const rows = stmts.getLeaderboard.all();
  res.json({ leaderboard: rows.map(r => ({ id: r.id, name: r.display_name, score: r.best_score, xp: r.xp })) });
});

app.get("/api/auth-providers", (req, res) => {
  res.json({
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    linkedin: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
    apple: false,
  });
});

app.post("/auth/logout", (req, res) => {
  req.logout(() => { req.session.destroy(); res.json({ success: true }); });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// ═══ Get local IP for network access ═══
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "localhost";
}

// ═══ Start — bind to 0.0.0.0 so other devices can connect ═══
app.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIP();
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🏗️  STACK Game Server — by bbmw0                     ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  ✅ On this computer:  http://localhost:${PORT}           ║
║  ✅ On your iPhone:    http://${ip}:${PORT}       ║
║  ✅ Anyone on WiFi:    http://${ip}:${PORT}       ║
║                                                       ║
║  To share worldwide, deploy to Render.com (free)      ║
║  See DEPLOY.md for step-by-step instructions          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
