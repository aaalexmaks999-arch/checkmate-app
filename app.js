import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ==========================================
// 0. СЛОВАРЬ И ЛОКАЛИЗАЦИЯ (i18n)
// ==========================================
const dict = {
    ru: {
        sub1: "Идеальный баланс", btnNewTrip: "Новая поездка", histTitle: "Мои поездки:",
        title2: "Новая группа", sub2: "Детали поездки", plcGroup: "Название (напр. Дублин)",
        lblCur: "В какой валюте считаем?", btnCont: "Продолжить",
        title3: "Кто в деле?", sub3: "Добавь имена участников", plcFriend: "Имя друга", btnExp: "К расходам",
        title4: "Наша поездка", lblTotal: "Общий расход:", emptyCheck: "Пока нет ни одного чека. Вы великолепны!",
        btnAddExp: "+ Добавить чек", btnWhoOwes: "Кто кому должен?",
        title5: "Идеальный баланс", sub5: "Кто кому переводит", btnBack: "← Назад к чекам", btnShare: "Поделиться в чате",
        modTitle: "Новый расход", plcExp: "На что скидываемся? (еда, такси)", plcSum: "Сумма", lblPayer: "Кто платил?", btnCancel: "Отмена", btnAdd: "Добавить",
        paidBy: "Оплатил(а):", errShort: "Название слишком короткое!", errTwo: "Добавьте хотя бы двух участников!",
        errSum: "Введите корректное название и сумму!", errOne: "Сначала добавьте хотя бы один чек!", delConfirm: "Точно удалить этот расход?",
        shTitle: "📊 Итоги поездки", shTrans: "💸 Кто кому переводит:", shPerf: "Идеальный баланс! Никто никому ничего не должен 😎", shBot: "Считали в CheckMate ♟️",
        btnCreating: "Создаем...", btnSaving: "Сохраняем..."
    },
    uk: {
        sub1: "Ідеальний баланс", btnNewTrip: "Нова поїздка", histTitle: "Мої поїздки:",
        title2: "Нова група", sub2: "Деталі поїздки", plcGroup: "Назва (напр. Дублін)",
        lblCur: "У якій валюті рахуємо?", btnCont: "Продовжити",
        title3: "Хто у справі?", sub3: "Додай імена учасників", plcFriend: "Ім'я друга", btnExp: "До витрат",
        title4: "Наша поїздка", lblTotal: "Загальна витрата:", emptyCheck: "Поки немає жодного чека. Ви чудові!",
        btnAddExp: "+ Додати чек", btnWhoOwes: "Хто кому винен?",
        title5: "Ідеальний баланс", sub5: "Хто кому переказує", btnBack: "← Назад до чеків", btnShare: "Поділитися в чаті",
        modTitle: "Нова витрата", plcExp: "На що скидаємося? (їжа, таксі)", plcSum: "Сума", lblPayer: "Хто платив?", btnCancel: "Скасувати", btnAdd: "Додати",
        paidBy: "Оплатив(ла):", errShort: "Назва надто коротка!", errTwo: "Додайте хоча б двох учасників!",
        errSum: "Введіть коректну назву та суму!", errOne: "Спочатку додайте хоча б один чек!", delConfirm: "Точно видалити цю витрату?",
        shTitle: "📊 Підсумки поїздки", shTrans: "💸 Хто кому переказує:", shPerf: "Ідеальний баланс! Ніхто нікому нічого не винен 😎", shBot: "Рахували в CheckMate ♟️",
        btnCreating: "Створюємо...", btnSaving: "Зберігаємо..."
    },
    en: {
        sub1: "Perfect balance", btnNewTrip: "New trip", histTitle: "My trips:",
        title2: "New group", sub2: "Trip details", plcGroup: "Name (e.g. Dublin)",
        lblCur: "Which currency?", btnCont: "Continue",
        title3: "Who is in?", sub3: "Add participant names", plcFriend: "Friend's name", btnExp: "To expenses",
        title4: "Our trip", lblTotal: "Total expense:", emptyCheck: "No receipts yet. You are awesome!",
        btnAddExp: "+ Add receipt", btnWhoOwes: "Who owes whom?",
        title5: "Perfect balance", sub5: "Who transfers to whom", btnBack: "← Back to receipts", btnShare: "Share in chat",
        modTitle: "New expense", plcExp: "What did we buy? (food, taxi)", plcSum: "Amount", lblPayer: "Who paid?", btnCancel: "Cancel", btnAdd: "Add",
        paidBy: "Paid by:", errShort: "Name is too short!", errTwo: "Add at least two participants!",
        errSum: "Enter a valid name and amount!", errOne: "Add at least one receipt first!", delConfirm: "Delete this expense?",
        shTitle: "📊 Trip summary", shTrans: "💸 Who transfers to whom:", shPerf: "Perfect balance! Nobody owes anything 😎", shBot: "Calculated in CheckMate ♟️",
        btnCreating: "Creating...", btnSaving: "Saving..."
    },
    de: {
        sub1: "Perfekte Balance", btnNewTrip: "Neue Reise", histTitle: "Meine Reisen:",
        title2: "Neue Gruppe", sub2: "Reisedetails", plcGroup: "Name (z.B. Dublin)",
        lblCur: "In welcher Währung?", btnCont: "Weiter",
        title3: "Wer ist dabei?", sub3: "Teilnehmer hinzufügen", plcFriend: "Name des Freundes", btnExp: "Zu den Ausgaben",
        title4: "Unsere Reise", lblTotal: "Gesamtausgaben:", emptyCheck: "Noch keine Belege. Ihr seid großartig!",
        btnAddExp: "+ Beleg hinzufügen", btnWhoOwes: "Wer schuldet wem?",
        title5: "Perfekte Balance", sub5: "Wer überweist wem", btnBack: "← Zurück zu Belegen", btnShare: "Im Chat teilen",
        modTitle: "Neue Ausgabe", plcExp: "Wofür? (Essen, Taxi)", plcSum: "Betrag", lblPayer: "Wer hat bezahlt?", btnCancel: "Abbrechen", btnAdd: "Hinzufügen",
        paidBy: "Bezahlt von:", errShort: "Name ist zu kurz!", errTwo: "Füge mindestens 2 Teilnehmer hinzu!",
        errSum: "Gib einen gültigen Namen und Betrag ein!", errOne: "Füge zuerst mindestens einen Beleg hinzu!", delConfirm: "Diese Ausgabe wirklich löschen?",
        shTitle: "📊 Reisezusammenfassung", shTrans: "💸 Wer überweist wem:", shPerf: "Perfekte Balance! Niemand schuldet etwas 😎", shBot: "Berechnet in CheckMate ♟️",
        btnCreating: "Wird erstellt...", btnSaving: "Wird gespeichert..."
    }
};

