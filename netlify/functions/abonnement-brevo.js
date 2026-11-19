/* ============================================================
   FONCTION NETLIFY — calculateur Instagram + Brevo
   À garder ici dans ton dossier de déploiement :
   netlify/functions/abonnement-brevo.js
   ============================================================

   ⚙️ CONFIGURATION :
   1. Brevo > Expéditeurs : valide ton adresse email d'expédition
      (reçois l'email de validation et clique). Note-la dans
      EXPEDITEUR_EMAIL ci-dessous.
   2. Brevo > Contacts : crée ta liste et note son ID dans LISTE_ID.
   3. Brevo > Contacts > Attributs : crée 2 attributs TEXTE :
      SCORE_ER  et  VERDICT
   4. Brevo > SMTP & API > Clés API : génère une clé (droits Contacts
      + Transactionnel).
   5. Netlify > Site configuration > Environment variables :
      BREVO_API_KEY = ta clé (xkeysib-...), puis REDÉPLOIE le site.
   ============================================================ */

const EXPEDITEUR_EMAIL = "ia.reseaux@hotmail.com"; // ← ton email validé dans Brevo
const EXPEDITEUR_NOM = "Pauline — PNL Media.Réseaux";
const LISTE_ID = 2; // ← l'ID de ta liste de contacts Brevo

/* Texte d'échappement pour insérer du texte dans du HTML sans danger */
function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmtNombre(v) {
  return (v === null || v === undefined || v === "" || Number(v) === 0)
    ? "—"
    : String(v).replace(".", ",");
}

