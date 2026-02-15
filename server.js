require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const os = require("os");
const { db, stmts } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: process.env.SESSION_SECRET || "stack-game-change-this",
  resave: false, saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 30*24*60*60*1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((u, d) => d(null, u.id));
passport.deserializeUser((id, d) => { d(null, stmts.findUserById.get(id) || null); });

function findOrCreate(prov, prof) {
  let u = stmts.findUser.get(prov, prof.id);
  if (!u) {
    const r = stmts.createUser.run(prov, prof.id, prof.displayName || "Player", prof.emails?.[0]?.value || null, prof.photos?.[0]?.value || null);
    u = stmts.findUserById.get(r.lastInsertRowid);
  } else {
    stmts.updateProfile.run(prof.displayName || u.display_name, prof.emails?.[0]?.value || u.email, prof.photos?.[0]?.value || u.avatar_url, u.id);
    u = stmts.findUserById.get(u.id);
  }
  return u;
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const G = require("passport-google-oauth20").Strategy;
  passport.use(new G({ clientID: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, callbackURL: `${BASE_URL}/auth/google/callback` },
    (a, r, p, d) => d(null, findOrCreate("google", p))));
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/?auth=failed" }), (q, r) => r.redirect("/?auth=success"));
  console.log("  Google OAuth ready");
} else console.log("  Google not configured");

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  const L = require("passport-linkedin-oauth2").Strategy;
  passport.use(new L({ clientID: process.env.LINKEDIN_CLIENT_ID, clientSecret: process.env.LINKEDIN_CLIENT_SECRET, callbackURL: `${BASE_URL}/auth/linkedin/callback`, scope: ["openid", "profile", "email"] },
    (a, r, p, d) => d(null, findOrCreate("linkedin", p))));
  app.get("/auth/linkedin", passport.authenticate("linkedin"));
  app.get("/auth/linkedin/callback", passport.authenticate("linkedin", { failureRedirect: "/?auth=failed" }), (q, r) => r.redirect("/?auth=success"));
  console.log("  LinkedIn OAuth ready");
} else console.log("  LinkedIn not configured");

const anonFind = db.prepare("SELECT * FROM users WHERE provider='anon' AND provider_id=?");
const anonUpdate = db.prepare("UPDATE users SET display_name=?, best_score=MAX(best_score,?), games_played=games_played+1, total_perfects=total_perfects+?, best_combo=MAX(best_combo,?), total_score=total_score+?, xp=xp+?, updated_at=CURRENT_TIMESTAMP WHERE id=?");

function getAnon(devId, name) {
  let u = anonFind.get(devId);
  if (!u) { const r = stmts.createUser.run("anon", devId, name || "Player", null, null); u = stmts.findUserById.get(r.lastInsertRowid); }
  return u;
}

app.get("/api/check-name", (req, res) => {
  const name = (req.query.name || "").trim();
  if (!name || name.length < 2) return res.json({ available: false });
  if (name === "Guest" || name === "Player") return res.json({ available: false });
  const existing = db.prepare("SELECT id FROM users WHERE LOWER(display_name)=LOWER(?)").get(name);
  const userId = req.query.deviceId ? (anonFind.get(req.query.deviceId)?.id || -1) : -1;
  if (existing && existing.id !== userId) return res.json({ available: false });
  res.json({ available: true });
});

app.post("/api/score", (req, res) => {
  const { score, maxCombo, perfects, zone, xpEarned, deviceId, playerName } = req.body;
  if (typeof score !== "number" || score < 0) return res.status(400).json({ error: "Invalid" });
  let user = req.user || (deviceId ? getAnon(deviceId, playerName || "Player") : null);
  if (!user) return res.status(400).json({ error: "Need deviceId" });
  let finalName = user.display_name;
  if (playerName && playerName !== "Guest" && playerName !== user.display_name) {
    const taken = db.prepare("SELECT id FROM users WHERE LOWER(display_name)=LOWER(?) AND id!=?").get(playerName, user.id);
    if (!taken) finalName = playerName;
  }
  stmts.insertScore.run(user.id, score, maxCombo || 0, perfects || 0, zone || "");
  anonUpdate.run(finalName, score, perfects || 0, maxCombo || 0, score, xpEarned || 0, user.id);
  res.json({ success: true });
});

app.post("/api/sync", (req, res) => {
  const { scores, deviceId, playerName } = req.body;
  if (!Array.isArray(scores) || !deviceId) return res.status(400).json({ error: "Invalid" });
  const user = getAnon(deviceId, playerName || "Player");
  let synced = 0;
  for (const s of scores) {
    if (typeof s.score === "number" && s.score >= 0) {
      stmts.insertScore.run(user.id, s.score, s.maxCombo || 0, s.perfects || 0, s.zone || "");
      anonUpdate.run(playerName || user.display_name, s.score, s.perfects || 0, s.maxCombo || 0, s.score, s.xpEarned || 0, user.id);
      synced++;
    }
  }
  res.json({ success: true, synced });
});

app.get("/api/leaderboard", (req, res) => {
  const rows = stmts.getLeaderboard.all();
  res.json({ leaderboard: rows.filter(r => r.best_score > 0).map(r => ({ id: r.id, name: r.display_name, score: r.best_score, xp: r.xp })) });
});

app.get("/api/me", (req, res) => {
  if (!req.user) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, user: { id: req.user.id, name: req.user.display_name, bestScore: req.user.best_score } });
});

app.get("/api/auth-providers", (req, res) => {
  res.json({ google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), linkedin: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET), apple: false });
});

app.post("/auth/logout", (req, res) => { req.logout(() => { req.session.destroy(); res.json({ success: true }); }); });
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

function getLocalIP() { const n = os.networkInterfaces(); for (const k of Object.keys(n)) for (const i of n[k]) if (i.family === "IPv4" && !i.internal) return i.address; return "localhost"; }

app.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIP();
  console.log(`\n  STACK Server — by bbmw0\n  Local:   http://localhost:${PORT}\n  Network: http://${ip}:${PORT}\n`);
});
