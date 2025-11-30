// Variables de Selección del DOM
const cards = document.querySelectorAll(".card");
const startScreen = document.querySelector(".start-screen");
const gameBoard = document.querySelector(".game-board");
const endScreen = document.querySelector(".end-screen");       
const stopButton = document.querySelector(".stop-button"); 
const movesCountElement = document.getElementById("moves-count"); 
const timeCountElement = document.getElementById("time-count");   
const finalMovesElement = document.getElementById("final-moves-count"); 
const finalTimeElement = document.getElementById("final-time-count");

// Seleccionamos los botones de inicio/reiniciar
const startButtons = document.querySelectorAll(".start-button"); 

// Variables de Estado del Juego
let matchedCard = 0;    
let cardOne, cardTwo;   
let disableDeck = false;
let moves = 0;          
let seconds = 0;        
let minutes = 0;        
let timerInterval;      
let gameStarted = false; 

// --- Funciones del Temporizador y Stats ---

// Formatea el tiempo para que siempre tenga dos dígitos (00:00)
function formatTime() {
    let displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${displayMinutes}:${displaySeconds}`;
}

// Inicia el temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
        timeCountElement.textContent = formatTime();
    }, 1000); 
}

// Detiene el temporizador
function stopTimer() {
    clearInterval(timerInterval);
}

// Reinicia las estadísticas del juego
function resetGameStats() {
    moves = 0;
    seconds = 0;
    minutes = 0;
    movesCountElement.textContent = moves;
    timeCountElement.textContent = "00:00";
    stopTimer(); 
}

// --- Lógica de Vistas y Transición ---

// Muestra la pantalla de juego y comienza el juego
function showGame() {
    startScreen.classList.remove('active'); 
    endScreen.classList.remove('active'); 
    
    gameBoard.style.display = 'flex'; // Muestra el tablero nuevamente
    stopButton.style.display = 'block'; // Muestra el botón detener
    gameStarted = true; 

    resetGameStats(); 
    startTimer();     
    shuffleCard();
}

// Muestra la pantalla de "¡Ganaste!"
function showWinScreen() {
    stopTimer(); 
    gameStarted = false;

    // 1. Actualiza los contadores finales
    finalMovesElement.textContent = moves;
    finalTimeElement.textContent = formatTime();

    // 2. Oculta completamente el tablero y el botón de detener
    gameBoard.style.display = 'none';
    if (stopButton) stopButton.style.display = 'none';

    // 3. Muestra la pantalla de victoria
    endScreen.classList.add('active');

    // 4. Asegura que el fondo cubra todo (por si acaso)
    endScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
}

// --- Lógica de Juego ---

// 1. Detener Juego (botón "Detener Juego")
function stopGame() {
    stopTimer();
    gameStarted = false; 
    console.log(`Game Stopped. Moves: ${moves}, Time: ${formatTime()}`); 
    
    gameBoard.style.display = 'none';
    startScreen.classList.add('active');
    resetGameStats();
}

// 2. Voltear una Carta
function flipCard(e) {
    if (!gameStarted) return;
    let clickedCard = e.target.closest('.card'); 
    
    if (disableDeck) return;
    if (clickedCard === cardOne) return;

    clickedCard.classList.add("flip");
    
    if (!cardOne) {
        cardOne = clickedCard;
    } else {
        cardTwo = clickedCard;
        moves++; 
        movesCountElement.textContent = moves; 
        disableDeck = true; 

        let cardOneImage = cardOne.getAttribute("data-image");
        let cardTwoImage = cardTwo.getAttribute("data-image");
        
        checkForMatch(cardOneImage, cardTwoImage);
    }
}

// 3. Comprobar coincidencia
function checkForMatch(image1, image2) {
    if (image1 === image2) {
        matchedCard++;
        
        // Comprueba si el juego ha terminado (8 pares)
        if (matchedCard == 8) { 
            setTimeout(() => {
                showWinScreen(); 
                shuffleCard();   // Prepara las cartas para el próximo juego
            }, 500); 
        }

        // Deshabilita listeners para cartas emparejadas
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        
        resetBoard();
    } else {
        setTimeout(() => {
            cardOne.classList.remove("flip");
            cardTwo.classList.remove("flip");
            resetBoard();
        }, 1200);
    }
}

// 4. Reinicia variables de jugada
function resetBoard() {
    cardOne = cardTwo = ""; 
    disableDeck = false;    
}

// 5. Mezcla las Cartas
function shuffleCard() {
    matchedCard = 0;
    resetBoard();
    
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, index) => {
        card.classList.remove("flip"); 
        card.style.order = arr[index]; 
        card.addEventListener("click", flipCard);
    });
}

// 6. Event Listeners 
startButtons.forEach(button => {
    button.addEventListener("click", showGame); 
});

stopButton.addEventListener("click", stopGame); 

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});