/* Construit l'email HTML détaillé à partir des données du calculateur */
function construireEmail(d) {
  const conseils = Array.isArray(d.conseils) ? d.conseils : [];
  const listeConseils = conseils
    .map((c) => "<li>" + esc(c) + "</li>")
    .join("");

  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
    <div style="background:linear-gradient(45deg,#dc2743,#bc1888);border-radius:16px;padding:24px;text-align:center;color:#fff">
      <h1 style="font-size:20px;margin:0">📊 Voici ton diagnostic Instagram</h1>
    </div>

    <div style="background:#fff;border-radius:14px;padding:22px;margin-top:14px;border:1px solid #f0e0ea">
      <p style="text-align:center;font-size:14px;color:#888;margin:0">Ton taux d'engagement (par abonné)</p>
      <p style="text-align:center;font-size:40px;font-weight:900;color:#bc1888;margin:4px 0">${esc(d.score)}</p>
      <p style="text-align:center;font-size:13.5px;margin:6px 0 0">${esc(d.verdict)}</p>
      <p style="text-align:center;font-size:12.5px;color:#888;margin:8px 0 0">📊 Moyenne des comptes de ta taille : ≈ ${esc(d.moyenne)}</p>
    </div>

    <div style="background:#fff;border-radius:14px;padding:22px;margin-top:14px;border:1px solid #f0e0ea">
      <h2 style="font-size:15px;color:#bc1888;margin:0 0 10px">📝 Les chiffres que tu as saisis</h2>
      <table style="width:100%;font-size:13.5px;border-collapse:collapse">
        <tr><td style="padding:7px 0;border-bottom:1px solid #f7ecf2">Nombre d'abonnés</td><td style="text-align:right;font-weight:bold;color:#bc1888;border-bottom:1px solid #f7ecf2">${fmtNombre(d.abonnes)}</td></tr>
        <tr><td style="padding:7px 0;border-bottom:1px solid #f7ecf2">Likes moyens par publication</td><td style="text-align:right;font-weight:bold;color:#bc1888;border-bottom:1px solid #f7ecf2">${fmtNombre(d.likes)}</td></tr>
        <tr><td style="padding:7px 0;border-bottom:1px solid #f7ecf2">Commentaires moyens</td><td style="text-align:right;font-weight:bold;color:#bc1888;border-bottom:1px solid #f7ecf2">${fmtNombre(d.commentaires)}</td></tr>
        <tr><td style="padding:7px 0;border-bottom:1px solid #f7ecf2">Enregistrements moyens</td><td style="text-align:right;font-weight:bold;color:#bc1888;border-bottom:1px solid #f7ecf2">${fmtNombre(d.enregistrements)}</td></tr>
        <tr><td style="padding:7px 0">Portée moyenne par publication</td><td style="text-align:right;font-weight:bold;color:#bc1888">${fmtNombre(d.portee)}</td></tr>
      </table>
    </div>

    <div style="background:#fff;border-radius:14px;padding:22px;margin-top:14px;border:1px solid #f0e0ea">
      <h2 style="font-size:15px;color:#bc1888;margin:0 0 10px">🔎 Ce que ça veut dire pour toi</h2>
      <ul style="margin:0;padding-left:20px;font-size:13.5px;color:#444;line-height:1.7">${listeConseils}</ul>
    </div>

    <div style="background:linear-gradient(45deg,#f09433,#dc2743,#bc1888);border-radius:14px;padding:22px;margin-top:14px;text-align:center;color:#fff">
      <h3 style="font-size:16px;margin:0 0 6px">🚀 Envie d'aller plus loin ?</h3>
      <p style="font-size:12.5px;opacity:.95;margin:0;line-height:1.5">Ce diagnostic donne le pouls de ton compte, mais il ne te dit pas exactement QUOI corriger pour progresser.</p>
      <a href="https://buy.stripe.com/aFacN7gqd0kS4RqckU4Rq01" style="display:inline-block;background:#f2b705;color:#fff;font-weight:bold;padding:11px 26px;border-radius:30px;margin-top:14px;text-decoration:none;font-size:13.5px">Je veux mon audit complet →</a><br>
      <a href="https://buy.stripe.com/bJe28t3Dr6Jgfw40Cc4Rq00" style="display:inline-block;background:#fff;border:1.5px solid #e8a800;color:#b37c00;font-weight:bold;padding:10px 26px;border-radius:30px;margin-top:10px;text-decoration:none;font-size:13px">Ou l'audit Découverte à 12 €</a>
    </div>

    <p style="font-size:11px;color:#999;text-align:center;margin-top:14px;line-height:1.5">
      Tu reçois cet email car tu as demandé ton diagnostic sur le calculateur.<br>
      Tu peux te désinscrire de mes conseils à tout moment en répondant "STOP" à cet email.
    </p>
  </div>`;
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ erreur: "Méthode non autorisée" }) };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ erreur: "BREVO_API_KEY manquante dans Netlify" }) };
  }

  let donnees;
  try {
    donnees = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ erreur: "Corps de requête invalide" }) };
  }

  const email = (donnees.email || "").trim();
  if (!email || email.indexOf("@") < 1) {
    return { statusCode: 400, headers, body: JSON.stringify({ erreur: "Email invalide" }) };
  }

  try {
    /* ÉTAPE 1 : ajoute (ou met à jour) le contact dans ta liste Brevo
       avec son score. Pas de double opt-in : l'inscription est directe,
       le consentement marketing a été coché sur le calculateur. */
    const reponseContact = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          SCORE_ER: donnees.score || "",
          VERDICT: donnees.verdict || ""
        },
        listIds: [LISTE_ID],
        updateEnabled: true,
        emailBlacklisted: false,
        smsBlacklisted: false
      })
    });

    /* Un contact déjà existant peut répondre 204 (créé) ou 400
       (déjà présent) : les deux sont OK pour nous, l'email part quand
       même. Seules les autres vraies erreurs bloquent l'envoi. */
    if (!reponseContact.ok && reponseContact.status !== 400) {
      const texte = await reponseContact.text();
      console.error("Brevo contacts a répondu :", reponseContact.status, texte);
      // On continue quand même : l'envoi du diagnostic est prioritaire.
    }

    /* ÉTAPE 2 : envoie immédiatement le diagnostic détaillé par email
       transactionnel, directement dans la boîte de l'utilisateur. */
    const reponseEmail = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        sender: { name: EXPEDITEUR_NOM, email: EXPEDITEUR_EMAIL },
        to: [{ email: email }],
        subject: "📊 Ton diagnostic Instagram : " + (donnees.score || "") + " d'engagement",
        htmlContent: construireEmail(donnees)
      })
    });

    if (reponseEmail.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    const texteErreur = await reponseEmail.text();
    console.error("Brevo SMTP a répondu :", reponseEmail.status, texteErreur);
    return { statusCode: 500, headers, body: JSON.stringify({ erreur: "Envoi Brevo impossible" }) };
  } catch (e) {
    console.error("Erreur d'appel Brevo :", e);
    return { statusCode: 500, headers, body: JSON.stringify({ erreur: "Connexion à Brevo impossible" }) };
  }
};
