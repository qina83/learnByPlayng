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
        }, numbers: {
            zero: "zero",
            one: "uno",
            two: "due",
            three: "tre",
            four: "quattro",
            five: "cinque",
            six: "sei",
            seven: "sette",
            eight: "otto",
            nine: "nove"
        }, feedback: {
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
        }, numbers: {
            zero: "cero",
            one: "uno",
            two: "dos",
            three: "tres",
            four: "cuatro",
            five: "cinco",
            six: "seis",
            seven: "siete",
            eight: "ocho",
            nine: "nueve"
        }, feedback: {
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
        }, numbers: {
            zero: "zero",
            one: "one",
            two: "two",
            three: "three",
            four: "four",
            five: "five",
            six: "six",
            seven: "seven",
            eight: "eight",
            nine: "nine"
        }, feedback: {
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
let currentNumber = 0;
let currentNumberSet = [];
let currentAnimal = '';
let currentAnimalSet = [];
let gameActive = false;
let currentGameType = 'colors'; // 'colors', 'numbers', or 'animals'
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

// Palette di animali con emoji e traduzioni
const animalPalette = [
    { name: 'dog', emoji: '🐶', labelIt: 'cane', labelEs: 'perro', labelEn: 'dog' },
    { name: 'cat', emoji: '🐱', labelIt: 'gatto', labelEs: 'gato', labelEn: 'cat' },
    { name: 'cow', emoji: '🐄', labelIt: 'mucca', labelEs: 'vaca', labelEn: 'cow' },
    { name: 'pig', emoji: '🐷', labelIt: 'maiale', labelEs: 'cerdo', labelEn: 'pig' },
    { name: 'horse', emoji: '🐴', labelIt: 'cavallo', labelEs: 'caballo', labelEn: 'horse' },
    { name: 'sheep', emoji: '🐑', labelIt: 'pecora', labelEs: 'oveja', labelEn: 'sheep' },
    { name: 'chicken', emoji: '🐔', labelIt: 'pollo', labelEs: 'pollo', labelEn: 'chicken' },
    { name: 'duck', emoji: '🦆', labelIt: 'anatra', labelEs: 'pato', labelEn: 'duck' },
    { name: 'rabbit', emoji: '🐇', labelIt: 'coniglio', labelEs: 'conejo', labelEn: 'rabbit' },
    { name: 'mouse', emoji: '🐭', labelIt: 'topo', labelEs: 'ratón', labelEn: 'mouse' },
    { name: 'lion', emoji: '🦁', labelIt: 'leone', labelEs: 'león', labelEn: 'lion' },
    { name: 'elephant', emoji: '🐘', labelIt: 'elefante', labelEs: 'elefante', labelEn: 'elephant' },
    { name: 'tiger', emoji: '🐅', labelIt: 'tigre', labelEs: 'tigre', labelEn: 'tiger' },
    { name: 'bear', emoji: '🐻', labelIt: 'orso', labelEs: 'oso', labelEn: 'bear' },
    { name: 'monkey', emoji: '🐒', labelIt: 'scimmia', labelEs: 'mono', labelEn: 'monkey' },
    { name: 'fish', emoji: '🐟', labelIt: 'pesce', labelEs: 'pez', labelEn: 'fish' }
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
            } else if (game === 'numbers') {
                startNumberGame();
            } else if (game === 'animals') {
                startAnimalGame();
            }
        });
    });

    // Controlli gioco colori
    document.getElementById('backBtn').addEventListener('click', () => showScreen('gameScreen'));
    document.getElementById('playAgainBtn').addEventListener('click', playColorSound);
    document.getElementById('nextRoundBtn').addEventListener('click', nextRound);

    // Controlli gioco numeri
    document.getElementById('numberBackBtn').addEventListener('click', () => showScreen('gameScreen'));
    document.getElementById('numberPlayAgainBtn').addEventListener('click', playNumberSound);
    document.getElementById('numberNextRoundBtn').addEventListener('click', nextRound);

    // Controlli gioco animali
    document.getElementById('animalBackBtn').addEventListener('click', () => showScreen('gameScreen'));
    document.getElementById('animalPlayAgainBtn').addEventListener('click', playAnimalSound);
    document.getElementById('animalNextRoundBtn').addEventListener('click', nextRound);

    // Click sui quadrati colorati
    document.querySelectorAll('.color-square').forEach(square => {
        square.addEventListener('click', function () {
            if (gameActive && currentGameType === 'colors') {
                checkColor(this.dataset.color);
            }
        });
    });

    // Click sui quadrati dei numeri
    document.querySelectorAll('.number-square').forEach(square => {
        square.addEventListener('click', function () {
            if (gameActive && currentGameType === 'numbers') {
                checkNumber(this.dataset.number);
            }
        });
    });

    // Click sui quadrati degli animali
    document.querySelectorAll('.animal-square').forEach(square => {
        square.addEventListener('click', function () {
            if (gameActive && currentGameType === 'animals') {
                checkAnimal(this.dataset.animal);
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
    document.getElementById('numberGameTitle').textContent = `🔢 ${lang.games.numbers}`;
    document.getElementById('numberGameInstruction').textContent = lang.instruction.replace('colore', 'numero').replace('color', 'number').replace('color', 'número');
    document.getElementById('animalGameTitle').textContent = `🐶 ${lang.games.animals}`;
    document.getElementById('animalGameInstruction').textContent = lang.instruction.replace('colore', 'animale').replace('color', 'animal').replace('color', 'animal');

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
    currentGameType = 'colors';
    showScreen('colorGameScreen');
    resetGame();
    nextRound();
}

function startAnimalGame() {
    currentGameType = 'animals';
    showScreen('animalGameScreen');
    resetGame();
    nextRound();
}

function resetGame() {
    gameActive = false;
    currentColor = '';
    currentNumber = 0;
    currentAnimal = '';

    if (currentGameType === 'colors') {
        document.querySelectorAll('.color-square').forEach(square => {
            square.classList.remove('correct', 'wrong');
        });
        document.getElementById('feedback').textContent = '';
        document.getElementById('nextRoundBtn').style.display = 'none';
    } else if (currentGameType === 'numbers') {
        document.querySelectorAll('.number-square').forEach(square => {
            square.classList.remove('correct', 'wrong');
        });
        document.getElementById('numberFeedback').textContent = '';
        document.getElementById('numberNextRoundBtn').style.display = 'none';
    } else if (currentGameType === 'animals') {
        document.querySelectorAll('.animal-square').forEach(square => {
            square.classList.remove('correct', 'wrong');
        });
        document.getElementById('animalFeedback').textContent = '';
        document.getElementById('animalNextRoundBtn').style.display = 'none';
    }
}

function nextRound() {
    resetGame();

    if (currentGameType === 'colors') {
        // Genera una nuova combinazione di 4 colori casuali chiaramente diversi
        generateNewColors();

        // Seleziona uno dei 4 colori come quello da indovinare
        const randomIndex = Math.floor(Math.random() * 4);
        currentColor = currentColorSet[randomIndex];

        setTimeout(() => {
            playColorSound();
        }, 1000);
    } else if (currentGameType === 'numbers') {
        // Genera una nuova combinazione di 4 numeri casuali
        generateNewNumbers();

        // Seleziona uno dei 4 numeri come quello da indovinare
        const randomIndex = Math.floor(Math.random() * 4);
        currentNumber = currentNumberSet[randomIndex];

        setTimeout(() => {
            playNumberSound();
        }, 1000);
    } else if (currentGameType === 'animals') {
        // Genera una nuova combinazione di 4 animali casuali
        generateNewAnimals();

        // Seleziona uno dei 4 animali come quello da indovinare
        const randomIndex = Math.floor(Math.random() * 4);
        currentAnimal = currentAnimalSet[randomIndex];

        setTimeout(() => {
            playAnimalSound();
        }, 1000);
    }
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

// Funzioni per il gioco dei numeri
function generateNewNumbers() {
    // Seleziona 4 numeri casuali da 0 a 99 assicurandosi che siano diversi
    const availableNumbers = [];
    for (let i = 0; i <= 10; i++) {
        availableNumbers.push(i);
    }

    currentNumberSet = [];

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const selectedNumber = availableNumbers.splice(randomIndex, 1)[0];
        currentNumberSet.push(selectedNumber);
    }

    // Aggiorna i quadrati con i nuovi numeri
    const numberSquares = document.querySelectorAll('.number-square');
    numberSquares.forEach((square, index) => {
        square.textContent = currentNumberSet[index];
        square.dataset.number = index.toString();
    });
}

function getNumberLabel(number) {
    // Funzione per convertire numeri in parole nelle tre lingue
    const numberToWords = {
        it: {
            0: 'zero', 1: 'uno', 2: 'due', 3: 'tre', 4: 'quattro', 5: 'cinque',
            6: 'sei', 7: 'sette', 8: 'otto', 9: 'nove', 10: 'dieci',
            11: 'undici', 12: 'dodici', 13: 'tredici', 14: 'quattordici', 15: 'quindici',
            16: 'sedici', 17: 'diciassette', 18: 'diciotto', 19: 'diciannove', 20: 'venti',
            30: 'trenta', 40: 'quaranta', 50: 'cinquanta', 60: 'sessanta',
            70: 'settanta', 80: 'ottanta', 90: 'novanta'
        },
        es: {
            0: 'cero', 1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
            6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
            11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
            16: 'dieciseis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve', 20: 'veinte',
            30: 'treinta', 40: 'cuarenta', 50: 'cincuenta', 60: 'sesenta',
            70: 'setenta', 80: 'ochenta', 90: 'noventa'
        },
        en: {
            0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
            6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
            11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
            16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
            30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty',
            70: 'seventy', 80: 'eighty', 90: 'ninety'
        }
    };

    const lang = numberToWords[currentLanguage];

    // Per numeri da 0 a 20
    if (number <= 20) {
        return lang[number];
    }

    // Per numeri da 21 a 99
    if (number < 100) {
        const tens = Math.floor(number / 10) * 10;
        const ones = number % 10;

        if (ones === 0) {
            return lang[tens];
        }

        // Gestione speciale per ogni lingua
        if (currentLanguage === 'it') {
            if (tens === 20 || tens === 30) {
                // Venti -> vent, trenta -> trent per elisione
                const baseTen = lang[tens].slice(0, -1);
                return baseTen + lang[ones];
            }
            return lang[tens] + lang[ones];
        } else if (currentLanguage === 'es') {
            if (tens === 20) {
                // Numeri da 21 a 29 hanno forma speciale in spagnolo
                return 'veinti' + (ones === 1 ? 'uno' : lang[ones]);
            }
            return lang[tens] + ' y ' + lang[ones];
        } else { // inglese
            return lang[tens] + '-' + lang[ones];
        }
    }

    return number.toString();
}

function playNumberSound() {
    if (currentNumber !== undefined) {
        const numberLabel = getNumberLabel(currentNumber);
        speak(numberLabel);
        gameActive = true;
    }
}

function checkNumber(selectedNumberIndex) {
    if (!gameActive) return;

    gameActive = false;
    const feedback = document.getElementById('numberFeedback');
    const selectedSquare = document.querySelector(`[data-number="${selectedNumberIndex}"]`);

    // Trova l'indice del numero corretto
    const correctIndex = currentNumberSet.findIndex(num => num === currentNumber);
    const correctSquare = document.querySelector(`[data-number="${correctIndex}"]`);

    if (parseInt(selectedNumberIndex) === correctIndex) {
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
            .replace('{color}', getNumberLabel(currentNumber));
        feedback.textContent = wrongMsg;
        feedback.className = 'feedback error';

        speak(wrongMsg.replace('❌ ', ''));

        // Per le risposte sbagliate, mostra il pulsante per continuare
        setTimeout(() => {
            document.getElementById('numberNextRoundBtn').style.display = 'block';
        }, 2000);
    }
}

// Funzioni per il gioco degli animali
function generateNewAnimals() {
    // Seleziona 4 animali casuali dalla palette assicurandosi che siano diversi
    const availableAnimals = [...animalPalette];
    currentAnimalSet = [];

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * availableAnimals.length);
        const selectedAnimal = availableAnimals.splice(randomIndex, 1)[0];
        currentAnimalSet.push(selectedAnimal);
    }

    // Aggiorna i quadrati con i nuovi animali
    const animalSquares = document.querySelectorAll('.animal-square');
    animalSquares.forEach((square, index) => {
        square.textContent = currentAnimalSet[index].emoji;
        square.dataset.animal = index.toString();
    });
}

function getAnimalLabel(animalObj) {
    switch (currentLanguage) {
        case 'it': return animalObj.labelIt;
        case 'es': return animalObj.labelEs;
        case 'en': return animalObj.labelEn;
        default: return animalObj.labelIt;
    }
}

function playAnimalSound() {
    if (currentAnimal) {
        const animalLabel = getAnimalLabel(currentAnimal);
        speak(animalLabel);
        gameActive = true;
    }
}

function checkAnimal(selectedAnimalIndex) {
    if (!gameActive) return;

    gameActive = false;
    const feedback = document.getElementById('animalFeedback');
    const selectedSquare = document.querySelector(`[data-animal="${selectedAnimalIndex}"]`);

    // Trova l'indice dell'animale corretto
    const correctIndex = currentAnimalSet.findIndex(animal => animal === currentAnimal);
    const correctSquare = document.querySelector(`[data-animal="${correctIndex}"]`);

    if (parseInt(selectedAnimalIndex) === correctIndex) {
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
            .replace('{color}', getAnimalLabel(currentAnimal));
        feedback.textContent = wrongMsg;
        feedback.className = 'feedback error';

        speak(wrongMsg.replace('❌ ', ''));

        // Per le risposte sbagliate, mostra il pulsante per continuare
        setTimeout(() => {
            document.getElementById('animalNextRoundBtn').style.display = 'block';
        }, 2000);
    }
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