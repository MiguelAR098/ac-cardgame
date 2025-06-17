// Variável para controlar o debounce de eventos
let debounceTimer;

// Função para debounce (limitar a frequência de execução de funções)
function debounce(func, delay) {
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Função para throttle (garantir que uma função não seja chamada mais que uma vez em um período)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Função para atualizar o ícone baseado no estado de tela cheia
function updateFullscreenIcon() {
    if (document.fullscreenElement) {
        fullscreenIcon.className = 'fas fa-compress';
    } else {
        fullscreenIcon.className = 'fas fa-expand';
    }
}

// Adicionar opção para ajustar o nível de desempenho manualmente
function addPerformanceSettingsToModal() {
    // Verificar se o modal de configurações existe
    const settingsForm = document.querySelector('.settings-form');
    if (!settingsForm) return;
    
    // Verificar se a seção já existe
    if (document.getElementById('performanceSettings')) return;
    
    // Criar a seção de configurações de desempenho
    const performanceSection = document.createElement('div');
    performanceSection.id = 'performanceSettings';
    performanceSection.className = 'form-group';
    
    // Adicionar título
    const performanceLabel = document.createElement('label');
    performanceLabel.textContent = 'Nível de Desempenho Gráfico:';
    performanceSection.appendChild(performanceLabel);
    
    // Criar container para os botões
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'performance-buttons';
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '10px';
    buttonsContainer.style.marginTop = '10px';
    
    // Função para criar botões de desempenho
    function createPerformanceButton(level, label) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'performance-btn';
        button.textContent = label;
        button.style.flex = '1';
        button.style.padding = '8px';
        button.style.border = '1px solid var(--accent-color)';
        button.style.borderRadius = '5px';
        button.style.background = 'var(--secondary-color)';
        button.style.color = 'var(--text-light)';
        button.style.cursor = 'pointer';
        
        // Destacar o botão do nível atual
        const currentLevel = localStorage.getItem('userPerformancePreference');
        if (currentLevel === level) {
            button.style.background = 'var(--accent-color)';
        }
        
        return button;
    }
    
    // Adicionar botões para cada nível de desempenho
    const lowBtn = createPerformanceButton('veryLow', 'Mínimo');
    const mediumBtn = createPerformanceButton('low', 'Baixo');
    const highBtn = createPerformanceButton('medium', 'Médio');
    const ultraBtn = createPerformanceButton('high', 'Alto');
    
    // Adicionar botões ao container
    buttonsContainer.appendChild(lowBtn);
    buttonsContainer.appendChild(mediumBtn);
    buttonsContainer.appendChild(highBtn);
    buttonsContainer.appendChild(ultraBtn);
    
    // Adicionar container ao formulário
    performanceSection.appendChild(buttonsContainer);
    
    // Adicionar descrição
    const description = document.createElement('div');
    description.style.fontSize = '0.8rem';
    description.style.marginTop = '5px';
    description.style.color = 'var(--light-color)';
    description.textContent = 'Ajuste para melhorar o desempenho em dispositivos mais fracos.';
    performanceSection.appendChild(description);
    
    // Adicionar ao formulário de configurações antes dos botões
    const settingsButtons = document.querySelector('.settings-buttons');
    if (settingsButtons) {
        settingsForm.insertBefore(performanceSection, settingsButtons);
    } else {
        settingsForm.appendChild(performanceSection);
    }
    
    // Substituir os botões com os novos eventos
    setTimeout(() => {
        replacePerformanceButtons();
    }, 100);
}