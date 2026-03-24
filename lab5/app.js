'use strict';

const STORAGE_KEY = 'lab5-card-deck-state-v1';

const PRESET_DATA = [
  {
    type: 'troop',
    id: 1,
    name: 'Рыцарь арены',
    cost: 3,
    description: 'Прочный боец ближнего боя, удерживает линию фронта.',
    rarity: 'Обычная',
    icon: '🛡️',
    attack: 4,
    health: 8,
    preset: true
  },
  {
    type: 'spell',
    id: 2,
    name: 'Огненный шар',
    cost: 4,
    description: 'Наносит взрывной урон и отбрасывает легкие цели.',
    rarity: 'Редкая',
    icon: '🔥',
    power: 7,
    radius: 3,
    effect: 'Урон по области',
    preset: true
  },
  {
    type: 'building',
    id: 3,
    name: 'Башня бомб',
    cost: 4,
    description: 'Защищает базу и отвлекает вражеские наземные войска.',
    rarity: 'Редкая',
    icon: '💣',
    durability: 10,
    lifetime: 40,
    purpose: 'Оборона',
    preset: true
  },
  {
    type: 'troop',
    id: 4,
    name: 'Лучницы',
    cost: 3,
    description: 'Дальний бой по воздуху и земле, работают в паре.',
    rarity: 'Обычная',
    icon: '🏹',
    attack: 3,
    health: 5,
    preset: true
  }
];

class Card {
  constructor({ id, name, cost, description, rarity, icon, preset = false }) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.description = description;
    this.rarity = rarity;
    this.icon = icon;
    this.preset = Boolean(preset);
  }

  set id(value) {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 1) {
      throw new Error('ID карты должен быть положительным целым числом');
    }
    this._id = num;
  }
  get id() {
    return this._id;
  }

  set name(value) {
    const cleaned = String(value).trim();
    if (cleaned.length < 2) {
      throw new Error('Название карты должно содержать минимум 2 символа');
    }
    this._name = cleaned;
  }
  get name() {
    return this._name;
  }

  set cost(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0 || num > 10) {
      throw new Error('Стоимость карты должна быть в диапазоне 0-10');
    }
    this._cost = num;
  }
  get cost() {
    return this._cost;
  }

  set description(value) {
    const cleaned = String(value).trim();
    if (cleaned.length < 8) {
      throw new Error('Описание карты должно содержать минимум 8 символов');
    }
    this._description = cleaned;
  }
  get description() {
    return this._description;
  }

  set rarity(value) {
    const cleaned = String(value).trim();
    if (!cleaned) {
      throw new Error('Редкость не может быть пустой');
    }
    this._rarity = cleaned;
  }
  get rarity() {
    return this._rarity;
  }

  set icon(value) {
    const cleaned = String(value).trim();
    if (!cleaned) {
      throw new Error('Символ карты не может быть пустым');
    }
    this._icon = cleaned;
  }
  get icon() {
    return this._icon;
  }

  get type() {
    return 'card';
  }

  get typeLabel() {
    return 'Карта';
  }

  get typeClass() {
    return 'card';
  }

  renderCard(extraRows) {
    return `
      <article class="card card--${this.typeClass}">
        <header class="card__head">
          <div>
            <p class="card__type">${this.typeLabel}</p>
            <h3>${esc(this.name)}</h3>
          </div>
          <span class="card__cost">${this.cost}</span>
        </header>
        <p class="card__text">${esc(this.description)}</p>
        <ul class="card__meta">
          <li><strong>Редкость:</strong> ${esc(this.rarity)}</li>
          ${extraRows}
        </ul>
        <p class="card__icon">${esc(this.icon)}</p>
        <span class="tag ${this.preset ? '' : 'tag--custom'}">${this.preset ? 'Заранее заданная' : 'Пользовательская'}</span>
      </article>
    `;
  }

  toHTML() {
    return this.renderCard('');
  }

  updateCommon(data) {
    this.name = data.name;
    this.cost = data.cost;
    this.description = data.description;
    this.rarity = data.rarity;
    this.icon = data.icon;
  }

  updateFromForm(data) {
    this.updateCommon(data);
  }

  toPlain() {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      cost: this.cost,
      description: this.description,
      rarity: this.rarity,
      icon: this.icon,
      preset: this.preset
    };
  }
}