let currentLang = localStorage.getItem('appLang') || 'ru'; 
const t = (key) => dict[currentLang][key] || key; 

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    const emptyState = document.querySelector('.empty-state');
    if (emptyState && totalAmount === 0) emptyState.innerText = t('emptyCheck');
}

const langSelect = document.getElementById('lang-select');
langSelect.value = currentLang;
langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    localStorage.setItem('appLang', currentLang); 
    applyTranslations();
});

// ==========================================
// 1. НАСТРОЙКИ И ИНИЦИАЛИЗАЦИЯ
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBxD1oprF3005a1SQeu6lYsozNemw_TX0Y",
    authDomain: "checkmate-98462.firebaseapp.com",
    projectId: "checkmate-98462",
    storageBucket: "checkmate-98462.firebasestorage.app",
    messagingSenderId: "415222948042",
    appId: "1:415222948042:web:c4118ceb134a217a365433"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tg = window.Telegram.WebApp;

tg.expand();
tg.ready();

// ==========================================
// 2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ==========================================
let members = [];
let currentGroupId = null;
let currentGroupName = "";
let currentCurrency = "€"; 
let totalAmount = 0;
let editingExpenseId = null; // ID чека, который редактируем
let balances = {}; // Новая система: { "Иван": 15.5, "Олег": -15.5 }


