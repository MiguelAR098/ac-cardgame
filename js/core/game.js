// Constantes
const DEFAULT_LIFE = 20;
const DEFAULT_GAME_DURATION = 15; // Duração padrão da partida em minutos
let ROUND_TIMER_DURATION = 90; // 1:30 minutos em segundos
let MAIN_TIMER_DURATION = 900; // 15 minutos em segundos

// Estado do jogo
let gameState = {
    player1: {
        life: DEFAULT_LIFE,
        name: 'Duelista 1',
        bioenergia: 0
    },
    player2: {
        life: DEFAULT_LIFE,
        name: 'Duelista 2',
        bioenergia: 0
    },
    roundTimer: {
        seconds: ROUND_TIMER_DURATION,
        interval: null,
        running: false
    },
    mainTimer: {
        seconds: MAIN_TIMER_DURATION,
        interval: null,
        running: false
    },
    history: []
};

// Variáveis para controlar se a notificação de vitória já foi exibida
let player1DefeatNotified = false;
let player2DefeatNotified = false;

// Variáveis para otimização de renderização
let uiUpdatePending = false;
let uiUpdateThrottled = false;
let lastUIUpdateTime = 0;
let UI_UPDATE_THROTTLE = 100; // ms entre atualizações

// Cache para evitar atualizações desnecessárias das barras de vida
const lifeBarsCache = {
    player1: {
        width: null,
        color: null
    },
    player2: {
        width: null,
        color: null
    }
};

// Função para calcular o tempo de lance baseado na duração total
function calculateRoundTime(totalMinutes) {
    // Proporção: 15 min -> 90 seg (1:30), então para cada minuto adicional, adiciona 6 segundos
    return Math.round(totalMinutes * 6);
}

// Salvar estado do jogo no localStorage
function saveGameState() {
    try {
        const gameStateData = JSON.stringify({
            player1: gameState.player1,
            player2: gameState.player2,
            defaultLife: DEFAULT_LIFE,
            mainTimerDuration: MAIN_TIMER_DURATION,
            roundTimerDuration: ROUND_TIMER_DURATION,
            mainTimerSeconds: gameState.mainTimer.seconds,
            roundTimerSeconds: gameState.roundTimer.seconds
        });
        
        localStorage.setItem('aventurasConhecimentosGameState', gameStateData);
        return true;
    } catch (error) {
        console.log('Erro ao salvar dados: ' + error.message);
        return false;
    }
}

// Carregar estado do jogo do localStorage
function loadGameState() {
    try {
        const savedState = localStorage.getItem('aventurasConhecimentosGameState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            gameState.player1 = parsedState.player1;
            gameState.player2 = parsedState.player2;
            
            // Carregar as durações dos temporizadores se disponíveis
            if (parsedState.mainTimerDuration) {
                MAIN_TIMER_DURATION = parsedState.mainTimerDuration;
            }
            
            if (parsedState.roundTimerDuration) {
                ROUND_TIMER_DURATION = parsedState.roundTimerDuration;
            }
            
            // Carregar o estado atual dos temporizadores
            if (parsedState.mainTimerSeconds !== undefined) {
                gameState.mainTimer.seconds = parsedState.mainTimerSeconds;
            } else {
                gameState.mainTimer.seconds = MAIN_TIMER_DURATION;
            }
            
            if (parsedState.roundTimerSeconds !== undefined) {
                gameState.roundTimer.seconds = parsedState.roundTimerSeconds;
            } else {
                gameState.roundTimer.seconds = ROUND_TIMER_DURATION;
            }
        }
    } catch (error) {
        console.log('Erro ao carregar dados: ' + error.message);
        // Usar valores padrão em caso de erro
        gameState.player1.life = DEFAULT_LIFE;
        gameState.player2.life = DEFAULT_LIFE;
        gameState.mainTimer.seconds = MAIN_TIMER_DURATION;
        gameState.roundTimer.seconds = ROUND_TIMER_DURATION;
    }
}