class TroopCard extends Card {
  constructor({ attack, health, ...base }) {
    super(base);
    this.attack = attack;
    this.health = health;
  }

  set attack(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 15) {
      throw new Error('Атака войска должна быть в диапазоне 1-15');
    }
    this._attack = num;
  }
  get attack() {
    return this._attack;
  }

  set health(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 20) {
      throw new Error('Здоровье войска должно быть в диапазоне 1-20');
    }
    this._health = num;
  }
  get health() {
    return this._health;
  }

  get type() {
    return 'troop';
  }

  get typeLabel() {
    return 'Войско';
  }

  get typeClass() {
    return 'troop';
  }

  toHTML() {
    return this.renderCard(
      `<li><strong>Атака:</strong> ${this.attack}</li>
       <li><strong>Здоровье:</strong> ${this.health}</li>`
    );
  }

  updateFromForm(data) {
    this.updateCommon(data);
    this.attack = data.attack;
    this.health = data.health;
  }

  toPlain() {
    return {
      ...super.toPlain(),
      attack: this.attack,
      health: this.health
    };
  }
}

class SpellCard extends Card {
  constructor({ power, radius, effect, ...base }) {
    super(base);
    this.power = power;
    this.radius = radius;
    this.effect = effect;
  }

  set power(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 20) {
      throw new Error('Сила заклинания должна быть в диапазоне 1-20');
    }
    this._power = num;
  }
  get power() {
    return this._power;
  }

  set radius(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 8) {
      throw new Error('Радиус заклинания должен быть в диапазоне 1-8');
    }
    this._radius = num;
  }
  get radius() {
    return this._radius;
  }

  set effect(value) {
    const cleaned = String(value).trim();
    if (!cleaned) {
      throw new Error('Эффект заклинания не может быть пустым');
    }
    this._effect = cleaned;
  }
  get effect() {
    return this._effect;
  }

  get type() {
    return 'spell';
  }

  get typeLabel() {
    return 'Заклинание';
  }

  get typeClass() {
    return 'spell';
  }

  toHTML() {
    return this.renderCard(
      `<li><strong>Сила:</strong> ${this.power}</li>
       <li><strong>Радиус:</strong> ${this.radius}</li>
       <li><strong>Эффект:</strong> ${esc(this.effect)}</li>`
    );
  }

  updateFromForm(data) {
    this.updateCommon(data);
    this.power = data.power;
    this.radius = data.radius;
    this.effect = data.effect;
  }

  toPlain() {
    return {
      ...super.toPlain(),
      power: this.power,
      radius: this.radius,
      effect: this.effect
    };
  }
}

class BuildingCard extends Card {
  constructor({ durability, lifetime, purpose, ...base }) {
    super(base);
    this.durability = durability;
    this.lifetime = lifetime;
    this.purpose = purpose;
  }

  set durability(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 20) {
      throw new Error('Прочность здания должна быть в диапазоне 1-20');
    }
    this._durability = num;
  }
  get durability() {
    return this._durability;
  }

  set lifetime(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 10 || num > 90) {
      throw new Error('Время жизни здания должно быть в диапазоне 10-90');
    }
    this._lifetime = num;
  }
  get lifetime() {
    return this._lifetime;
  }

  set purpose(value) {
    const cleaned = String(value).trim();
    if (!cleaned) {
      throw new Error('Назначение здания не может быть пустым');
    }
    this._purpose = cleaned;
  }
  get purpose() {
    return this._purpose;
  }

  get type() {
    return 'building';
  }

  get typeLabel() {
    return 'Здание';
  }

  get typeClass() {
    return 'building';
  }

  toHTML() {
    return this.renderCard(
      `<li><strong>Прочность:</strong> ${this.durability}</li>
       <li><strong>Время жизни:</strong> ${this.lifetime} c</li>
       <li><strong>Назначение:</strong> ${esc(this.purpose)}</li>`
    );
  }

  updateFromForm(data) {
    this.updateCommon(data);
    this.durability = data.durability;
    this.lifetime = data.lifetime;
    this.purpose = data.purpose;
  }

  toPlain() {
    return {
      ...super.toPlain(),
      durability: this.durability,
      lifetime: this.lifetime,
      purpose: this.purpose
    };
  }
}

