=====================================================================
 INSTRUCCIONS DE CONFIGURACIÓ SUPABASE
 Inventari Forestal PTGMF - Sincronització al Núvol
=====================================================================

PREREQUISITS: Compte gratuït a https://supabase.com

=====================================================================
 PAS 1: CREAR EL PROJECTE SUPABASE
=====================================================================

1. Ves a https://supabase.com i crea un compte (gratuït)
2. Crea un nou projecte:
   - Nom: "inventari-forestal" (o el que vulguis)
   - Base de dades: crea una contrasenya segura
   - Regió: escull la més propera (ex: Frankfurt per Europa)
3. Espera que el projecte s'inicialitzi (1-2 minuts)

=====================================================================
 PAS 2: CREAR LA TAULA DE DADES
=====================================================================

Al panell de Supabase, ves a "SQL Editor" i executa:

  CREATE TABLE user_data (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    parcelles JSONB DEFAULT '[]'::jsonb NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
  );

  ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Cada usuari accedeix només a les seves dades"
    ON user_data
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

Clica "Run" per executar.

=====================================================================
 PAS 3: OBTENIR LES CREDENCIALS
=====================================================================

Al panell de Supabase:
1. Ves a "Project Settings" → "API"
2. Copia:
   - "Project URL":   https://XXXXXXXXXXX.supabase.co
   - "anon public" key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

=====================================================================
 PAS 4: CONFIGURAR L'APLICACIÓ
=====================================================================

Obre el fitxer index.html i busca les línies:

  const SUPABASE_URL  = 'https://XXXXXXXXXXXXX.supabase.co';
  const SUPABASE_ANON = 'eyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

Substitueix els valors per les teves credencials del Pas 3.

=====================================================================
 PAS 5 (OPCIONAL): CONFIGURAR EMAIL
=====================================================================

Per defecte Supabase requereix confirmació per correu.
Per desactivar-ho (útil en proves):
  - Ves a "Authentication" → "Providers" → "Email"
  - Desactiva "Confirm email"

Per enviar correus reals (producció):
  - Configura un proveïdor SMTP a "Authentication" → "SMTP Settings"

=====================================================================
 FUNCIONALITATS IMPLEMENTADES
=====================================================================

✅ Registre d'usuaris amb correu/contrasenya
✅ Inici de sessió / Tancament de sessió
✅ Sincronització automàtica al desar una parcel·la
✅ Càrrega de dades des del núvol en iniciar sessió
✅ Mode offline (localStorage) quan no hi ha connexió
✅ Indicador d'estat de sincronització
✅ Botó de sincronització manual
✅ Aïllament de dades per usuari (Row Level Security)
✅ Backup automàtic al núvol en cada desa

=====================================================================
 NOTES DE SEGURETAT
=====================================================================

- La "anon key" és pública i és segur incloure-la al codi client
- La seguretat real ve de les polítiques RLS de la base de dades
- Cada usuari NOMÉS pot veure i modificar les seves pròpies dades
- Les dades es xifren en trànsit (HTTPS) i en repòs

=====================================================================
 PREU
=====================================================================

El pla gratuït de Supabase inclou:
- Fins a 50.000 usuaris actius/mes
- 500 MB de base de dades
- Backups diaris
- Suficient per a un ús professional d'inventari forestal

=====================================================================
