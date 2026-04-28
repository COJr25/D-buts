# Backend local (version apprentissage)

Ce dossier contient une API minimale pour alimenter la carte **Heart** de la maquette.

## 1) Lancer l'API

```bash
npm run start:api
```

Si tout va bien, tu verras:

```text
API listening on http://localhost:3001
```

## 2) Vérifier que l'API répond

Ouvre cette URL dans ton navigateur:

```text
http://localhost:3001/api/v1/health
```

Tu dois voir:

```json
{"ok":true}
```

## 3) Endpoints utiles pour Heart

### GET `/api/v1/metrics/heart/latest`
Retourne la dernière mesure BPM affichée dans la carte Heart.

### POST `/api/v1/metrics/heart`
Enregistre une nouvelle mesure BPM.

Exemple de body JSON:

```json
{
  "bpm": 96,
  "measuredAt": "2026-04-26T12:00:00.000Z",
  "source": "ring"
}
```

## 4) C'est quoi "fetch périodique" ?

Dans `index.html`, le frontend appelle l'API toutes les 5 secondes:
- il fait un `fetch` vers `/api/v1/metrics/heart/latest`
- il met à jour le texte BPM

"Périodique" = répété à intervalle fixe (ici 5000 ms).