// Inicializar o jogo com carregamento otimizado
function initGame() {
    // Detectar capacidades do dispositivo e aplicar otimizações
    applyPerformanceOptimizations();
    
    // Carregar estado do jogo
    loadGameState();
    
    // Atualizar UI com um pequeno atraso para garantir que o DOM esteja pronto
    setTimeout(() => {
        updateUI();
        updateTimerDisplay(timerElement, gameState.roundTimer.seconds);
        updateTimerDisplay(mainTimerElement, gameState.mainTimer.seconds);
    }, 0);
}

// Salvar estado atual para histórico (para função desfazer)
function saveState() {
    const currentState = JSON.stringify({
        player1: { ...gameState.player1 },
        player2: { ...gameState.player2 }
    });
    gameState.history.push(currentState);
    
    // Limitar o histórico a 10 estados para economizar memória
    if (gameState.history.length > 10) {
        gameState.history.shift();
    }
}

// Função desfazer
function undoLastAction() {
    if (gameState.history.length > 0) {
        const previousState = JSON.parse(gameState.history.pop());
        const oldPlayer1Life = gameState.player1.life;
        const oldPlayer2Life = gameState.player2.life;
        
        gameState.player1 = previousState.player1;
        gameState.player2 = previousState.player2;
        
        // Verificar se é necessário restaurar notificações de vitória
        if ((oldPlayer1Life <= 0 && gameState.player1.life > 0) || 
            (oldPlayer2Life <= 0 && gameState.player2.life > 0)) {
            player1DefeatNotified = false;
            player2DefeatNotified = false;
        }
        
        updateUI();
        showNotification('Ação desfeita');
    } else {
        showNotification('Não há ações para desfazer');
    }
}

// Função para confirmar nova partida
function confirmNewGame() {
    const startingLife = parseInt(startingLifeInput.value) || DEFAULT_LIFE;
    const gameDuration = parseInt(gameDurationInput.value) || DEFAULT_GAME_DURATION;
    
    // Atualizar tempos baseados na duração selecionada
    MAIN_TIMER_DURATION = gameDuration * 60; // Converter minutos para segundos
    ROUND_TIMER_DURATION = calculateRoundTime(gameDuration);
    
    // Salvar estado atual antes de resetar
    saveState();
    
    gameState = {
        player1: {
            life: startingLife,
            name: player1NameInput.value || 'Duelista 1',
            bioenergia: 0
        },
        player2: {
            life: startingLife,
            name: player2NameInput.value || 'Duelista 2',
            bioenergia: 0
        },
        roundTimer: {
            seconds: ROUND_TIMER_DURATION,
            interval: null,
            running: false
        },
        mainTimer: {
            seconds: MAIN_TIMER_DURATION,
            interval: null,
            running: false
        },
        history: []
    };
    
    // Resetar as flags de notificação
    player1DefeatNotified = false;
    player2DefeatNotified = false;
    
    updateUI();
    resetTimer(gameState.roundTimer, timerElement, timerToggle, ROUND_TIMER_DURATION);
    resetTimer(gameState.mainTimer, mainTimerElement, mainTimerToggle, MAIN_TIMER_DURATION);
    settingsModal.style.display = 'none';
    
    showNotification('Nova partida iniciada!');
}

function resetGameState() {
    // Mostrar confirmação personalizada antes de iniciar nova partida
    showConfirmNotification('Iniciar uma nova partida? Todos os dados atuais serão perdidos.', confirmNewGame);
}

// Função para definir configurações padrão
function setDefaultSettings() {
    startingLifeInput.value = DEFAULT_LIFE;
    gameDurationInput.value = DEFAULT_GAME_DURATION;
    gameDurationValue.textContent = DEFAULT_GAME_DURATION;
    player1NameInput.value = 'Duelista 1';
    player2NameInput.value = 'Duelista 2';
}