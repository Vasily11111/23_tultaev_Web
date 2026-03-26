const contentDiv = document.getElementById("content");

function showLoading() {
  contentDiv.innerHTML = '<div class="loader">Loading data...</div>';
}

function showError(message) {
  contentDiv.innerHTML = `<div class="error">Request failed: ${message}</div>`;
}

async function getWeather() {
  showLoading();

  try {
    const response = await fetch("https://wttr.in/Moscow?format=j1");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const current = data.current_condition?.[0];

    if (!current) {
      throw new Error("No weather data in response");
    }

    const description = current.weatherDesc?.[0]?.value || "n/a";
    const iconUrl = current.weatherIconUrl?.[0]?.value || "";

    contentDiv.innerHTML = `
      <div class="card">
        <h2>Weather: Moscow</h2>
        <p><strong>Temperature:</strong> ${current.temp_C}&deg;C</p>
        <p><strong>Feels like:</strong> ${current.FeelsLikeC}&deg;C</p>
        <p><strong>Wind:</strong> ${current.windspeedKmph} km/h</p>
        <p><strong>Condition:</strong> ${description}</p>
        ${iconUrl ? `<img src="${iconUrl}" >` : ""}
      </div>
    `;
  } catch (error) {
    showError(error.message);
    console.error("Weather error:", error);
  }
}

async function getWiki() {
  showLoading();

  try {
    const response = await fetch(
      "https://ru.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts|info&inprop=url&exintro=1&explaintext=1&format=json&origin=*"
    );
    if (!response.ok) throw new Error("HTTP error: " + response.status);

    const data = await response.json();
    const pages = data.query?.pages ? Object.values(data.query.pages) : [];
    const firstResult = pages[0];

    if (!firstResult) throw new Error("No articles found");

    const preview = firstResult.extract
      ? `${firstResult.extract.slice(0, 400)}${firstResult.extract.length > 400 ? "..." : ""}`
      : "No article preview available.";
    const articleUrl =
      firstResult.fullurl ||
      `https://ru.wikipedia.org/wiki/${encodeURIComponent(firstResult.title.replace(/ /g, "_"))}`;

    contentDiv.innerHTML = `
      <div class="card">
        <h3>${firstResult.title}</h3>
        <p>${preview}</p>
        <p><a href="${articleUrl}" target="_blank" rel="noopener noreferrer">Open article</a></p>
        <br>
        <button onclick="getWiki()" style="border: none; background-color: #959697; color: white; padding: 10px 10px; border-radius: 10px;">Получить другую статью</button>
      </div>
    `;
  } catch (error) {
    showError(error.message);
    console.error("Wikipedia error:", error);
  }
}

async function getInsult() {
  showLoading();

  try {
    const endpoints = ["https://api.codetabs.com/v1/proxy?quest=https://evilinsult.com/generate_insult.php?lang=ru"];
    let text = "";


    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) continue;

        const raw = (await response.text()).trim();
        if (!raw || raw.startsWith("<")) continue;

        if (/[ÐÑ]/.test(raw)) {
          const bytes = Uint8Array.from(raw, (ch) => ch.charCodeAt(0));
          text = new TextDecoder("utf-8").decode(bytes).trim();
        } else {
          text = raw;
        }
        if (text) break;
      } catch { }
    }

    if (!text) throw new Error("No generated text in response");

    text = text.replace(/^"+|"+$/g, "").trim();


    contentDiv.innerHTML = `
      <div class="card">
        <p style="font-size: 1.5rem; color: #1e1e99;">"${text}"</p>
        <br>
        <button onclick="getInsult()" style="border: none; background-color: #959697; color: white; padding: 10px 10px; border-radius: 10px;">Сгенерировать еще</button>
      </div>
    `;
  } catch (error) {
    showError(error.message);
    console.error("Generator error:", error);
  }
}

