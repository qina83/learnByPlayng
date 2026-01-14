// Configurazione multilinguaggio
const languages = {
    it: {
        welcome: "Ciao {name}! Benvenuto nel gioco!",
        namePrompt: "🎤 Dimmi il tuo nome",
        gameTitle: "🎯 Scegli il Gioco",
        colorGameTitle: "🎨 Gioco dei Colori",
        instruction: "Clicca il colore che senti!",

        games: {
            colors: "Colori",
            numbers: "Numeri",
            animals: "Animali",
            shapes: "Forme"
        },
        feedback: {
            correct: "🎉 Bravo!",
            wrong: "❌ Era {color}",
            tryAgain: "Riprova!"
        }
    },
    es: {
        welcome: "¡Hola {name}! ¡Bienvenido al juego!",
        namePrompt: "🎤 Dime tu nombre",
        gameTitle: "🎯 Elige el Juego",
        colorGameTitle: "🎨 Juego de Colores",
        instruction: "¡Haz clic en el color que escuches!",

        games: {
            colors: "Colores",
            numbers: "Números",
            animals: "Animales",
            shapes: "Formas"
        },
        feedback: {
            correct: "🎉 ¡Muy bien!",
            wrong: "❌ Era {color}",
            tryAgain: "¡Inténtalo de nuevo!"
        }
    },
    en: {
        welcome: "Hello {name}! Welcome to the game!",
        namePrompt: "🎤 Tell me your name",
        gameTitle: "🎯 Choose the Game",
        colorGameTitle: "🎨 Color Game",
        instruction: "Click the color you hear!",

        games: {
            colors: "Colors",
            numbers: "Numbers",
            animals: "Animals",
            shapes: "Shapes"
        },
        feedback: {
            correct: "🎉 Great!",
            wrong: "❌ It was {color}",
            tryAgain: "Try again!"
        }
    }
};

// Variabili globali
let currentLanguage = 'it';
let currentUser = '';
let currentScore = 0;
let currentColor = '';
let currentColorSet = [];
let gameActive = false;
let speechSynthesis = window.speechSynthesis;
let recognition = null;

// Palette di colori chiaramente diversi
const colorPalette = [
    { name: 'red', color: '#FF0000', labelIt: 'rosso', labelEs: 'rojo', labelEn: 'red' },
    { name: 'blue', color: '#0000FF', labelIt: 'blu', labelEs: 'azul', labelEn: 'blue' },
    { name: 'yellow', color: '#FFFF00', labelIt: 'giallo', labelEs: 'amarillo', labelEn: 'yellow' },
    { name: 'green', color: '#00FF00', labelIt: 'verde', labelEs: 'verde', labelEn: 'green' },
    { name: 'orange', color: '#FF8000', labelIt: 'arancione', labelEs: 'naranja', labelEn: 'orange' },
    { name: 'purple', color: '#8000FF', labelIt: 'viola', labelEs: 'morado', labelEn: 'purple' },
    { name: 'pink', color: '#FF69B4', labelIt: 'rosa', labelEs: 'rosa', labelEn: 'pink' },
    { name: 'brown', color: '#8B4513', labelIt: 'marrone', labelEs: 'marrón', labelEn: 'brown' },
    { name: 'black', color: '#000000', labelIt: 'nero', labelEs: 'negro', labelEn: 'black' },
    { name: 'white', color: '#FFFFFF', labelIt: 'bianco', labelEs: 'blanco', labelEn: 'white' },
    { name: 'gray', color: '#808080', labelIt: 'grigio', labelEs: 'gris', labelEn: 'gray' },
    { name: 'cyan', color: '#00FFFF', labelIt: 'ciano', labelEs: 'cian', labelEn: 'cyan' }
];

// Inizializzazione
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    setupSpeechRecognition();
});

function initializeApp() {
    showScreen('languageScreen');
}

