// Relais Vercel vers l'API Agnes AI (compatible OpenAI).
// La clé reste sur le serveur : variable d'environnement AGNES_API_KEY.
// Optionnel : ACCESS_PASSWORD pour empêcher les inconnus d'utiliser ton quota.
// Optionnel : AGNES_BASE_URL (par défaut https://apihub.agnes-ai.com/v1).

export const config = { runtime: "edge" };

const json = (status, obj) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

export default async function handler(req) {
  if (req.method !== "POST") return json(405, { error: { message: "Méthode non autorisée" } });

  const key = process.env.AGNES_API_KEY;
  if (!key) return json(500, { error: { message: "AGNES_API_KEY n'est pas défini dans les variables d'environnement Vercel." } });

  const password = process.env.ACCESS_PASSWORD;
  if (password) {
    const given = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (given !== password) return json(401, { error: { message: "Mot de passe d'accès incorrect (⚙ Paramètres → Clé API)." } });
  }

  let body;
  try { body = await req.json(); } catch { return json(400, { error: { message: "Corps JSON invalide" } }); }

  const base = (process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1").replace(/\/+$/, "");
  const upstream = await fetch(base + "/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + key },
    body: JSON.stringify(body),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "text/event-stream",
      "cache-control": "no-cache",
    },
  });
}