const state = {
  editMode: false,
  cards: [],
  nextId: 1,
  addType: 'troop'
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  const loaded = loadState();
  state.cards = loaded.cards;
  state.nextId = loaded.nextId;
  buildBody();
  bindEvents();
  render();
}

function buildBody() {
  document.body.innerHTML = `
    <header class="site-header">
      <div class="container">
        <div>
          <p class="subtitle">Лр 5</p>
          <h1>Колода карточной игры</h1>
        </div>
        <div class="edit-toggle">
          <label for="edit-mode">Режим редактирования</label>
          <input id="edit-mode" type="checkbox" />
        </div>
      </div>
    </header>

    <main class="container page-main">
      <section class="panel" aria-labelledby="deck-title">
        <div class="panel-head">
          <h2 id="deck-title">Карты колоды</h2>
          <p id="deck-status" class="status status--idle">Режим просмотра</p>
        </div>
        <div id="deck-grid" class="deck-grid"></div>
      </section>

      <section class="panel" id="editor-panel"></section>
    </main>

    <footer class="site-footer">
      <p>Карточная игра &copy; 2026</p>
    </footer>
  `;
}

function bindEvents() {
  document.body.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === 'edit-mode') {
      state.editMode = target.checked;
      render();
      return;
    }

    if (target.id === 'new-card-type' && target instanceof HTMLSelectElement) {
      state.addType = target.value;
      renderEditorPanel();
    }
  });

  document.body.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();

    if (form.dataset.action === 'save-preset') {
      savePresetCard(form);
      return;
    }

    if (form.dataset.action === 'add-card') {
      addNewCard(form);
    }
  });

  document.body.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-action="delete-custom"]') : null;
    if (!button) return;
    deleteCustomCard(Number(button.dataset.id));
  });
}

function render() {
  renderDeck();
  renderEditorPanel();
  setStatus(
    'deck-status',
    state.editMode ? 'Режим редактирования включен' : 'Режим просмотра',
    state.editMode ? 'editing' : 'idle'
  );
}

function renderDeck() {
  const root = document.getElementById('deck-grid');
  if (!root) return;

  if (state.cards.length === 0) {
    root.innerHTML = '<p class="hint">Карты пока не добавлены.</p>';
    return;
  }

  root.innerHTML = state.cards
    .map((card, index) => {
      let controls = '';

      if (state.editMode && card.preset) {
        controls = presetForm(card);
      }

      if (state.editMode && !card.preset) {
        controls = `
          <button type="button" class="button button--danger" data-action="delete-custom" data-id="${card.id}">
            Удалить пользовательскую карту
          </button>
        `;
      }

      return `
        <article class="deck-item" style="--i: ${index};">
          ${card.toHTML()}
          ${controls}
        </article>
      `;
    })
    .join('');
}

function renderEditorPanel() {
  const root = document.getElementById('editor-panel');
  if (!root) return;

  if (!state.editMode) {
    root.innerHTML = `
      <div class="panel-head">
        <h2>Добавление и удаление карт</h2>
        <p id="editor-status" class="status status--idle">Откройте режим редактирования в шапке</p>
      </div>
      <p class="hint">В режиме редактирования можно менять только заранее заданные карты, а также добавлять и удалять пользовательские карты.</p>
    `;
    return;
  }

  root.innerHTML = `
    <div class="panel-head">
      <h2>Добавление и удаление карт</h2>
      <p id="editor-status" class="status status--editing">Можно добавить новую карту или удалить пользовательскую</p>
    </div>
    ${addCardForm()}
  `;
}