function setupEventListeners() {
    // Selezione lingua
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.dataset.lang;
            selectLanguage(lang);
        });
    });

    // Registrazione nome
    document.getElementById('recordBtn').addEventListener('click', startRecording);
    document.getElementById('confirmNameBtn').addEventListener('click', confirmName);
    document.getElementById('nameInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            confirmName();
        }
    });

    // Selezione giochi
    document.querySelectorAll('.game-btn:not(.locked)').forEach(btn => {
        btn.addEventListener('click', function () {
            const game = this.dataset.game;
            if (game === 'colors') {
                startColorGame();
            }
        });
    });

    // Controlli gioco colori
    document.getElementById('backBtn').addEventListener('click', () => showScreen('gameScreen'));
    document.getElementById('playAgainBtn').addEventListener('click', playColorSound);
    document.getElementById('nextRoundBtn').addEventListener('click', nextRound);

    // Click sui quadrati colorati
    document.querySelectorAll('.color-square').forEach(square => {
        square.addEventListener('click', function () {
            if (gameActive) {
                checkColor(this.dataset.color);
            }
        });
    });
}

function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = getLanguageCode(currentLanguage);
    }
}

function getLanguageCode(lang) {
    const codes = {
        'it': 'it-IT',
        'es': 'es-ES',
        'en': 'en-US'
    };
    return codes[lang] || 'it-IT';
}

function selectLanguage(lang) {
    currentLanguage = lang;
    updateLanguageTexts();
    if (recognition) {
        recognition.lang = getLanguageCode(lang);
    }
    showScreen('nameScreen');
    speak(languages[lang].namePrompt.replace('🎤 ', ''));
}

function updateLanguageTexts() {
    const lang = languages[currentLanguage];

    // Aggiorna tutti i testi dell'interfaccia
    document.getElementById('namePrompt').textContent = lang.namePrompt;
    document.getElementById('gameTitle').textContent = lang.gameTitle;
    document.getElementById('colorGameTitle').textContent = lang.colorGameTitle;
    document.getElementById('gameInstruction').textContent = lang.instruction;

    // Aggiorna nomi dei giochi
    document.getElementById('colorsGameLabel').textContent = lang.games.colors;
    document.getElementById('numbersGameLabel').textContent = lang.games.numbers;
    document.getElementById('animalsGameLabel').textContent = lang.games.animals;
    document.getElementById('shapesGameLabel').textContent = lang.games.shapes;
}

function startRecording() {
    if (!recognition) {
        alert('Il riconoscimento vocale non è supportato dal tuo browser');
        return;
    }

    const recordBtn = document.getElementById('recordBtn');
    const status = document.getElementById('voiceStatus');

    recordBtn.classList.add('recording');
    status.textContent = 'Sto ascoltando...';

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('nameInput').value = transcript;
        recordBtn.classList.remove('recording');
        status.textContent = '';
    };

    recognition.onerror = function () {
        recordBtn.classList.remove('recording');
        status.textContent = 'Errore nella registrazione';
    };

    recognition.onend = function () {
        recordBtn.classList.remove('recording');
        if (status.textContent === 'Sto ascoltando...') {
            status.textContent = '';
        }
    };

    recognition.start();
}

function confirmName() {
    const nameInput = document.getElementById('nameInput').value.trim();
    if (nameInput) {
        currentUser = nameInput;
        document.getElementById('userName').textContent = `👤 ${currentUser}`;

        // Azzera il punteggio quando cambia giocatore
        currentScore = 0;
        document.getElementById('score').textContent = `🏆 ${currentScore}`;

        const welcomeMsg = languages[currentLanguage].welcome.replace('{name}', currentUser);
        speak(welcomeMsg);

        showScreen('gameScreen');
    }
}

function startColorGame() {
    showScreen('colorGameScreen');
    resetGame();
    nextRound();
}

function resetGame() {
    gameActive = false;
    currentColor = '';
    document.querySelectorAll('.color-square').forEach(square => {
        square.classList.remove('correct', 'wrong');
    });
    document.getElementById('feedback').textContent = '';
    document.getElementById('nextRoundBtn').style.display = 'none';
}

