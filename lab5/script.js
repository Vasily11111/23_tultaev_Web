class Card {
    constructor(id, name, elixirCost, imageUrl) {
        this._id = id;
        this._name = name;
        this._elixirCost = elixirCost;
        this._imageUrl = imageUrl;
        this._type = 'Card';
    }

    get id() { return this._id; }
    get name() { return this._name; }
    
    getHTML(isEditMode) {
        return `<div class="card">
            <img src="${this._imageUrl}" alt="${this._name}">
            <h3>${this._name}</h3>
            <p>💧 Эликсир: ${this._elixirCost}</p>
            ${isEditMode ? `<button onclick="deleteCard('${this._id}')">Удалить</button>` : ''}
        </div>`;
    }

    toJSON() {
        return { id: this._id, name: this._name, elixirCost: this._elixirCost, imageUrl: this._imageUrl, type: this._type };
    }
}

class TroopCard extends Card {
    constructor(id, name, elixirCost, imageUrl, damage, health) {
        super(id, name, elixirCost, imageUrl);
        this._damage = damage;
        this._health = health;
        this._type = 'Troop';
    }

    getHTML(isEditMode) {
        return `<div class="card troop">
            <img src="${this._imageUrl}" alt="${this._name}">
            <h3>${this._name} (Воин)</h3>
            <p>💧 Эликсир: ${this._elixirCost}</p>
            <p>⚔️ Урон: ${this._damage}</p>
            <p>❤️ Здоровье: ${this._health}</p>
            ${isEditMode ? `<button onclick="deleteCard('${this._id}')">Удалить</button>` : ''}
        </div>`;
    }

    toJSON() {
        return { ...super.toJSON(), damage: this._damage, health: this._health };
    }
}

class SpellCard extends Card {
    constructor(id, name, elixirCost, imageUrl, radius) {
        super(id, name, elixirCost, imageUrl);
        this._radius = radius;
        this._type = 'Spell';
    }

    getHTML(isEditMode) {
        return `<div class="card spell">
            <img src="${this._imageUrl}" alt="${this._name}">
            <h3>${this._name} (Заклинание)</h3>
            <p>💧 Эликсир: ${this._elixirCost}</p>
            <p>🎯 Радиус: ${this._radius}</p>
            ${isEditMode ? `<button onclick="deleteCard('${this._id}')">Удалить</button>` : ''}
        </div>`;
    }

    toJSON() {
        return { ...super.toJSON(), radius: this._radius };
    }
}

class BuildingCard extends Card {
    constructor(id, name, elixirCost, imageUrl, lifetime) {
        super(id, name, elixirCost, imageUrl);
        this._lifetime = lifetime;
        this._type = 'Building';
    }

    getHTML(isEditMode) {
        return `<div class="card building">
            <img src="${this._imageUrl}" alt="${this._name}">
            <h3>${this._name} (Здание)</h3>
            <p>💧 Эликсир: ${this._elixirCost}</p>
            <p>⏳ Время жизни: ${this._lifetime} сек</p>
            ${isEditMode ? `<button onclick="deleteCard('${this._id}')">Удалить</button>` : ''}
        </div>`;
    }

    toJSON() {
        return { ...super.toJSON(), lifetime: this._lifetime };
    }
}

let deck = [];
let isEditMode = false;

function saveToLocalStorage() {
    localStorage.setItem('clashRoyaleDeck', JSON.stringify(deck.map(card => card.toJSON())));
}

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('clashRoyaleDeck'));
    if (!data || data.length === 0) {
        deck = [
            new TroopCard('c1', 'knight', 3, 'https://cdn.royaleapi.com/static/img/cards/knight.png', 167, 1452),
            new SpellCard('c2', 'fireball', 4, 'https://cdn.royaleapi.com/static/img/cards/fireball.png', 2.5),
            new BuildingCard('c3', 'cannon', 3, 'https://cdn.royaleapi.com/static/img/cards/cannon.png', 30)
        ];
        return;
    }

    deck = data.map(item => {
        if (item.type === 'Troop') return new TroopCard(item.id, item.name, item.elixirCost, item.imageUrl, item.damage, item.health);
        if (item.type === 'Spell') return new SpellCard(item.id, item.name, item.elixirCost, item.imageUrl, item.radius);
        if (item.type === 'Building') return new BuildingCard(item.id, item.name, item.elixirCost, item.imageUrl, item.lifetime);
        return new Card(item.id, item.name, item.elixirCost, item.imageUrl);
    });
}

