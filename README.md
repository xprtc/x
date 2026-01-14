# Trezo CRM - Web OS Dashboard

Ein professionelles CRM-System mit Web-OS-Oberfläche, gebaut mit Next.js 15, TypeScript, Tailwind CSS und PostgreSQL.

## 🚀 Features

- **Web OS Interface** - Desktop-ähnliche Benutzeroberfläche im Browser
- **Multi-Window System** - Mehrere Apps gleichzeitig öffnen und verschieben
- **Professionelles CRM** - Vollständiges Kundenmanagement mit Datenbank
- **Echtzeit-Daten** - PostgreSQL/MySQL mit Prisma ORM
- **Glassmorphismus Design** - Modernes, transparentes UI-Design
- **TypeScript** - Typsichere Entwicklung
- **Responsive** - Optimiert für Desktop (Mobile-Fallback vorhanden)

## 📋 Voraussetzungen

- Node.js 18+ 
- PostgreSQL oder MySQL Datenbank (lokal oder Cloud)
- npm oder yarn

## 🛠️ Installation

### 1. Repository klonen
```bash
git clone <your-repo-url>
cd react-nextjs-tailwindcss
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
# Datenbank (Hostinger MySQL)
DATABASE_URL="mysql://username:password@host:3306/database?ssl-mode=REQUIRED"

# Für PostgreSQL (alternativ):
# DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Hostinger MySQL Verbindung:
```env
DATABASE_URL="mysql://u123456789_dbuser:YourPassword@127.0.0.1:3306/u123456789_crm?ssl-mode=REQUIRED"
```

**Hostinger DB-Details finden:**
1. Login auf Hostinger hPanel
2. Gehe zu **Datenbanken** → **MySQL Datenbanken**
3. Wähle deine Datenbank → **Details anzeigen**
4. Kopiere: Host, Username, Password, Datenbankname

### 4. Prisma Schema für MySQL anpassen (falls MySQL)

Ändere in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"  // statt "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. Datenbank initialisieren

```bash
# Prisma Client generieren
npm run db:generate

# Datenbank-Schema erstellen
npm run db:push

# Optional: Beispieldaten einfügen
npm run db:seed
```

### 6. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000/os](http://localhost:3000/os)

## 📦 Production Build

```bash
npm run build
npm run start
```

## 🗄️ Datenbank-Befehle

```bash
npm run db:generate     # Prisma Client neu generieren
npm run db:push         # Schema in DB pushen (ohne Migration)
npm run db:migrate      # Migration erstellen und ausführen
npm run db:seed         # Beispieldaten einfügen
npm run db:studio       # Prisma Studio öffnen (GUI)
```

## 🌐 Deployment auf Hostinger

### Schritt 1: GitHub Repository erstellen

```bash
cd react-nextjs-tailwindcss
git init
git add .
git commit -m "Initial commit: Trezo CRM Web OS"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Schritt 2: Hostinger MySQL Datenbank einrichten

1. Login auf Hostinger hPanel
2. Gehe zu **Datenbanken** → **MySQL Datenbanken**
3. Klicke auf **Neue Datenbank erstellen**
4. Datenbankname: `u123456789_trezo_crm` (wird automatisch mit Prefix erstellt)
5. Erstelle einen DB-User oder nutze bestehenden
6. Notiere alle Details: Host, Port, Username, Password, DB-Name

### Schritt 3: Environment Variables setzen

**Option A: Vercel (empfohlen für Next.js)**
1. Gehe zu [vercel.com](https://vercel.com)
2. Verbinde dein GitHub Repo
3. In Project Settings → Environment Variables:
   ```
   DATABASE_URL=mysql://user:pass@host:3306/dbname?ssl-mode=REQUIRED
   NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
   ```
4. Deploy automatisch bei jedem Push

**Option B: Hostinger Node.js Hosting**
1. Aktiviere Node.js in deinem Hosting-Panel
2. Setze Environment Variables im Panel
3. Upload via Git oder FTP
4. `npm install && npm run build && npm start`

### Schritt 4: Datenbank initialisieren (Production)

Nach dem ersten Deploy, einmalig ausführen:

```bash
# Via SSH oder Vercel CLI
npx prisma generate
npx prisma db push
npx prisma db seed
```

## 📂 Projekt-Struktur

```
react-nextjs-tailwindcss/
├── src/
│   ├── app/
│   │   ├── api/          # REST API Routes
│   │   ├── os/           # Web OS Page
│   │   └── dashboard/    # Dashboard Pages
│   ├── components/
│   │   ├── OS/           # OS Components (Desktop, Taskbar, Window)
│   │   └── Dashboard/    # Dashboard Widgets
│   ├── config/
│   │   └── apps.tsx      # App Registry
│   ├── store/
│   │   └── osStore.ts    # Zustand State Management
│   ├── lib/
│   │   └── prisma.ts     # Prisma Client
│   └── types/
│       └── crm.ts        # TypeScript Types
├── prisma/
│   ├── schema.prisma     # Datenbank-Schema
│   └── seed.ts           # Seed-Daten
├── public/               # Statische Assets
├── .env                  # Environment Variables (nicht committen!)
└── .env.production       # Beispiel für Production Variablen
```

## 🔐 Sicherheit

- ✅ `.env` Datei ist in `.gitignore` → niemals committen!
- ✅ Produktions-Datenbank: Verwende starke Passwörter
- ✅ SSL/TLS für Datenbank-Verbindung aktivieren (`ssl-mode=REQUIRED`)
- ⚠️ API Routes mit Authentication absichern (TODO: NextAuth.js)

## 🐛 Troubleshooting

### Problem: `PrismaClientInitializationError`
**Lösung:** Überprüfe `DATABASE_URL` in `.env` - Verbindung fehlgeschlagen

### Problem: `npm run build` schlägt fehl
**Lösung:** `npx prisma generate` vorher ausführen

### Problem: Hostinger MySQL Connection Timeout
**Lösung:** Verwende `127.0.0.1` statt `localhost` im Connection String

### Problem: Seite zeigt nur weißen Bildschirm
**Lösung:** Browser-Konsole prüfen (F12) → meistens API-Fehler wegen fehlender DB-Verbindung

## 🎯 Nächste Schritte

- [ ] Authentication mit NextAuth.js implementieren
- [ ] Email-Benachrichtigungen einrichten
- [ ] Kalender-Integration für Meetings
- [ ] Export-Funktionen (PDF, Excel)
- [ ] Dark Mode vervollständigen
- [ ] Mobile-optimierte Ansicht
- [ ] Internationalisierung (i18n)

## 📚 Dokumentation

- [Next.js Dokumentation](https://nextjs.org/docs)
- [Prisma Dokumentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand State Management](https://github.com/pmndrs/zustand)

## 🆘 Support

Bei Fragen oder Problemen:
- [GitHub Issues](https://github.com/yourusername/trezo-crm/issues)
- [Trezo Dokumentation](https://trezo-docs.envytheme.com/)

---

**Entwickelt mit ❤️ und TypeScript**
