# Quick Start für GitHub + Hostinger

## 1️⃣ Git initialisieren & auf GitHub pushen

```bash
cd /Users/sbrxprtc/Downloads/themeforest-S2nHEhgN-trezo-multiframework-admin-dashboard-template/trezo-admin-full-version/react-nextjs-tailwindcss

git init
git add .
git commit -m "Initial commit: Trezo CRM Web OS"
git branch -M main
```

**GitHub Repository erstellen:**
1. Gehe zu https://github.com/new
2. Name: `trezo-crm` (oder eigener Name)
3. Private oder Public (je nach Lizenz)
4. **NICHT** README/gitignore/license hinzufügen (haben wir schon)
5. **Create repository** klicken

```bash
# Füge deine GitHub Repo-URL ein:
git remote add origin https://github.com/DEIN-USERNAME/trezo-crm.git
git push -u origin main
```

## 2️⃣ Hostinger MySQL Datenbank einrichten

1. Login auf https://hpanel.hostinger.com
2. **Datenbanken** → **MySQL Datenbanken**
3. **Neue Datenbank erstellen**
4. Notiere: Host, Username, Password, DB-Name

**Beispiel:**
```
Host: 127.0.0.1
Port: 3306
Username: u123456789_user
Password: deinpasswort
Database: u123456789_trezo
```

## 3️⃣ Prisma für MySQL anpassen

Öffne `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"  // ← VON "postgresql" ZU "mysql" ÄNDERN
  url      = env("DATABASE_URL")
}
```

## 4️⃣ Lokale .env erstellen und testen

```bash
# Erstelle .env Datei
cat > .env << 'EOF'
DATABASE_URL="mysql://u123456789_user:deinpasswort@127.0.0.1:3306/u123456789_trezo?ssl-mode=REQUIRED"
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# Datenbank initialisieren
npm run db:push

# Beispieldaten einfügen
npm run db:seed

# Testen ob alles funktioniert
npm run db:studio
```

Wenn Prisma Studio sich öffnet → ✅ Perfekt!

## 5️⃣ Auf Vercel deployen

**Warum Vercel?**
- Kostenlos für Hobby-Projekte
- Perfekt für Next.js optimiert
- Automatische Deployments bei jedem Git Push
- SSL/HTTPS inklusive

**Schritt für Schritt:**

1. Gehe zu https://vercel.com
2. **Sign Up** mit GitHub Account
3. **Add New** → **Project**
4. Wähle dein `trezo-crm` Repository
5. **Environment Variables** hinzufügen:
   ```
   DATABASE_URL=mysql://u123456789_user:pass@127.0.0.1:3306/u123456789_trezo?ssl-mode=REQUIRED
   NEXT_PUBLIC_APP_URL=https://dein-projekt.vercel.app
   ```
6. **Deploy** klicken

## 6️⃣ Datenbank auf Production initialisieren

Nach erstem erfolgreichen Deploy:

```bash
# Vercel CLI installieren
npm i -g vercel

# Login
vercel login

# Mit Projekt verbinden
vercel link

# Environment Variables lokal ziehen
vercel env pull .env.production

# Prisma auf Production initialisieren
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed
```

## ⚠️ WICHTIG: Hostinger MySQL extern erreichbar?

Hostinger MySQL ist oft **nur intern** erreichbar (von Hostinger-Servern).

**Problem:** Vercel kann nicht auf Hostinger MySQL zugreifen.

**Lösung A:** Externe Datenbank nutzen (empfohlen)
- ✅ **PlanetScale** (MySQL, kostenlos): https://planetscale.com
- ✅ **Supabase** (PostgreSQL, kostenlos): https://supabase.com
- ✅ **Neon** (PostgreSQL, kostenlos): https://neon.tech

**Lösung B:** Hostinger Support fragen
- "Kann ich MySQL von extern erreichen? (für Vercel Deployment)"
- Falls ja: IP-Whitelist für Vercel IPs einrichten

## 🎯 Deine finale Setup-URL

Nach erfolgreichem Deployment:

**Live App:** `https://dein-projekt.vercel.app/os`

**Automatische Updates:**
```bash
git add .
git commit -m "Update: neue Features"
git push
# → Vercel deployed automatisch in ~2 Min!
```

## ✅ Deployment Checklist

- [ ] Git initialisiert & GitHub Repo erstellt
- [ ] Code auf GitHub gepusht
- [ ] Hostinger MySQL Datenbank erstellt
- [ ] `prisma/schema.prisma` auf `mysql` geändert
- [ ] Lokal mit `npm run db:studio` getestet
- [ ] Vercel Account erstellt
- [ ] Projekt von GitHub importiert
- [ ] Environment Variables in Vercel gesetzt
- [ ] Erfolgreich deployed
- [ ] Prisma auf Production initialisiert (`db:push`, `db:seed`)
- [ ] App öffnet sich auf `/os` und zeigt CRM-Daten

## 🆘 Hilfe benötigt?

Siehe `DEPLOYMENT.md` für ausführliche Anleitung und Troubleshooting!