// ВОТ ЗДЕСЬ И БЫЛА ОШИБКА! Теперь мы вызываем перевод ТОЛЬКО ПОСЛЕ того, как создали переменные!
applyTranslations(); 

// ПОИСК ЭЛЕМЕНТОВ
const screen1 = document.getElementById('screen-1');
const screen2 = document.getElementById('screen-2');
const screen3 = document.getElementById('screen-3');
const screen4 = document.getElementById('screen-4');
const screen5 = document.getElementById('screen-5');

const mainButton = document.getElementById('new-trip-btn');
const createBtn = document.getElementById('create-group-btn');
const groupInput = document.getElementById('group-name');
const groupCurrencySelect = document.getElementById('group-currency');
const currencySymbolEl = document.getElementById('currency-symbol');

const memberInput = document.getElementById('member-name');
const addMemberBtn = document.getElementById('add-member-btn');
const membersList = document.getElementById('members-list');
const startAppBtn = document.getElementById('start-app-btn');
const dashboardGroupName = document.getElementById('dashboard-group-name');

// ЗАГРУЗКА ИСТОРИИ
const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');

async function loadHistory() {
    const userId = tg.initDataUnsafe?.user?.id;
    if (!userId) return; 

    try {
        const q = query(collection(db, "groups"), where("owner_id", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            historySection.classList.remove('hidden'); 
            historyList.innerHTML = ''; 

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerText = data.title; 
                
                historyItem.addEventListener('click', () => loadGroupData(docSnap.id, data));
                historyList.appendChild(historyItem);
            });
        }
    } catch (e) { console.error("Ошибка загрузки:", e); }
}

async function loadGroupData(groupId, groupData) {
    tg.HapticFeedback.impactOccurred('medium');
    currentGroupId = groupId;
    currentGroupName = groupData.title;
    currentCurrency = groupData.currency || "€"; 
    members = groupData.members || [];
    
    // СБРОС ДАННЫХ ПЕРЕД ЗАГРУЗКОЙ НОВОЙ ГРУППЫ
    totalAmount = 0;
    balances = {}; // ИСПОЛЬЗУЕМ БАЛАНСЫ ВМЕСТО paidAmounts
    members.forEach(m => balances[m] = 0); // Обнуляем балансы всех участников
    
    expensesList.innerHTML = ''; 

    try {
        const expensesSnap = await getDocs(collection(db, "groups", groupId, "expenses"));
        if (expensesSnap.empty) {
            expensesList.innerHTML = `<p class="empty-state">${t('emptyCheck')}</p>`;
        } else {
            expensesSnap.forEach((expDoc) => {
                const expData = expDoc.data();
                const amount = expData.amount;
                const payer = expData.payer;
                
                // Читаем участников чека (если старый чек, считаем что скидывались все)
                const involved = expData.involved || members; 

                totalAmount += amount;
                
                // СЧИТАЕМ БАЛАНСЫ
                if (balances[payer] === undefined) balances[payer] = 0;
                balances[payer] += amount; // Плательщику плюсуем сумму

                const splitAmount = amount / involved.length; 
                involved.forEach(person => {
                    if (balances[person] !== undefined) {
                        balances[person] -= splitAmount; // Тем за кого платили - минусуем
                    }
                });

                // Формируем текст "Для кого"
                let forWhomText = involved.length === members.length ? "Для всех" : `Для: ${involved.join(', ')}`;

                const expenseItem = document.createElement('div');
                expenseItem.className = 'expense-item';
                expenseItem.innerHTML = `
                    <div class="expense-info">
                        <div class="expense-title">${expData.title}</div>
                        <div class="expense-payer">${t('paidBy')} ${payer}</div>
                        <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 2px;">${forWhomText}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="expense-amount">${amount} ${currentCurrency}</div>
                        <button class="delete-btn" data-id="${expDoc.id}" data-amount="${amount}" data-payer="${payer}" data-involved='${JSON.stringify(involved)}'>×</button>
                    </div>
                `;
                expensesList.appendChild(expenseItem);
            });
        }
        
        dashboardGroupName.innerText = currentGroupName;
        totalExpenseEl.innerText = totalAmount;
        currencySymbolEl.innerText = currentCurrency; 
        
        screen1.classList.add('hidden');
        screen4.classList.remove('hidden');
    } catch (e) {
        // Раньше тут было пусто catch(e) {}, теперь выводим ошибку в консоль
        console.error("Ошибка загрузки чеков:", e); 
    }
}

