// Detectar se o dispositivo é de baixo desempenho
function isLowPerformanceDevice() {
    // Verificar se é um dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Verificar se a tela é pequena (provavelmente um dispositivo mais fraco)
    const isSmallScreen = window.innerWidth < 768 || window.innerHeight < 600;
    
    // Verificar se o navegador suporta a API de detecção de hardware concurrency
    const hasLowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
    
    // Verificar se o dispositivo tem baixa memória (disponível em alguns navegadores)
    const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory <= 4;
    
    // Verificar se o dispositivo tem baixa performance baseado em FPS
    let hasLowFPS = false;
    try {
        // Testar FPS usando requestAnimationFrame
        let frameCount = 0;
        let lastTime = performance.now();
        const testFPS = () => {
            const now = performance.now();
            const elapsed = now - lastTime;
            if (elapsed >= 1000) { // 1 segundo passou
                const fps = frameCount / (elapsed / 1000);
                hasLowFPS = fps < 30; // Considerar baixo desempenho se FPS < 30
                frameCount = 0;
                lastTime = now;
            }
            frameCount++;
            if (frameCount < 60) { // Limitar a 60 frames para o teste
                requestAnimationFrame(testFPS);
            }
        };
        requestAnimationFrame(testFPS);
    } catch (e) {
        console.log("Erro ao testar FPS:", e);
    }
    
    // Verificar se o navegador está em modo de economia de bateria (disponível em alguns navegadores)
    const isBatterySaving = navigator.getBattery && navigator.getBattery().then(battery => battery.charging === false && battery.level < 0.15).catch(() => false);
    
    // Armazenar o resultado no localStorage para não precisar recalcular frequentemente
    const storedPerformance = localStorage.getItem('devicePerformance');
    if (storedPerformance) {
        return storedPerformance === 'low';
    }
    
    // Retornar true se qualquer um dos indicadores de baixo desempenho for verdadeiro
    const isLowPerf = (isMobile && isSmallScreen) || hasLowCPU || hasLowMemory || hasLowFPS || isBatterySaving;
    
    // Armazenar o resultado para uso futuro (válido por 1 hora)
    localStorage.setItem('devicePerformance', isLowPerf ? 'low' : 'high');
    setTimeout(() => localStorage.removeItem('devicePerformance'), 3600000); // 1 hora
    
    return isLowPerf;
}

// Função para determinar o nível de desempenho do dispositivo
function getPerformanceLevel() {
    // Verificar se o usuário definiu manualmente um nível de desempenho
    const userPreference = localStorage.getItem('userPerformancePreference');
    if (userPreference) {
        return userPreference;
    }
    
    // Verificar se é um dispositivo muito fraco
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isVerySmallScreen = window.innerWidth < 480 || window.innerHeight < 480;
    const hasVeryLowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2;
    const hasVeryLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2;
    
    if ((isMobile && isVerySmallScreen) || hasVeryLowCPU || hasVeryLowMemory) {
        return 'veryLow';
    }
    
    // Usar a função existente para verificar dispositivos de baixo desempenho
    if (isLowPerformanceDevice()) {
        return 'low';
    }
    
    // Verificar se é um dispositivo de médio desempenho
    const isMediumScreen = window.innerWidth < 1024 || window.innerHeight < 768;
    const hasMediumCPU = navigator.hardwareConcurrency !== undefined && 
                        navigator.hardwareConcurrency > 4 && 
                        navigator.hardwareConcurrency <= 6;
    
    if (isMediumScreen || hasMediumCPU) {
        return 'medium';
    }
    
    // Se chegou até aqui, é um dispositivo de alto desempenho
    return 'high';
}

// Aplicar otimizações baseadas no desempenho do dispositivo
function applyPerformanceOptimizations() {
    const isVeryLowPerf = document.body.classList.contains('very-low-performance');
    const isLowPerf = isVeryLowPerf || document.body.classList.contains('low-performance');
    
    if (isLowPerf) {
        // Reduzir a frequência de atualizações para dispositivos de baixo desempenho
        UI_UPDATE_THROTTLE = isVeryLowPerf ? 200 : 150;
        
        // Desativar algumas animações
        const style = document.createElement('style');
        style.textContent = `
            ${isVeryLowPerf ? `
                /* Desativar todas as animações em dispositivos muito fracos */
                * {
                    animation-duration: 0s !important;
                    transition-duration: 0s !important;
                }
                
                /* Simplificar o fundo */
                #particles-js {
                    background: var(--secondary-color) !important;
                    animation: none !important;
                }
                
                /* Remover sombras e efeitos */
                .life-value, .btn-large, .btn-small, .btn-timer, .tool-btn {
                    box-shadow: none !important;
                }
            ` : `
                /* Reduzir duração das animações em dispositivos de baixo desempenho */
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                .pulse {
                    animation-duration: 0.3s !important;
                }
                
                .notification.victory {
                    animation-duration: 0.5s !important;
                }
                
                /* Simplificar efeitos de hover */
                .btn-large:hover, .btn-small:hover, .btn-timer:hover, .tool-btn:hover {
                    transform: none !important;
                }
            `}
        `;
        document.head.appendChild(style);
        
        // Reduzir a frequência de salvamento no localStorage
        const originalSaveGameState = saveGameState;
        saveGameState = debounce(originalSaveGameState, isVeryLowPerf ? 2000 : 1000);
        
        console.log(`Aplicadas otimizações para dispositivo de ${isVeryLowPerf ? 'muito baixo' : 'baixo'} desempenho`);
    }
}

// Função para substituir os botões de desempenho
function replacePerformanceButtons() {
    console.log("Substituindo botões de desempenho");
    const performanceButtons = document.querySelectorAll('.performance-btn');
    
    if (performanceButtons.length === 0) {
        console.log("Nenhum botão de desempenho encontrado");
        return;
    }
    
    performanceButtons.forEach(button => {
        // Determinar o nível com base no texto do botão
        const level = button.textContent === 'Mínimo' ? 'veryLow' : 
                     button.textContent === 'Baixo' ? 'low' : 
                     button.textContent === 'Médio' ? 'medium' : 'high';
        
        // Remover todos os listeners de eventos antigos
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Adicionar novo evento de clique
        newButton.addEventListener('click', function() {
            console.log("Botão de desempenho clicado: " + level);
            
            // Atualizar preferência
            localStorage.setItem('userPerformancePreference', level);
            
            // Atualizar visual dos botões
            document.querySelectorAll('.performance-btn').forEach(btn => {
                btn.style.background = 'var(--secondary-color)';
            });
            newButton.style.background = 'var(--accent-color)';
            
            // Mostrar notificação clicável
            showReloadNotification('Clique aqui para aplicar as alterações de desempenho');
        });
    });
}