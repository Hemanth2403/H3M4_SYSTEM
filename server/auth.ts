import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { log } from "./utils";

declare global {
    namespace Express {
        interface User extends SelectUser { }
    }
}

export function setupAuth(app: Express) {
    log("Initializing Passport/Session...", "auth");
    const sessionSettings: session.SessionOptions = {
        secret: "h3m4_ecosystem_secret_key_2026",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            secure: false, // set to true if using https
            sameSite: "lax",
        },
    };

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await storage.getUserByUsername(username);
                if (!user || user.password !== password) {
                    return done(null, false, { message: "Invalid username or password" });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }),
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.post("/api/register", async (req, res) => {
        try {
            log(`Registration attempt: ${req.body.username}`, "auth");
            const existingUser = await storage.getUserByUsername(req.body.username);
            if (existingUser) {
                log(`Username already exists: ${req.body.username}`, "auth");
                return res.status(400).send("Username already exists");
            }

            const user = await storage.createUser(req.body);
            log(`User created successfully: ${user.username}`, "auth");
            req.login(user, (err) => {
                if (err) {
                    log(`Session login error: ${err.message}`, "auth");
                    return res.status(500).send(err.message);
                }
                res.status(201).json(user);
            });
        } catch (err: any) {
            log(`Registration error: ${err.message}`, "auth");
            res.status(400).send(err.message);
        }
    });

    app.post("/api/login", passport.authenticate("local"), (req, res) => {
        res.json(req.user);
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });
}
