# HOSTINGER DEPLOYMENT ANLEITUNG

Diese Anleitung zeigt dir Schritt-für-Schritt, wie du deine 11F OS CRM App auf Hostinger hostest.

## 📝 Voraussetzungen

- Hostinger Hosting-Plan mit:
  - MySQL Datenbank Zugang
  - Node.js Support (oder nutze Vercel für Frontend)
  - SSH-Zugang (optional, aber empfohlen)
- GitHub Account
- Deine Seite läuft lokal ohne Fehler

## 🗄️ Teil 1: Hostinger MySQL Datenbank einrichten

### Schritt 1: Datenbank erstellen

1. Login auf [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Wähle deine Domain/Hosting
3. Navigiere zu **Datenbanken** → **MySQL Datenbanken**
4. Klicke auf **Neue Datenbank erstellen**

### Schritt 2: Datenbank-Details notieren

Nach der Erstellung siehst du:

```
Hostname: 127.0.0.1 (oder localhost)
Port: 3306
Username: u123456789_dbuser
Password: [dein gewähltes Passwort]
Datenbankname: u123456789_11f_crm
```

**WICHTIG:** Speichere diese Daten sicher!

### Schritt 3: Prisma Schema für MySQL anpassen

Öffne `prisma/schema.prisma` und ändere:

```prisma
datasource db {
  provider = "mysql"  // ← ÄNDERE VON "postgresql" zu "mysql"
  url      = env("DATABASE_URL")
}
```

### Schritt 4: Connection String erstellen

Deine `DATABASE_URL` für Hostinger:

```env
DATABASE_URL="mysql://u123456789_dbuser:DeinPasswort@127.0.0.1:3306/u123456789_11f_crm?ssl-mode=REQUIRED"
```

**Ersetze:**
- `u123456789_dbuser` → dein Username
- `DeinPasswort` → dein DB-Passwort
- `u123456789_11f_crm` → dein Datenbankname

### Schritt 5: Lokal testen

```bash
# Setze DATABASE_URL in .env
echo 'DATABASE_URL="mysql://..."' > .env

# Schema pushen
npm run db:push

# Testen ob Verbindung funktioniert
npm run db:studio
```

Wenn Prisma Studio sich öffnet → ✅ Verbindung erfolgreich!

## 🚀 Teil 2: Code auf GitHub pushen

### Schritt 1: Git initialisieren

```bash
cd react-nextjs-tailwindcss

# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen
git add .

# Commit erstellen
git commit -m "Initial commit: 11F OS CRM ready for deployment"
```

### Schritt 2: GitHub Repository erstellen

1. Gehe zu [github.com](https://github.com/new)
2. Repository Name: `11f-crm` (oder beliebig)
3. **WICHTIG:** Setze auf **Private** wenn Template-Lizenz es erfordert
4. Klicke **Create repository**

### Schritt 3: Code hochladen

```bash
# Repository verknüpfen
git remote add origin https://github.com/DEIN-USERNAME/11f-crm.git

# Branch umbenennen
git branch -M main

# Code pushen
git push -u origin main
```

✅ Dein Code ist jetzt auf GitHub!

## 🌐 Teil 3: Deployment (2 Optionen)

### Option A: Vercel (empfohlen, einfacher)

Vercel ist perfekt für Next.js und kostenlos für Hobby-Projekte.

#### 1. Vercel Account erstellen
- Gehe zu [vercel.com](https://vercel.com)
- Melde dich mit GitHub an

#### 2. Projekt importieren
- Klicke **Add New** → **Project**
- Wähle dein `11f-crm` Repository
- Klicke **Import**

#### 3. Environment Variables setzen
In den Project Settings:

```env
DATABASE_URL=mysql://u123456789_dbuser:password@127.0.0.1:3306/u123456789_11f_crm?ssl-mode=REQUIRED
NEXT_PUBLIC_APP_URL=https://dein-projekt.vercel.app
```

**WICHTIG:** Hostinger MySQL-Host muss von außen erreichbar sein!
Falls nicht, nutze **externe DB** wie:
- [PlanetScale](https://planetscale.com) (MySQL, kostenloser Plan)
- [Supabase](https://supabase.com) (PostgreSQL, kostenloser Plan)
- [Neon](https://neon.tech) (PostgreSQL, kostenloser Plan)

#### 4. Deploy
- Klicke **Deploy**
- Warte 2-3 Minuten
- Deine App ist live! 🎉

#### 5. Datenbank initialisieren
Nach erstem Deploy:

```bash
# Installiere Vercel CLI
npm i -g vercel

# Login
vercel login

# In dein Projekt-Verzeichnis
cd react-nextjs-tailwindcss

# Link zu Vercel-Projekt
vercel link

# Prisma Befehle ausführen
vercel env pull .env.local
npx prisma generate
npx prisma db push
npx prisma db seed
```

---

### Option B: Hostinger Node.js Hosting

Nur wenn dein Hostinger-Plan **Node.js Support** hat.

#### 1. SSH-Zugang aktivieren
- Hostinger hPanel → **Erweitert** → **SSH-Zugang**
- Aktiviere SSH

#### 2. Via SSH einloggen

```bash
ssh u123456789@your-domain.com
```

#### 3. Repository klonen

```bash
cd domains/your-domain.com/public_html
git clone https://github.com/DEIN-USERNAME/11f-crm.git
cd 11f-crm/react-nextjs-tailwindcss
```

#### 4. Dependencies installieren

```bash
npm install
```

#### 5. Environment Variables setzen

```bash
nano .env
```

Füge ein:
```env
DATABASE_URL="mysql://u123456789_dbuser:password@127.0.0.1:3306/u123456789_11f_crm"
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

Speichern: `CTRL + O`, Enter, `CTRL + X`

#### 6. Datenbank initialisieren

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

#### 7. Build & Start

```bash
npm run build
npm run start
```

#### 8. Process Manager (PM2)

Damit die App dauerhaft läuft:

```bash
npm install -g pm2
pm2 start npm --name "11f-crm" -- start
pm2 save
pm2 startup
```

## ✅ Deployment-Checkliste

- [ ] MySQL Datenbank auf Hostinger erstellt
- [ ] `DATABASE_URL` notiert
- [ ] `prisma/schema.prisma` auf `mysql` geändert
- [ ] Lokal getestet mit `npm run db:studio`
- [ ] Code auf GitHub gepusht
- [ ] `.env` ist in `.gitignore` (niemals committen!)
- [ ] Vercel Projekt erstellt
- [ ] Environment Variables in Vercel gesetzt
- [ ] App deployed auf Vercel
- [ ] Prisma Migrations auf Production ausgeführt
- [ ] Seed-Daten eingefügt
- [ ] App öffnet sich auf `https://dein-projekt.vercel.app/os`
- [ ] CRM funktioniert und zeigt Daten

## 🐛 Häufige Probleme

### Problem: "Can't reach database server"

**Ursache:** Hostinger MySQL ist nicht von außen erreichbar

**Lösung 1:** Externe Datenbank nutzen (PlanetScale, Supabase, Neon)

**Lösung 2:** Hostinger Support kontaktieren für externe MySQL-Verbindung

### Problem: Vercel Build schlägt fehl

**Fehler:** `@prisma/client did not initialize yet`

**Lösung:** 
```bash
# In package.json "build" script ändern:
"build": "prisma generate && next build"
```

### Problem: Seite lädt, aber keine Daten

**Ursache:** API Routes können nicht auf DB zugreifen

**Lösung:**
1. Vercel Logs checken: Dashboard → Deployments → View Logs
2. DATABASE_URL korrekt in Environment Variables?
3. `npx prisma db push` auf Production ausgeführt?

## 🎉 Fertig!

Deine 11F OS CRM App sollte jetzt live sein:

- **Frontend:** `https://dein-projekt.vercel.app/os`
- **Datenbank:** Hostinger MySQL
- **Updates:** Automatisch bei jedem `git push`

Bei weiteren Fragen: GitHub Issues erstellen!