function savePresetCard(form) {
  if (!state.editMode) return;

  const cardId = Number(form.dataset.id);
  const card = state.cards.find((item) => item.id === cardId && item.preset);
  if (!card) {
    setStatus('deck-status', 'Не удалось найти заранее заданную карту', 'error');
    return;
  }

  const data = formToObject(form);
  try {
    card.updateFromForm(data);
    saveState();
    renderDeck();
    setStatus('deck-status', `Карта «${card.name}» сохранена`, 'success');
  } catch (error) {
    setStatus('deck-status', error.message || 'Ошибка при сохранении карты', 'error');
  }
}

function addNewCard(form) {
  if (!state.editMode) return;

  const data = formToObject(form);
  data.id = state.nextId;
  data.preset = false;

  try {
    const card = createCardByType(data.type, data);
    state.cards.push(card);
    state.nextId += 1;
    state.addType = data.type;
    saveState();
    render();
    setStatus('editor-status', `Карта «${card.name}» добавлена`, 'success');
  } catch (error) {
    setStatus('editor-status', error.message || 'Ошибка при добавлении карты', 'error');
  }
}

function deleteCustomCard(cardId) {
  if (!state.editMode) return;

  const index = state.cards.findIndex((card) => card.id === cardId && !card.preset);
  if (index < 0) {
    setStatus('editor-status', 'Можно удалять только пользовательские карты', 'error');
    return;
  }

  state.cards.splice(index, 1);
  saveState();
  renderDeck();
  setStatus('editor-status', 'Пользовательская карта удалена', 'success');
}

function presetForm(card) {
  return `
    <form class="card-form" data-action="save-preset" data-id="${card.id}">
      <h3>Изменить заранее заданную карту</h3>
      ${textField(card.id, 'name', 'Название', card.name)}
      ${numberField(card.id, 'cost', 'Стоимость', card.cost, 0, 10)}
      ${textAreaField(card.id, 'description', 'Описание', card.description)}
      ${textField(card.id, 'rarity', 'Редкость', card.rarity)}
      ${textField(card.id, 'icon', 'Символ', card.icon)}
      ${specificFields(card, card.id)}
      <button type="submit" class="button">Сохранить изменения</button>
    </form>
  `;
}

function addCardForm() {
  const formId = 'new-card';
  return `
    <form class="add-form" data-action="add-card">
      <h3>Добавить новую карту</h3>
      <div class="field">
        <label for="new-card-type">Тип карты</label>
        <select id="new-card-type" name="type">
          ${typeOption('troop', 'Войско', state.addType)}
          ${typeOption('spell', 'Заклинание', state.addType)}
          ${typeOption('building', 'Здание', state.addType)}
        </select>
      </div>
      ${textField(formId, 'name', 'Название', '')}
      ${numberField(formId, 'cost', 'Стоимость', 3, 0, 10)}
      ${textAreaField(formId, 'description', 'Описание', '')}
      ${textField(formId, 'rarity', 'Редкость', '')}
      ${textField(formId, 'icon', 'Символ', '')}
      ${specificFieldsByType(state.addType, formId)}
      <button type="submit" class="button">Добавить карту</button>
    </form>
  `;
}

function specificFields(card, idPrefix) {
  if (card instanceof TroopCard) {
    return `
      ${numberField(idPrefix, 'attack', 'Атака', card.attack, 1, 15)}
      ${numberField(idPrefix, 'health', 'Здоровье', card.health, 1, 20)}
    `;
  }

  if (card instanceof SpellCard) {
    return `
      ${numberField(idPrefix, 'power', 'Сила', card.power, 1, 20)}
      ${numberField(idPrefix, 'radius', 'Радиус', card.radius, 1, 8)}
      ${textField(idPrefix, 'effect', 'Эффект', card.effect)}
    `;
  }

  if (card instanceof BuildingCard) {
    return `
      ${numberField(idPrefix, 'durability', 'Прочность', card.durability, 1, 20)}
      ${numberField(idPrefix, 'lifetime', 'Время жизни (сек)', card.lifetime, 10, 90)}
      ${textField(idPrefix, 'purpose', 'Назначение', card.purpose)}
    `;
  }

  return '';
}