function renderApp() {
    const body = document.body;
    body.innerHTML = '';

    const header = document.createElement('header');
    header.innerHTML = `
        <h1>Колода Clash Royale</h1>
        <label class="edit-mode-toggle">
            <input type="checkbox" id="editToggle" ${isEditMode ? 'checked' : ''}>
            Режим редактирования
        </label>
    `;
    body.appendChild(header);

    document.getElementById('editToggle').addEventListener('change', (e) => {
        isEditMode = e.target.checked;
        renderApp();
    });

    const main = document.createElement('main');
    
    const grid = document.createElement('div');
    grid.className = 'deck-grid';
    grid.innerHTML = deck.map(card => card.getHTML(isEditMode)).join('');
    main.appendChild(grid);

    if (isEditMode) {
        const formDiv = document.createElement('div');
        formDiv.className = 'add-form';

        formDiv.innerHTML = `
            <h3>✨ Добавить новую карту</h3>
            <input type="text" id="newName" placeholder="Название карты (англ.)" required>
            <input type="number" id="newCost" placeholder="Цена эликсира" required>
            <select id="newType" onchange="updateFormFields()">
                <option value="Troop">Воин (Troop)</option>
                <option value="Spell">Заклинание (Spell)</option>
                <option value="Building">Здание (Building)</option>
            </select>
            
            <div id="dynamicFields">
                <!-- По умолчанию показываем поля для 'Troop' -->
                <input type="number" id="newDamage" placeholder="Урон" required>
                <input type="number" id="newHealth" placeholder="Здоровье" required>
            </div>

            <button class="btn-add" onclick="addCard()">Создать</button>
        `;
        main.appendChild(formDiv);
    }

    body.appendChild(main);
}

window.updateFormFields = function() {
    const type = document.getElementById('newType').value;
    const container = document.getElementById('dynamicFields');
    
    if (type === 'Troop') {
        container.innerHTML = `
            <input type="number" id="newDamage" placeholder="Урон" required>
            <input type="number" id="newHealth" placeholder="Здоровье" required>
        `;
    } else if (type === 'Spell') {
        container.innerHTML = `
            <input type="number" id="newRadius" placeholder="Радиус (можно дробное)" step="0.1" required>
        `;
    } else if (type === 'Building') {
        container.innerHTML = `
            <input type="number" id="newLifetime" placeholder="Время жизни (сек)" required>
        `;
    }
};

window.deleteCard = function(id) {
    deck = deck.filter(card => card.id !== id);
    saveToLocalStorage();
    renderApp();
};



window.addCard = function() {
    const name = document.getElementById('newName').value;
    const cost = parseInt(document.getElementById('newCost').value);
    const type = document.getElementById('newType').value;
    
    if (!name || isNaN(cost)) {
        alert("Заполните все поля корректно!");
        return;
    }

    const newId = 'c' + Date.now();
    const defaultImage = `https://cdn.royaleapi.com/static/img/cards/${name}.png`;
    
    if (type === 'Troop') {
        const damage = parseInt(document.getElementById('newDamage').value);
        const health = parseInt(document.getElementById('newHealth').value);
        
        if (isNaN(damage) || isNaN(health)) {
            alert("Пожалуйста, введите корректный урон и здоровье!");
            return;
        }
        deck.push(new TroopCard(newId, name, cost, defaultImage, damage, health));
        
    } else if (type === 'Spell') {
        const radius = parseFloat(document.getElementById('newRadius').value);
        
        if (isNaN(radius)) {
            alert("Пожалуйста, введите корректный радиус!");
            return;
        }
        deck.push(new SpellCard(newId, name, cost, defaultImage, radius));
        
    } else if (type === 'Building') {
        const lifetime = parseInt(document.getElementById('newLifetime').value);
        
        if (isNaN(lifetime)) {
            alert("Пожалуйста, введите корректное время жизни!");
            return;
        }
        deck.push(new BuildingCard(newId, name, cost, defaultImage, lifetime));
    }

    saveToLocalStorage();
    renderApp();
};

window.onload = () => {
    loadFromLocalStorage();
    renderApp();
};