# 🌲 Inventari Forestal PTGMF — Guia d'instal·lació Android

**Dissenyat per Martí Solé i Xanxo (M.S.X.)**  
Versió 10.0 — App Web Progressiva (PWA)

---

## Contingut del paquet

```
inventari-ptgmf/
├── index.html       ← Aplicació principal
├── sw.js            ← Service Worker (funciona offline)
├── manifest.json    ← Configuració PWA
├── icon-192.png     ← Icona app
├── icon-512.png     ← Icona app gran
└── README.md        ← Aquest fitxer
```

---

## Com instal·lar a Android

### Opció A — Des d'un servidor web (RECOMANAT)

1. **Puja els 5 fitxers** (index.html, sw.js, manifest.json, icon-192.png, icon-512.png)  
   a qualsevol allotjament web (GitHub Pages, Netlify, servidor propi, etc.)

2. **Obre l'URL** al navegador Chrome del mòbil Android

3. Chrome mostrarà una **bàner d'"Afegir a la pantalla d'inici"**  
   O bé: Menú Chrome (⋮) → **"Afegir a la pantalla d'inici"** → Instal·la

4. L'app apareix a la pantalla d'inici com una app nativa ✅

---

### Opció B — Servidor local amb Python (sense internet)

Si tens Python al PC i vols provar localment:

```bash
# A la carpeta on has desat els fitxers:
python3 -m http.server 8080
```

Connecta el mòbil a la mateixa xarxa WiFi i obre:  
`http://IP_DEL_PC:8080` al Chrome del mòbil

---

### Opció C — GitHub Pages (GRATIS i fàcil)

1. Crea un compte a [github.com](https://github.com)
2. Crea un repositori nou (públic)
3. Puja els 5 fitxers
4. Ves a Settings → Pages → Source: main branch
5. L'app estarà a: `https://USUARI.github.io/NOM-REPO`

---

## Funcionalitats

- ✅ **Tab General** — Identificació, topografia i sòl de la parcel·la
- ✅ **Tab Vegetació** — Estrats, distribució, regeneració i estat sanitari
- ✅ **Tab Arbres** — Afegir arbres amb DN, H, vigor, fitosanitari
  - Dashboard en temps real (N, G, Dg, Hm)
  - Dreceres de DN ràpides
  - Taula d'arbres editable
- ✅ **Tab Desar** — Gestió de parcel·les desades
  - Llista de totes les parcel·les amb estadístiques
  - Exportació a Excel (.xlsx) amb 2 pestanyes
  - Emmagatzematge persistent (localStorage)
- ✅ **Funciona offline** una vegada instal·lada
- ✅ **Dades persistents** — no es perden en tancar l'app

---

## Notes tècniques

- L'app guarda les dades al **localStorage** del navegador.
- Les dades es conserven entre sessions.
- Per exportar les dades, prem "Descarregar Excel" al Tab Desar.
- L'Excel té 2 pestanyes: **Parcel·les** i **Arbres** (com l'original R/Shiny).

---

*Dissenyat i desenvolupat per Martí Solé i Xanxo (M.S.X.)*
