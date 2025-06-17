// Elementos do DOM
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const applySettings = document.getElementById('applySettings');
const resetGame = document.getElementById('resetGame');
const resetBtnFooter = document.getElementById('resetBtnFooter');
const undoBtnFooter = document.getElementById('undoBtnFooter');

// Elementos dos temporizadores
const timerToggle = document.getElementById('timerToggle');
const timerReset = document.getElementById('timerReset');
const timerElement = document.getElementById('timer');
const mainTimerToggle = document.getElementById('mainTimerToggle');
const mainTimerReset = document.getElementById('mainTimerReset');
const mainTimerElement = document.getElementById('mainTimer');

// Elementos dos jogadores
const player1Life = document.getElementById('player1Life');
const player2Life = document.getElementById('player2Life');
const player1Name = document.getElementById('player1Name');
const player2Name = document.getElementById('player2Name');
const player1Bioenergia = document.getElementById('player1Bioenergia');
const player2Bioenergia = document.getElementById('player2Bioenergia');

// Elementos de configuração
const startingLifeInput = document.getElementById('startingLife');
const player1NameInput = document.getElementById('player1NameInput');
const player2NameInput = document.getElementById('player2NameInput');
const gameDurationInput = document.getElementById('gameDuration');
const gameDurationValue = document.getElementById('gameDurationValue');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Primeiro, verificar o desempenho do dispositivo e aplicar classes apropriadas
    const performanceLevel = getPerformanceLevel ? getPerformanceLevel() : 
                            (isLowPerformanceDevice() ? 'low' : 'high');
    
    if (performanceLevel === 'veryLow') {
        document.body.classList.add('very-low-performance');
    } else if (performanceLevel === 'low') {
        document.body.classList.add('low-performance');
    } else if (performanceLevel === 'medium') {
        document.body.classList.add('medium-performance');
    }
    
    // Inicializar componentes essenciais imediatamente
    updateSliderAppearance(gameDurationInput);
    
    // Usar requestIdleCallback para inicializar o jogo quando o navegador estiver ocioso
    // Isso melhora o tempo de carregamento inicial
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            initGame();
        }, { timeout: 1000 });
    } else {
        // Fallback para setTimeout
        setTimeout(() => {
            initGame();
        }, 100);
    }
    
    // Adicionar listener para detectar quando o dispositivo fica com pouca bateria
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            // Verificar o nível inicial da bateria
            if (battery.level < 0.15 && !battery.charging) {
                document.body.classList.add('very-low-performance');
                console.log("Modo de economia de bateria ativado automaticamente");
            }
            
            // Monitorar mudanças no nível da bateria
            battery.addEventListener('levelchange', () => {
                if (battery.level < 0.15 && !battery.charging && 
                    !document.body.classList.contains('very-low-performance')) {
                    document.body.classList.add('very-low-performance');
                    showNotification("Modo de economia de bateria ativado automaticamente");
                }
            });
        }).catch(err => console.log("Erro ao acessar informações da bateria:", err));
    }
    
    // Monitorar uso de memória (se disponível) para ajustar desempenho dinamicamente
    if (window.performance && window.performance.memory) {
        setInterval(() => {
            const memoryInfo = window.performance.memory;
            const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
            
            // Se o uso de memória for alto (mais de 80%), reduzir o desempenho
            if (memoryUsage > 0.8 && !document.body.classList.contains('very-low-performance')) {
                document.body.classList.add('very-low-performance');
                console.log("Modo de economia de memória ativado automaticamente");
            }
        }, 30000); // Verificar a cada 30 segundos
    }
    
    // Configurar o modal de configurações
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
        startingLifeInput.value = gameState.player1.life;
        player1NameInput.value = gameState.player1.name;
        player2NameInput.value = gameState.player2.name;
        
        // Definir o valor do slider baseado no tempo atual da partida
        const currentGameMinutes = Math.round(gameState.mainTimer.seconds / 60);
        gameDurationInput.value = currentGameMinutes;
        gameDurationValue.textContent = currentGameMinutes;
        
        // Atualizar a aparência do slider
        updateSliderAppearance(gameDurationInput);
        
        // Ajustar o modal para o tamanho da tela
        adjustModalForMobile();
        
        // Adicionar as configurações de desempenho
        setTimeout(addPerformanceSettingsToModal, 100);
    });
    
    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    applySettings.addEventListener('click', () => {
        saveState();
        const newStartingLife = parseInt(startingLifeInput.value) || DEFAULT_LIFE;
        const newGameDuration = parseInt(gameDurationInput.value) || DEFAULT_GAME_DURATION;
        
        // Atualizar nomes e pontos de vida
        gameState.player1.name = player1NameInput.value || 'Duelista 1';
        gameState.player2.name = player2NameInput.value || 'Duelista 2';
        gameState.player1.life = newStartingLife;
        gameState.player2.life = newStartingLife;
        
        // Atualizar tempos
        MAIN_TIMER_DURATION = newGameDuration * 60; // Converter minutos para segundos
        ROUND_TIMER_DURATION = calculateRoundTime(newGameDuration);
        
        // Resetar os temporizadores com os novos valores
        resetTimer(gameState.roundTimer, timerElement, timerToggle, ROUND_TIMER_DURATION);
        resetTimer(gameState.mainTimer, mainTimerElement, mainTimerToggle, MAIN_TIMER_DURATION);
        
        updateUI();
        settingsModal.style.display = 'none';
        
        showNotification('Configurações aplicadas');
    });
    
    // Botão para restaurar configurações padrão
    const defaultSettingsBtn = document.getElementById('defaultSettings');
    defaultSettingsBtn.addEventListener('click', () => {
        setDefaultSettings();
        
        // Aplicar as configurações padrão
        saveState();
        const newStartingLife = DEFAULT_LIFE;
        const newGameDuration = DEFAULT_GAME_DURATION;
        
        // Atualizar nomes e pontos de vida
        gameState.player1.name = 'Duelista 1';
        gameState.player2.name = 'Duelista 2';
        gameState.player1.life = newStartingLife;
        gameState.player2.life = newStartingLife;
        
        // Atualizar tempos
        MAIN_TIMER_DURATION = newGameDuration * 60;
        ROUND_TIMER_DURATION = calculateRoundTime(newGameDuration);
        
        // Resetar os temporizadores com os novos valores
        resetTimer(gameState.roundTimer, timerElement, timerToggle, ROUND_TIMER_DURATION);
        resetTimer(gameState.mainTimer, mainTimerElement, mainTimerToggle, MAIN_TIMER_DURATION);
        
        updateUI();
        
        // Fechar o modal
        settingsModal.style.display = 'none';
        
        showNotification('Configurações padrão aplicadas');
    });
    
    // Botões de ação
    resetGame.addEventListener('click', resetGameState);
    resetBtnFooter.addEventListener('click', resetGameState);
    undoBtnFooter.addEventListener('click', undoLastAction);
    
    // Controles do temporizador de rodada
    timerToggle.addEventListener('click', () => {
        toggleTimer(gameState.roundTimer, timerElement, timerToggle);
    });
    
    timerReset.addEventListener('click', () => {
        resetTimer(gameState.roundTimer, timerElement, timerToggle, ROUND_TIMER_DURATION);
    });
    
    // Controles do temporizador principal
    mainTimerToggle.addEventListener('click', () => {
        toggleTimer(gameState.mainTimer, mainTimerElement, mainTimerToggle);
    });
    
    mainTimerReset.addEventListener('click', () => {
        resetTimer(gameState.mainTimer, mainTimerElement, mainTimerToggle, MAIN_TIMER_DURATION);
    });
    
    // Fechar o modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // Ajustar o modal quando a orientação da tela mudar (com debounce para melhor performance)
    window.addEventListener('resize', debounce(() => {
        if (settingsModal.style.display === 'block') {
            adjustModalForMobile();
        }
    }, 250));
    
    // Função para alternar tela cheia
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenIcon = fullscreenBtn.querySelector('i');
    
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                showNotification(`Erro ao ativar o modo tela cheia: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // Atualizar o ícone quando o estado de tela cheia mudar
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    
    // Atualizar o valor exibido do slider de duração do jogo
    gameDurationInput.addEventListener('input', () => {
        gameDurationValue.textContent = gameDurationInput.value;
        
        // Atualizar a aparência do slider
        updateSliderAppearance(gameDurationInput);
    });
    
    // Controles de vida
    document.getElementById('player1LifePlus').addEventListener('click', () => {
        saveState();
        gameState.player1.life++;
        updateUI();
        animateLifeChange('player1Life');
    });
    
    document.getElementById('player1LifeMinus').addEventListener('click', () => {
        saveState();
        gameState.player1.life--;
        updateUI();
        animateLifeChange('player1Life');
    });
    
    document.getElementById('player2LifePlus').addEventListener('click', () => {
        saveState();
        gameState.player2.life++;
        updateUI();
        animateLifeChange('player2Life');
    });
    
    document.getElementById('player2LifeMinus').addEventListener('click', () => {
        saveState();
        gameState.player2.life--;
        updateUI();
        animateLifeChange('player2Life');
    });
    
    // Controles de bioenergia
    document.getElementById('player1BioenergiaPlus').addEventListener('click', () => {
        saveState();
        gameState.player1.bioenergia++;
        updateUI();
    });
    
    document.getElementById('player1BioenergiaMin').addEventListener('click', () => {
        if (gameState.player1.bioenergia > 0) {
            saveState();
            gameState.player1.bioenergia--;
            updateUI();
        } else {
            // Apenas animar o botão quando bioenergia for 0, sem remover a classe disabled
            const button = document.getElementById('player1BioenergiaMin');
            button.classList.add('shake');
            setTimeout(() => {
                button.classList.remove('shake');
            }, 300);
        }
    });
    
    document.getElementById('player2BioenergiaPlus').addEventListener('click', () => {
        saveState();
        gameState.player2.bioenergia++;
        updateUI();
    });
    
    document.getElementById('player2BioenergiaMin').addEventListener('click', () => {
        if (gameState.player2.bioenergia > 0) {
            saveState();
            gameState.player2.bioenergia--;
            updateUI();
        } else {
            // Apenas animar o botão quando bioenergia for 0, sem remover a classe disabled
            const button = document.getElementById('player2BioenergiaMin');
            button.classList.add('shake');
            setTimeout(() => {
                button.classList.remove('shake');
            }, 300);
        }
    });
});