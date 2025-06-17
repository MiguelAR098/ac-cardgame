// Atualizar a interface com otimização para dispositivos de baixo desempenho
function updateUI() {
    // Evitar múltiplas atualizações em um curto período
    if (uiUpdateThrottled) {
        uiUpdatePending = true;
        return;
    }
    
    const now = performance.now();
    if (now - lastUIUpdateTime < UI_UPDATE_THROTTLE) {
        // Throttle: limitar frequência de atualizações
        uiUpdateThrottled = true;
        uiUpdatePending = true;
        setTimeout(() => {
            uiUpdateThrottled = false;
            if (uiUpdatePending) {
                uiUpdatePending = false;
                updateUI();
            }
        }, UI_UPDATE_THROTTLE);
        return;
    }
    
    lastUIUpdateTime = now;
    
    // Usar requestAnimationFrame para otimizar atualizações visuais
    requestAnimationFrame(() => {
        // Agrupar leituras do DOM
        const isLowPerf = document.body.classList.contains('low-performance') || 
                          document.body.classList.contains('very-low-performance');
        const maxNameLength = window.innerWidth < 768 ? 10 : 15;
        
        // Preparar todas as mudanças antes de aplicá-las
        const updates = {
            player1LifeText: gameState.player1.life,
            player2LifeText: gameState.player2.life,
            player1NameText: gameState.player1.name.length > maxNameLength ? 
                gameState.player1.name.substring(0, maxNameLength) + '...' : 
                gameState.player1.name,
            player2NameText: gameState.player2.name.length > maxNameLength ? 
                gameState.player2.name.substring(0, maxNameLength) + '...' : 
                gameState.player2.name,
            player1BioenergiaText: gameState.player1.bioenergia,
            player2BioenergiaText: gameState.player2.bioenergia,
            player1BioenergiaMinDisabled: gameState.player1.bioenergia <= 0,
            player2BioenergiaMinDisabled: gameState.player2.bioenergia <= 0
        };
        
        // Aplicar apenas as mudanças necessárias
        if (player1Life.textContent != updates.player1LifeText) {
            player1Life.textContent = updates.player1LifeText;
        }
        
        if (player2Life.textContent != updates.player2LifeText) {
            player2Life.textContent = updates.player2LifeText;
        }
        
        if (player1Name.textContent != updates.player1NameText) {
            player1Name.textContent = updates.player1NameText;
            player1Name.title = gameState.player1.name;
        }
        
        if (player2Name.textContent != updates.player2NameText) {
            player2Name.textContent = updates.player2NameText;
            player2Name.title = gameState.player2.name;
        }
        
        if (player1Bioenergia.textContent != updates.player1BioenergiaText) {
            player1Bioenergia.textContent = updates.player1BioenergiaText;
        }
        
        if (player2Bioenergia.textContent != updates.player2BioenergiaText) {
            player2Bioenergia.textContent = updates.player2BioenergiaText;
        }
        
        // Atualizar classes apenas se necessário
        const p1BioenergiaMin = document.getElementById('player1BioenergiaMin');
        const p2BioenergiaMin = document.getElementById('player2BioenergiaMin');
        
        if (p1BioenergiaMin.classList.contains('disabled') !== updates.player1BioenergiaMinDisabled) {
            p1BioenergiaMin.classList.toggle('disabled', updates.player1BioenergiaMinDisabled);
        }
        
        if (p2BioenergiaMin.classList.contains('disabled') !== updates.player2BioenergiaMinDisabled) {
            p2BioenergiaMin.classList.toggle('disabled', updates.player2BioenergiaMinDisabled);
        }
        
        // Atualizar barras de vida com menos frequência em dispositivos de baixo desempenho
        if (!isLowPerf || !uiUpdateThrottled) {
            updateLifeBars();
        }
        
        // Verificar se algum jogador perdeu
        checkGameOver();
        
        // Salvar estado atual no localStorage com debounce
        // Usar requestIdleCallback se disponível, ou setTimeout como fallback
        if (window.requestIdleCallback) {
            requestIdleCallback(() => saveGameState(), { timeout: 1000 });
        } else {
            setTimeout(() => saveGameState(), 500);
        }
    });
}