loadHistory();

// ЛОГИКА ЭКРАНОВ
mainButton.addEventListener('click', () => {
    screen1.classList.add('hidden');
    screen2.classList.remove('hidden');
});

createBtn.addEventListener('click', async () => {
    const name = groupInput.value.trim();
    const currency = groupCurrencySelect.value; 
    if (name.length < 3) { tg.showAlert(t('errShort')); return; }
    try {
        createBtn.disabled = true; createBtn.innerText = t('btnCreating');
        const docRef = await addDoc(collection(db, "groups"), {
            title: name, currency: currency,
            owner_id: tg.initDataUnsafe?.user?.id || "unknown", owner_name: tg.initDataUnsafe?.user?.first_name || "Аноним",
            created_at: serverTimestamp()
        });
        currentGroupId = docRef.id; currentGroupName = name; currentCurrency = currency; 
        currencySymbolEl.innerText = currentCurrency;
        screen2.classList.add('hidden'); screen3.classList.remove('hidden');
    } catch (e) {
        createBtn.disabled = false; createBtn.innerText = t('btnCont');
    }
});

addMemberBtn.addEventListener('click', () => {
    const name = memberInput.value.trim();
    if (name) {
        members.push(name);
        const chip = document.createElement('div');
        chip.className = 'member-chip'; chip.innerText = name;
        membersList.appendChild(chip); memberInput.value = ''; 
    }
});

startAppBtn.addEventListener('click', async () => {
    if (members.length < 2) { tg.showAlert(t('errTwo')); return; }
    try {
        startAppBtn.disabled = true; startAppBtn.innerText = t('btnSaving');
        await updateDoc(doc(db, "groups", currentGroupId), { members: members });
        dashboardGroupName.innerText = currentGroupName;
        screen3.classList.add('hidden'); screen4.classList.remove('hidden');
    } catch (e) {
        startAppBtn.disabled = false; startAppBtn.innerText = t('btnExp');
    }
});

// ВСПЛЫВАЮЩЕЕ ОКНО ЧЕКОВ
const addExpenseBtn = document.getElementById('add-expense-btn');
const modalOverlay = document.getElementById('expense-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const payerSelect = document.getElementById('payer-select');
const saveExpenseBtn = document.getElementById('save-expense-btn');
const expensesList = document.getElementById('expenses-list');
const totalExpenseEl = document.getElementById('total-expense');

addExpenseBtn.addEventListener('click', () => {
    tg.HapticFeedback.impactOccurred('light');
    payerSelect.innerHTML = '';
    
    const participantsContainer = document.getElementById('participants-checkboxes');
    participantsContainer.innerHTML = '';

    members.forEach(member => {
        // Заполняем селект "Кто платил"
        const option = document.createElement('option'); 
        option.value = member; 
        option.innerText = member;
        payerSelect.appendChild(option);

        // Генерируем чекбоксы "За кого"
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '10px';
        label.style.color = '#fff';
        label.style.cursor = 'pointer';
        label.style.fontSize = '1rem';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = member;
        checkbox.checked = true; // По умолчанию скидываются все
        checkbox.className = 'participant-cb';
        checkbox.style.width = '18px';
        checkbox.style.height = '18px';
        checkbox.style.accentColor = '#4cd964'; // Цвет галочки
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(member));
        participantsContainer.appendChild(label);
    });
    
    modalOverlay.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    tg.HapticFeedback.impactOccurred('light'); modalOverlay.classList.add('hidden');
    document.getElementById('expense-title').value = ''; document.getElementById('expense-amount').value = '';
});

