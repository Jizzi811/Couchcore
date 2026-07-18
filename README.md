# Couchcore – Netlify-Version

## Lokal starten

1. Node.js 22 installieren.
2. Im Projektordner `npm install` ausführen.
3. `.env.example` als `.env.local` kopieren und den eigenen NVIDIA-Key eintragen.
4. Mit `npm run dev` starten.

## Auf Netlify veröffentlichen

1. Den entpackten Ordner in ein neues GitHub-Repository hochladen.
2. In Netlify **Add new project → Import an existing project** wählen und das Repository verbinden.
3. Die automatisch erkannten Build-Einstellungen übernehmen.
4. Unter **Project configuration → Environment variables** eine Variable anlegen:

   - Name: `NVIDIA_API_KEY`
   - Wert: eigener NVIDIA-API-Key
   - Als Secret markieren

5. **Deploy site** beziehungsweise **Trigger deploy** starten.

Der Key wird nur serverseitig in `app/api/chat/route.ts` verwendet und niemals an den Browser ausgeliefert. Kimi K2 Instruct ist das Hauptmodell; Llama 3.3 70B wird bei einem Modellfehler automatisch als Ersatz verwendet. Ohne Key fällt der Chat auf vorbereitete humorvolle Antworten zurück.