// Atualizar barras de vida com otimização
function updateLifeBars() {
    // Referências aos elementos DOM (armazenadas para evitar múltiplas consultas)
    const player1Bar = document.querySelector('#player1 .life-bar');
    const player2Bar = document.querySelector('#player2 .life-bar');
    
    if (!player1Bar || !player2Bar) return;
    
    // Calcular porcentagem baseada apenas no valor inicial e no valor atual do próprio jogador
    // Se o jogador tiver mais pontos que o inicial, a barra fica 100%
    // Se o jogador tiver pontos negativos, a barra fica 0%
    const player1Percent = Math.max(0, Math.min(100, (gameState.player1.life / DEFAULT_LIFE) * 100));
    const player2Percent = Math.max(0, Math.min(100, (gameState.player2.life / DEFAULT_LIFE) * 100));
    
    // Determinar cores das barras
    let player1Color, player2Color;
    
    if (gameState.player1.life <= 0) {
        player1Color = 'var(--danger-color)';
    } else if (player1Percent <= 25) {
        player1Color = 'var(--danger-color)';
    } else if (player1Percent <= 50) {
        player1Color = 'var(--warning-color)';
    } else {
        player1Color = 'var(--light-color)';
    }
    
    if (gameState.player2.life <= 0) {
        player2Color = 'var(--danger-color)';
    } else if (player2Percent <= 25) {
        player2Color = 'var(--danger-color)';
    } else if (player2Percent <= 50) {
        player2Color = 'var(--warning-color)';
    } else {
        player2Color = 'var(--light-color)';
    }
    
    // Atualizar apenas se houver mudanças (reduz reflows)
    if (lifeBarsCache.player1.width !== player1Percent) {
        player1Bar.style.width = `${player1Percent}%`;
        lifeBarsCache.player1.width = player1Percent;
    }
    
    if (lifeBarsCache.player2.width !== player2Percent) {
        player2Bar.style.width = `${player2Percent}%`;
        lifeBarsCache.player2.width = player2Percent;
    }
    
    if (lifeBarsCache.player1.color !== player1Color) {
        player1Bar.style.backgroundColor = player1Color;
        lifeBarsCache.player1.color = player1Color;
    }
    
    if (lifeBarsCache.player2.color !== player2Color) {
        player2Bar.style.backgroundColor = player2Color;
        lifeBarsCache.player2.color = player2Color;
    }
}

// Animar mudança de pontos de vida com otimização para dispositivos de baixo desempenho
function animateLifeChange(elementId) {
    const element = document.getElementById(elementId);
    
    // Verificar se o dispositivo é de baixo desempenho
    const isLowPerf = document.body.classList.contains('low-performance') || 
                      document.body.classList.contains('very-low-performance');
    
    if (isLowPerf) {
        // Para dispositivos de baixo desempenho, usar uma animação mais simples ou nenhuma
        if (document.body.classList.contains('very-low-performance')) {
            // Sem animação para dispositivos muito fracos
            return;
        }
        
        // Animação simplificada para dispositivos de baixo desempenho
        element.style.transition = 'transform 0.2s ease';
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    } else {
        // Animação normal para dispositivos de bom desempenho
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 500);
    }
}

// Verificar fim de jogo
function checkGameOver() {
    if (gameState.player1.life <= 0 && !player1DefeatNotified) {
        showNotification(`${gameState.player2.name} VENCEU O DUELO!`, true);
        pauseTimer(gameState.roundTimer);
        pauseTimer(gameState.mainTimer);
        player1DefeatNotified = true;
    } else if (gameState.player1.life > 0) {
        player1DefeatNotified = false;
    }
    
    if (gameState.player2.life <= 0 && !player2DefeatNotified) {
        showNotification(`${gameState.player1.name} VENCEU O DUELO!`, true);
        pauseTimer(gameState.roundTimer);
        pauseTimer(gameState.mainTimer);
        player2DefeatNotified = true;
    } else if (gameState.player2.life > 0) {
        player2DefeatNotified = false;
    }
}

// Ajustar o modal para dispositivos móveis
function adjustModalForMobile() {
    const viewportHeight = window.innerHeight;
    const modalContent = document.querySelector('.modal-content');
    
    if (viewportHeight < 500) {
        // Para telas muito baixas, ajustar a altura máxima
        modalContent.style.maxHeight = (viewportHeight * 0.9) + 'px';
    } else {
        modalContent.style.maxHeight = '80vh';
    }
}

// Função para atualizar a aparência do slider
function updateSliderAppearance(slider) {
    const percent = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percent}%, rgba(10, 31, 18, 0.7) ${percent}%, rgba(10, 31, 18, 0.7) 100%)`;
}