# The Year, Unbound — Setup Guide

Hosting the storyboard on GitHub gives you a personal web address that works on any device,
installs on your phone like an app, keeps working offline, and backs up to Google Sheets.
The whole setup is about 15 minutes, once.

Your writing is never stored on GitHub — the files you upload are just the empty app.
Your work lives in your browser's autosave, your "Save as HTML" snapshots, and your Google Sheet.

---

## Part 1 — Host the app on GitHub Pages

**What you need:** the five files in this bundle — `index.html`, `sw.js`, `manifest.json`,
`icon-192.png`, `icon-512.png`.

1. Go to **github.com** and sign up (free) if you don't have an account.
2. Click the **+** in the top-right corner → **New repository**.
3. Name it `mobius-storyboard` (or anything you like). Leave it **Public**.
   Tick **Add a README file**, then click **Create repository**.
4. On the repository page, click **Add file → Upload files**.
5. Drag in all five files from this bundle, then click **Commit changes**.
6. Go to **Settings** (tab at the top of the repo) → **Pages** (left-hand menu).
7. Under **Build and deployment**, set Source to **Deploy from a branch**,
   Branch to **main** and folder **/ (root)**. Click **Save**.
8. Wait a minute or two, then refresh the Pages screen — it will show your address:

   `https://YOUR-USERNAME.github.io/mobius-storyboard/`

9. Open that address. That's your app, live.

**Updating later:** when you get a new version of `index.html`, go to the repo →
click `index.html` → the pencil icon (or Upload files again) → replace it → Commit.
The site updates itself within a minute or two.

> "Public repository" means someone who found the address could open the *empty app* —
> not your writing. If even that bothers you, GitHub allows Pages on private repos
> with a free account too via the same Settings → Pages steps.

---

## Part 2 — Install it on your phone (works offline)

Open your GitHub Pages address on the phone **once while online** — this first visit
downloads and caches everything, including the 3D library and fonts.

**Android (Chrome):** menu (⋮) → **Add to Home screen** → **Install**.
**iPhone/iPad (Safari):** Share button → **Add to Home Screen**.

You now have an icon that opens full-screen like a normal app.

**Offline behaviour:**
- Everything works offline after that first online visit: writing, dictation via the
  keyboard microphone, reading, notes, the 3D loop, autosave, Save as HTML.
- The only things that need a connection are Google Sheets backups and, on some
  Android phones, the in-app Dictate button (the keyboard mic key usually works offline).
- If you somehow open the app offline before it has ever been online, the 3D loop
  shows a friendly notice but every writing feature still works.

**Important:** autosave is *per browser, per device*. Your phone and your PC each keep
their own autosave. To move work between them, use **Save as HTML** (or the Sheets backup)
on one device and open it on the other. Make Save as HTML your end-of-session habit.

---

## Part 3 — Connect Google sync (two-way, automatic)

This turns Google into the bridge between your devices. The full project — including
images — is stored as a private file in **your own Google Drive**, and the sheet keeps
a human-readable text copy alongside it.

1. Go to **sheets.new** and name the sheet (e.g. *Storyboard sync*).
2. In the sheet: **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the script shown inside the app under
   **Sync & backup (Google) → One-time setup**. Press the save icon.
4. Click **Deploy → New deployment** → gear icon → **Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
6. Authorise when asked: choose your account → **Advanced** →
   **Go to (project name) (unsafe)** → **Allow**. (It says "unsafe" only because you
   wrote the script yourself rather than a verified company.)
7. Copy the **Web app URL**.
8. In the storyboard app on **each device**: Loop tab → Sync & backup → paste the URL
   → tick **Auto-sync** → press **Sync now** once.

**Already using the older backup-only script?** Paste the new code over the old,
then **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.
The URL stays the same, so you don't need to re-paste it anywhere.

### How the automation works

- Every change you make is autosaved locally, then pushed to Google a few seconds later
  (when Auto-sync is on).
- Every time you open the app, it checks Google first — if another device has newer
  work, this device updates itself before you start.
- **Sync now** does both on demand: pull anything newer, otherwise push.
- Offline? Everything keeps working locally; sync catches up after your next change
  once you're back online.

### The one rule of sync

Newest wins. If you edit on the phone and the laptop *at the same time* without
syncing between, whichever device syncs last overwrites the other's unsynced changes.
In practice: finish on one device before picking up the other, and let the app open
fully (so it can pull) before you start typing. The Backups tab in your sheet logs
every sync, and Save as HTML snapshots remain your deep history if you ever need
to step back.

---

## Your safety net, summarised

| Layer | What it holds | When |
|---|---|---|
| Autosave | Everything, incl. images | Automatic, per device |
| Save as HTML | Everything, incl. images, portable | End of each session |
| Google sync | Everything, incl. images, across devices | Automatic with Auto-sync on |
| Google Sheet tabs | All text, readable anywhere | Refreshed on every sync |

If anything in this guide doesn't match what you see on screen (Google and GitHub
move their buttons around from time to time), describe where you're stuck and
I'll walk you through it.
