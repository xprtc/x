# 🚀 Professionelles CRM-System Setup-Anleitung

## Schritt 1: PostgreSQL Datenbank einrichten

### Option A: Lokal (Docker - Empfohlen für Entwicklung)
```bash
docker run --name 11f-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=11f_crm -p 5432:5432 -d postgres:16
```

### Option B: Cloud (Produktion)
Erstelle eine Datenbank bei einem dieser Anbieter:
- **Supabase** (kostenlos): https://supabase.com
- **Neon** (kostenlos): https://neon.tech
- **Railway** (kostenlos): https://railway.app

## Schritt 2: Umgebungsvariablen konfigurieren
```bash
cp .env.example .env
```
Dann in `.env` die `DATABASE_URL` anpassen mit deinen echten Credentials.

## Schritt 3: Datenbank-Schema erstellen
```bash
npm run db:push
```
Dies erstellt alle Tabellen in deiner Datenbank.

## Schritt 4: Beispieldaten einfügen (Optional)
```bash
npm run db:seed
```
Fügt 6 Beispiel-Kunden mit Aktivitäten hinzu.

## Schritt 5: Entwicklungsserver starten
```bash
npm run dev
```

## Nützliche Kommandos

- `npm run db:studio` - Öffnet Prisma Studio (visuelle Datenbank-GUI)
- `npm run db:migrate` - Erstellt Migration-Dateien
- `npm run db:generate` - Generiert Prisma Client neu

## API Endpoints

- `GET /api/clients` - Alle Clients abrufen
- `GET /api/clients?stage=VIP` - Filter nach Journey Stage
- `GET /api/clients?search=mueller` - Suche
- `POST /api/clients` - Neuen Client erstellen
- `GET /api/clients/[id]` - Einzelnen Client abrufen
- `PATCH /api/clients/[id]` - Client aktualisieren
- `DELETE /api/clients/[id]` - Client löschen

## Datenbank-Schema

### Client
- id, companyName, firstName, lastName, email (unique)
- phone, city, address, zipCode, country
- journeyStage (INTERESSENT, KUNDE, VIP, AMBASSADOR)
- statusText, notes
- createdAt, updatedAt

### Activity
- id, clientId, type (EMAIL, CALL, MEETING, NOTE, TASK)
- title, description, date, createdBy

### User
- id, email, name, role

## Nächste Schritte

1. ✅ Datenbank einrichten
2. ✅ Schema migrieren
3. ✅ Beispieldaten einfügen
4. 🔄 CRM-Komponente integrieren (next step)
5. 🔄 Authentifizierung hinzufügen (NextAuth.js)
6. 🔄 Deployment vorbereiten