saveExpenseBtn.addEventListener('click', async () => {
    const title = document.getElementById('expense-title').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const payer = payerSelect.value;

    // СОБИРАЕМ ОТМЕЧЕННЫХ УЧАСТНИКОВ
    const checkboxes = document.querySelectorAll('.participant-cb:checked');
    const involved = Array.from(checkboxes).map(cb => cb.value);

    if (involved.length === 0) { 
        tg.showAlert("Выберите хотя бы одного участника!"); 
        return; 
    }
    if (!title || isNaN(amount) || amount <= 0) { tg.showAlert(t('errSum')); return; }

    try {
        saveExpenseBtn.disabled = true; saveExpenseBtn.innerText = t('btnSaving');
        tg.HapticFeedback.impactOccurred('medium');

        if (editingExpenseId) {
            // ЕСЛИ РЕДАКТИРУЕМ СТАРЫЙ ЧЕК
            await updateDoc(doc(db, "groups", currentGroupId, "expenses", editingExpenseId), {
                title: title, amount: amount, payer: payer, involved: involved
            });
            editingExpenseId = null; // Сбрасываем режим редактирования после сохранения
        } else {
            // ЕСЛИ СОЗДАЕМ НОВЫЙ ЧЕК
            await addDoc(collection(db, "groups", currentGroupId, "expenses"), {
                title: title, amount: amount, payer: payer, involved: involved, created_at: serverTimestamp()
            });
        }

        modalOverlay.classList.add('hidden');
        document.getElementById('expense-title').value = ''; document.getElementById('expense-amount').value = '';
        saveExpenseBtn.disabled = false; saveExpenseBtn.innerText = t('btnAdd');

        // 🔥 ВМЕСТО РУЧНОЙ ОТРИСОВКИ ПРОСТО ОБНОВЛЯЕМ ВЕСЬ СПИСОК ИЗ БАЗЫ
        loadGroupData(currentGroupId, {title: currentGroupName, currency: currentCurrency, members: members});
        
    } catch (e) {
        saveExpenseBtn.disabled = false; saveExpenseBtn.innerText = t('btnAdd');
        console.error(e);
    }
});

// ОБРАБОТКА КЛИКОВ ПО КАРТОЧКЕ ЧЕКА (РЕДАКТИРОВАНИЕ И УДАЛЕНИЕ)
expensesList.addEventListener('click', async (e) => {
    // 1. ЕСЛИ НАЖАЛИ УДАЛИТЬ
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        const performDelete = async () => {
            try {
                await deleteDoc(doc(db, "groups", currentGroupId, "expenses", id));
                if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
                // Перезагружаем данные группы, чтобы балансы пересчитались идеально точно
                loadGroupData(currentGroupId, {title: currentGroupName, currency: currentCurrency, members: members});
            } catch (error) { console.error(error); }
        };

        if (tg.initDataUnsafe && Object.keys(tg.initDataUnsafe).length > 0) {
            tg.showConfirm(t('delConfirm'), (confirmed) => { if (confirmed) performDelete(); });
        } else {
            if (window.confirm(t('delConfirm'))) performDelete();
        }
        return;
    }

    // 2. ЕСЛИ НАЖАЛИ РЕДАКТИРОВАТЬ
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
        tg.HapticFeedback.impactOccurred('light');
        
        editingExpenseId = editBtn.getAttribute('data-id');
        const title = editBtn.getAttribute('data-title');
        const amount = editBtn.getAttribute('data-amount');
        const payer = editBtn.getAttribute('data-payer');
        const involved = JSON.parse(editBtn.getAttribute('data-involved'));

        // Заполняем модалку старыми данными
        document.getElementById('expense-title').value = title;
        document.getElementById('expense-amount').value = amount;
        
        // Перерисовываем селекты и чекбоксы
        payerSelect.innerHTML = '';
        const participantsContainer = document.getElementById('participants-checkboxes');
        participantsContainer.innerHTML = '';

        members.forEach(member => {
            // Селект "Кто платил"
            const option = document.createElement('option'); 
            option.value = member; option.innerText = member;
            if (member === payer) option.selected = true;
            payerSelect.appendChild(option);

            // Чекбоксы "За кого"
            const label = document.createElement('label');
            label.style.display = 'flex'; label.style.alignItems = 'center'; label.style.gap = '10px'; label.style.color = '#fff'; label.style.cursor = 'pointer'; label.style.fontSize = '1rem';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.value = member; checkbox.className = 'participant-cb';
            checkbox.style.width = '18px'; checkbox.style.height = '18px'; checkbox.style.accentColor = '#4cd964';
            
            // Ставим галочку только тем, кто был в чеке
            if (involved.includes(member)) checkbox.checked = true;
            
            label.appendChild(checkbox); label.appendChild(document.createTextNode(member));
            participantsContainer.appendChild(label);
        });

        document.getElementById('save-expense-btn').innerText = "Сохранить"; // Меняем текст кнопки
        modalOverlay.classList.remove('hidden');
    }
});

