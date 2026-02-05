async function addTask(task, datetime) {
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe?.user;
  
  await fetch("https://n8n-34hh.onrender.com/webhook-test/todo-add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user?.id,
      task,
      datetime,
    }),
  });

  tg.MainButton.setText("Tâche ajoutée ✅");
  tg.MainButton.show();
}
