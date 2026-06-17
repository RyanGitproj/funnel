# Domaine des Élégances

Site vitrine / funnel de leads pour le Domaine des Élégances.

## Stack

- Next.js 16 App Router · TypeScript · Tailwind CSS v4 · React 19
- Supabase (leads storage)
- Output: standalone

## Démarrage

```bash
cp .env.local.example .env.local  # renseigner les clés Supabase
npm install
npm run dev
```

## Variables d'environnement requises

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Commandes

```bash
npm run dev      # :3000
npm run build    # next build + standalone
npm run start    # production
npm run lint
```