function testCrud() {
  contentDiv.innerHTML = `
        <div style="text-align: left; max-width: 650px; background: white; border-radius: 3px;">
            
            <!-- Блок GET -->
            <div style="background: #f8faff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin-top: 0; font-size: 16px; color: #334155;">GET: список постов</h3>
                <button onclick="crudGet()" style="background: #000000; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">Загрузить 3 постa</button>
            </div>

            <!-- Блок POST -->
            <div style="background: #f8faff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin-top: 0; font-size: 16px; color: #334155;">POST: создать пост</h3>
                <label style="display: block; margin-top: 10px; font-size: 14px; color: #475569;">Заголовок</label>
                <input type="text" id="post-title" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; margin-top: 5px; margin-bottom: 10px;">
                <label style="display: block; font-size: 14px; color: #475569;">Текст</label>
                <textarea id="post-body" rows="3" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; margin-top: 5px; margin-bottom: 10px;"></textarea>
                <button onclick="crudPost()" style="background: #000000; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">Создать</button>
            </div>

            <!-- Блок PATCH -->
            <div style="background: #f8faff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin-top: 0; font-size: 16px; color: #334155;">PATCH: обновить пост</h3>
                <label style="display: block; margin-top: 10px; font-size: 14px; color: #475569;">ID поста</label>
                <input type="number" id="patch-id" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; margin-top: 5px; margin-bottom: 10px;">
                <label style="display: block; font-size: 14px; color: #475569;">Новый заголовок</label>
                <input type="text" id="patch-title" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; margin-top: 5px; margin-bottom: 10px;">
                <label style="display: block; font-size: 14px; color: #475569;">Новый текст</label>
                <textarea id="patch-body" rows="3" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; margin-top: 5px; margin-bottom: 10px;"></textarea>
                <button onclick="crudPatch()" style="background: #000000; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">Обновить</button>
            </div>

            <!-- Блок DELETE -->
            <div style="background: #f8faff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin-top: 0; font-size: 16px; color: #334155;">DELETE: удалить пост</h3>
                <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px;">
                    <label style="font-size: 14px; color: #475569;">ID поста:</label>
                    <input type="number" id="delete-id" style="width: 100px; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
                    <button onclick="crudDelete()" style="background: #ef4444; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">Удалить</button>
                </div>
            </div>

            <!-- Статус и вывод данных -->
            <div id="crud-status" style="background: #e2e8f0; color: #475569; padding: 12px; border-radius: 4px; margin-bottom: 10px; font-size: 14px;">Ожидание действий...</div>
            <pre id="crud-output" style="border: 1px solid #cbd5e1; padding: 15px; border-radius: 4px; min-height: 50px; background: white; font-family: monospace; font-size: 13px; color: #0f172a;"</pre>
        </div>
    `;
}

function updateCrudStatus(message, isError = false) {
  const statusEl = document.getElementById('crud-status');
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#dc2626' : '#059669';
  statusEl.style.fontWeight = 'bold';
}

function updateCrudOutput(data) {
  document.getElementById('crud-output').textContent = JSON.stringify(data, null, 2);
}

async function crudGet() {
  updateCrudStatus("Загрузка постов...");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
    const data = await response.json();
    updateCrudStatus("Успешно: загружено 3 поста");
    updateCrudOutput(data);
  } catch (error) {
    updateCrudStatus(`Ошибка GET: ${error.message}`, true);
  }
}

// Метод POST
async function crudPost() {
  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;

  updateCrudStatus("Создание поста...");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, body: body, userId: 1 })
    });
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
    const data = await response.json();
    updateCrudStatus(`Успешно: создан пост с ID ${data.id}`);
    updateCrudOutput(data);
  } catch (error) {
    updateCrudStatus(`Ошибка POST: ${error.message}`, true);
  }
}
async function crudPatch() {
  const id = document.getElementById('patch-id').value;
  const title = document.getElementById('patch-title').value;
  const body = document.getElementById('patch-body').value;

  if (!id) return updateCrudStatus("Ошибка: введите ID поста для обновления!", true);

  updateCrudStatus(`Обновление поста ${id}...`);
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, body: body })
    });
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
    const data = await response.json();
    updateCrudStatus(`Успешно: пост ${id} обновлен`);
    updateCrudOutput(data);
  } catch (error) {
    updateCrudStatus(`Ошибка PATCH: ${error.message}`, true);
  }
}

async function crudDelete() {
  const id = document.getElementById('delete-id').value;

  if (!id) return updateCrudStatus("Ошибка: введите ID поста для удаления!", true);

  updateCrudStatus(`Удаление поста ${id}...`);
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

    updateCrudStatus(`Успешно: статус ответа ${response.status} (Пост удален)`);
    updateCrudOutput({});
  } catch (error) {
    updateCrudStatus(`Ошибка DELETE: ${error.message}`, true);
  }
}