function nextRound() {
    resetGame();

    // Genera una nuova combinazione di 4 colori casuali chiaramente diversi
    generateNewColors();

    // Seleziona uno dei 4 colori come quello da indovinare
    const randomIndex = Math.floor(Math.random() * 4);
    currentColor = currentColorSet[randomIndex];
    playColorSound();
}

function generateNewColors() {
    // Seleziona 4 colori casuali dalla palette assicurandosi che siano diversi
    const availableColors = [...colorPalette];
    currentColorSet = [];

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        const selectedColor = availableColors.splice(randomIndex, 1)[0];
        currentColorSet.push(selectedColor);
    }

    // Aggiorna i quadrati con i nuovi colori
    const colorSquares = document.querySelectorAll('.color-square');
    colorSquares.forEach((square, index) => {
        square.style.backgroundColor = currentColorSet[index].color;
        square.dataset.color = index.toString();

        // Aggiunge bordo nero per il bianco
        if (currentColorSet[index].name === 'white') {
            square.style.border = '2px solid #333';
        } else {
            square.style.border = '3px solid transparent';
        }
    });
}

function getColorLabel(colorObj) {
    switch (currentLanguage) {
        case 'it': return colorObj.labelIt;
        case 'es': return colorObj.labelEs;
        case 'en': return colorObj.labelEn;
        default: return colorObj.labelIt;
    }
}

function playColorSound() {
    if (currentColor) {
        const colorLabel = getColorLabel(currentColor);
        speak(colorLabel);
        gameActive = true;
    }
}

function checkColor(selectedColorIndex) {
    if (!gameActive) return;

    gameActive = false;
    const feedback = document.getElementById('feedback');
    const selectedSquare = document.querySelector(`[data-color="${selectedColorIndex}"]`);

    // Trova l'indice del colore corretto
    const correctIndex = currentColorSet.findIndex(color => color === currentColor);
    const correctSquare = document.querySelector(`[data-color="${correctIndex}"]`);

    if (parseInt(selectedColorIndex) === correctIndex) {
        // Risposta corretta
        selectedSquare.classList.add('correct');
        feedback.textContent = languages[currentLanguage].feedback.correct;
        feedback.className = 'feedback success';

        currentScore++;
        document.getElementById('score').textContent = `🏆 ${currentScore}`;

        speak(languages[currentLanguage].feedback.correct.replace('🎉 ', ''));

        // Passa automaticamente al prossimo round dopo 1.5 secondi
        setTimeout(() => {
            nextRound();
        }, 1500);

    } else {
        // Risposta sbagliata
        selectedSquare.classList.add('wrong');
        correctSquare.classList.add('correct');

        const wrongMsg = languages[currentLanguage].feedback.wrong
            .replace('{color}', getColorLabel(currentColor));
        feedback.textContent = wrongMsg;
        feedback.className = 'feedback error';

        speak(wrongMsg.replace('❌ ', ''));

        // Per le risposte sbagliate, mostra il pulsante per continuare
        setTimeout(() => {
            document.getElementById('nextRoundBtn').style.display = 'block';
        }, 2000);
    }
}

function speak(text) {
    if (speechSynthesis) {
        speechSynthesis.cancel(); // Ferma eventuali speech in corso
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = getLanguageCode(currentLanguage);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
    }
}



function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Gestione dello stato della pagina per evitare perdita di dati
window.addEventListener('beforeunload', function () {
    localStorage.setItem('gameState', JSON.stringify({
        language: currentLanguage,
        user: currentUser,
        score: currentScore
    }));
});

// Ripristina lo stato se disponibile
window.addEventListener('load', function () {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        currentLanguage = state.language || 'it';
        currentUser = state.user || '';
        currentScore = state.score || 0;

        if (currentUser) {
            document.getElementById('userName').textContent = `👤 ${currentUser}`;
            document.getElementById('score').textContent = `🏆 ${currentScore}`;
            updateLanguageTexts();
        }
    }
});