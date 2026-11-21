# Chat Agnes / Claude sur Vercel

## Contenu
- `index.html` : l'interface de chat
- `api/chat/completions.js` : le relais serveur qui ajoute ta clé Agnes (elle n'est jamais envoyée au navigateur)

## Déploiement

### Option A — Sans ligne de commande
1. Mets ce dossier dans un dépôt GitHub.
2. Sur vercel.com → **Add New… → Project** → importe le dépôt → **Deploy** (aucun réglage de build nécessaire).
3. Dans le projet : **Settings → Environment Variables**, ajoute :
   - `AGNES_API_KEY` = ta clé Agnes (obligatoire)
   - `ACCESS_PASSWORD` = un mot de passe de ton choix (fortement conseillé)
4. **Deployments → ⋯ → Redeploy** pour que les variables soient prises en compte.

### Option B — Avec la CLI
```bash
npm i -g vercel
cd claude-chat
vercel                      # premier déploiement
vercel env add AGNES_API_KEY
vercel env add ACCESS_PASSWORD
vercel --prod               # redéploie avec les variables
```

## Utilisation
Ouvre l'URL Vercel. Le fournisseur « Relais Vercel » est sélectionné par défaut.
Si tu as défini `ACCESS_PASSWORD`, entre-le dans **⚙ Paramètres → Clé API**.

## Important
Sans `ACCESS_PASSWORD`, toute personne qui trouve ton URL peut utiliser ton quota Agnes.
