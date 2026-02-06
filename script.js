console.log("script.js loaded", window.Telegram);

const tg = window.Telegram.WebApp;
tg.ready(); // indique à Telegram que l’UI est prête

// Optionnel : adapter au thème Telegram
document.body.style.backgroundColor = tg.themeParams.bg_color || "#ffffff";
document.body.style.color = tg.themeParams.text_color || "#000000";

const nameInput = document.getElementById("name");
const requestInput = document.getElementById("request");
const statusEl = document.getElementById("status");

// Config du MainButton Telegram
tg.MainButton.setText("Envoyer la demande");
tg.MainButton.show();

// URL de ton webhook n8n (à remplir APRES création du workflow)
const N8N_WEBHOOK_URL = "https://n8n-34hh.onrender.com/webhook/todo-add";

tg.MainButton.onClick(async () => {
  const name = nameInput.value.trim();
  const request = requestInput.value.trim();

  if (!name || !request) {
    statusEl.textContent = "Merci de remplir tous les champs.";
    return;
  }

  tg.MainButton.showProgress();

  try {
    const payload = {
      name,
      request,
      // on récupère des infos utilisateur depuis Telegram
      telegram_user: tg.initDataUnsafe?.user || null,
    };

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      statusEl.textContent = "Demande envoyée avec succès ✅";
      tg.MainButton.hide();
    } else {
      statusEl.textContent = "Erreur côté serveur, réessayez plus tard.";
    }
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Erreur réseau.";
  } finally {
    tg.MainButton.hideProgress();
  }
});