// РАСЧЕТ ДОЛГОВ И ШЕРИНГ
const viewDebtsBtn = document.getElementById('view-debts-btn');
const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
const debtsList = document.getElementById('debts-list');
const shareBtn = document.getElementById('share-btn'); 
let currentShareText = ""; 

backToDashboardBtn.addEventListener('click', () => {
    screen5.classList.add('hidden'); screen4.classList.remove('hidden');
});

viewDebtsBtn.addEventListener('click', () => {
    if (totalAmount === 0) { tg.showAlert(t('errOne')); return; }
    tg.HapticFeedback.impactOccurred('medium');
    
    let debtors = []; 
    let creditors = []; 

    // НОВАЯ ЛОГИКА: Общей доли (share) больше нет. 
    // Мы просто берем готовые балансы каждого участника.
    for (const [member, balance] of Object.entries(balances)) {
        if (balance < -0.01) {
            // Если баланс отрицательный, человек ушел в минус (он должен денег)
            debtors.push({ name: member, amount: Math.abs(balance) });
        } else if (balance > 0.01) {
            // Если баланс положительный, человек платил за других (ему должны вернуть)
            creditors.push({ name: member, amount: balance });
        }
    }

    // Сортируем от больших долгов к меньшим, чтобы минимизировать количество переводов
    debtors.sort((a, b) => b.amount - a.amount); 
    creditors.sort((a, b) => b.amount - a.amount);
    
    debtsList.innerHTML = ''; 
    
    currentShareText = `${t('shTitle')} "${currentGroupName}"\n${t('lblTotal')} ${totalAmount} ${currentCurrency}\n\n${t('shTrans')}\n`;

    if (debtors.length === 0 && creditors.length === 0) {
        currentShareText += t('shPerf');
        debtsList.innerHTML = `<p class="empty-state" style="margin-top:20px;">${t('shPerf')}</p>`;
    }

    let i = 0; let j = 0; 
    while (i < debtors.length && j < creditors.length) {
        let debtor = debtors[i]; let creditor = creditors[j];
        let amountToTransfer = Math.min(debtor.amount, creditor.amount);
        let displayAmount = Math.round(amountToTransfer * 100) / 100;

        const debtItem = document.createElement('div');
        debtItem.className = 'debt-item';
        debtItem.innerHTML = `
            <div class="debt-names"><strong>${debtor.name}</strong> <span class="arrow">→</span> <strong>${creditor.name}</strong></div>
            <div class="debt-amount">${displayAmount} ${currentCurrency}</div>
        `;
        debtsList.appendChild(debtItem);

        currentShareText += `• ${debtor.name} ➡️ ${creditor.name} : ${displayAmount} ${currentCurrency}\n`;
        debtor.amount -= amountToTransfer; creditor.amount -= amountToTransfer;
        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }
    
    currentShareText += `\n${t('shBot')}`;
    screen4.classList.add('hidden'); screen5.classList.remove('hidden');
});

shareBtn.addEventListener('click', () => {
    tg.HapticFeedback.impactOccurred('medium');
    const botUrl = 'https://t.me/checkmate_app_bot';
    const textToShare = encodeURIComponent(currentShareText);
    const urlToShare = encodeURIComponent(botUrl);
    tg.openTelegramLink(`https://t.me/share/url?url=${urlToShare}&text=${textToShare}`);
});