function specificFieldsByType(type, idPrefix) {
  if (type === 'troop') {
    return `
      ${numberField(idPrefix, 'attack', 'Атака', 3, 1, 15)}
      ${numberField(idPrefix, 'health', 'Здоровье', 5, 1, 20)}
    `;
  }

  if (type === 'spell') {
    return `
      ${numberField(idPrefix, 'power', 'Сила', 5, 1, 20)}
      ${numberField(idPrefix, 'radius', 'Радиус', 2, 1, 8)}
      ${textField(idPrefix, 'effect', 'Эффект', '')}
    `;
  }

  return `
    ${numberField(idPrefix, 'durability', 'Прочность', 8, 1, 20)}
    ${numberField(idPrefix, 'lifetime', 'Время жизни (сек)', 35, 10, 90)}
    ${textField(idPrefix, 'purpose', 'Назначение', '')}
  `;
}

function textField(idPrefix, name, label, value) {
  const id = `f-${idPrefix}-${name}`;
  return `
    <div class="field">
      <label for="${id}">${label}</label>
      <input id="${id}" name="${name}" type="text" value="${escAttr(value)}" required />
    </div>
  `;
}

function numberField(idPrefix, name, label, value, min, max) {
  const id = `f-${idPrefix}-${name}`;
  return `
    <div class="field">
      <label for="${id}">${label}</label>
      <input id="${id}" name="${name}" type="number" min="${min}" max="${max}" value="${value}" required />
    </div>
  `;
}

function textAreaField(idPrefix, name, label, value) {
  const id = `f-${idPrefix}-${name}`;
  return `
    <div class="field">
      <label for="${id}">${label}</label>
      <textarea id="${id}" name="${name}" rows="2" required>${esc(value)}</textarea>
    </div>
  `;
}

function typeOption(value, label, selected) {
  return `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`;
}

function formToObject(form) {
  const data = {};
  for (const [key, value] of new FormData(form).entries()) {
    data[key] = String(value).trim();
  }
  return data;
}

function createCardByType(type, data) {
  if (type === 'troop') return new TroopCard(data);
  if (type === 'spell') return new SpellCard(data);
  if (type === 'building') return new BuildingCard(data);
  throw new Error('Неизвестный тип карты');
}

function loadState() {
  const fallbackCards = PRESET_DATA.map((item) => createCardByType(item.type, item));
  const fallbackNextId = maxCardId(fallbackCards) + 1;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { cards: fallbackCards, nextId: fallbackNextId };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.cards)) {
      return { cards: fallbackCards, nextId: fallbackNextId };
    }

    const cards = parsed.cards
      .map((item) => {
        try {
          return createCardByType(item.type, item);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (cards.length === 0) {
      return { cards: fallbackCards, nextId: fallbackNextId };
    }

    const maxId = maxCardId(cards);
    const nextId = Number.isInteger(parsed.nextId) && parsed.nextId > maxId ? parsed.nextId : maxId + 1;
    return { cards, nextId };
  } catch {
    return { cards: fallbackCards, nextId: fallbackNextId };
  }
}

function saveState() {
  const payload = {
    cards: state.cards.map((card) => card.toPlain()),
    nextId: state.nextId
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function maxCardId(cards) {
  return cards.reduce((maxId, card) => Math.max(maxId, card.id), 0);
}

function setStatus(id, text, type) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = text;
  element.className = `status status--${type}`;
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escAttr(value) {
  return esc(value).replaceAll('"', '&quot;');
}
