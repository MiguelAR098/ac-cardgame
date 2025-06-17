// Variável para controlar o timeout das notificações
let notificationTimeout;

// Sistema de notificações personalizado otimizado
function showNotification(message, isVictory = false) {
    // Limitar notificações em dispositivos de baixo desempenho
    const isVeryLowPerf = document.body.classList.contains('very-low-performance');
    const isLowPerf = isVeryLowPerf || document.body.classList.contains('low-performance');
    
    // Em dispositivos muito fracos, limitar notificações não críticas
    if (isVeryLowPerf && !isVictory && message !== 'Tempo esgotado!') {
        console.log("Notificação suprimida em dispositivo de baixo desempenho:", message);
        return;
    }
    
    // Limpar timeout anterior se existir
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        // Em vez de remover imediatamente, apenas esconder para reutilizar
        existingNotification.classList.remove('show');
        
        // Usar um timeout curto para permitir a transição de saída
        setTimeout(() => {
            updateAndShowNotification(existingNotification, message, isVictory, isLowPerf);
        }, isLowPerf ? 0 : 100);
        
        return;
    }
    
    // Criar nova notificação apenas se não existir uma anterior
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Atualizar e mostrar
    updateAndShowNotification(notification, message, isVictory, isLowPerf);
}

// Função auxiliar para atualizar e mostrar notificação
function updateAndShowNotification(notification, message, isVictory, isLowPerf) {
    // Atualizar conteúdo
    notification.textContent = message;
    
    // Adicionar ou remover classe de vitória
    if (isVictory) {
        notification.classList.add('victory');
    } else {
        notification.classList.remove('victory');
    }
    
    // Mostrar a notificação (sem delay em dispositivos de baixo desempenho)
    if (isLowPerf) {
        notification.classList.add('show');
    } else {
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
    }
    
    // Configurar comportamento de fechamento
    if (!isVictory) {
        // Notificações normais fecham automaticamente
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                // Remover do DOM apenas quando a transição terminar
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, isLowPerf ? 100 : 300);
        }, isLowPerf ? 2000 : 3000);
    } else {
        // Para notificações de vitória, adicionar evento de clique para fechar
        notification.style.pointerEvents = 'auto';
        notification.style.cursor = 'pointer';
        
        // Remover listeners anteriores para evitar duplicação
        const newNotification = notification.cloneNode(true);
        if (notification.parentNode) {
            notification.parentNode.replaceChild(newNotification, notification);
        }
        
        newNotification.addEventListener('click', () => {
            newNotification.classList.remove('show');
            setTimeout(() => {
                if (newNotification.parentNode) {
                    newNotification.parentNode.removeChild(newNotification);
                }
            }, isLowPerf ? 100 : 300);
        });
    }
}

// Função para mostrar notificação de confirmação personalizada com botões Sim/Não
function showConfirmNotification(message, onConfirm) {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação de confirmação
    const notification = document.createElement('div');
    notification.className = 'notification confirm';
    
    // Adicionar mensagem
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    notification.appendChild(messageElement);
    
    // Adicionar botões de confirmação
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'confirm-buttons';
    
    // Botão Sim
    const yesButton = document.createElement('button');
    yesButton.className = 'confirm-btn confirm-btn-yes';
    yesButton.textContent = 'Sim';
    yesButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            onConfirm();
        }, 300);
    });
    
    // Botão Não
    const noButton = document.createElement('button');
    noButton.className = 'confirm-btn confirm-btn-no';
    noButton.textContent = 'Não';
    noButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Adicionar botões ao container
    buttonsContainer.appendChild(yesButton);
    buttonsContainer.appendChild(noButton);
    notification.appendChild(buttonsContainer);
    
    document.body.appendChild(notification);
    
    // Mostrar a notificação com um pequeno atraso para o efeito de transição
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
}

// Função para mostrar notificação clicável que recarrega a página
function showReloadNotification(message) {
    console.log("Mostrando notificação de recarga");
    
    // Remover notificações anteriores
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = 'notification reload-notification';
    notification.textContent = message;
    
    // Estilizar diretamente para garantir visibilidade
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%) translateY(10px)';
    notification.style.backgroundColor = '#2e8b57';
    notification.style.color = '#ffffff';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 0 20px rgba(46, 139, 87, 0.8)';
    notification.style.zIndex = '9999';
    notification.style.textAlign = 'center';
    notification.style.fontWeight = 'bold';
    notification.style.cursor = 'pointer';
    notification.style.border = '2px solid #5caa6f';
    notification.style.maxWidth = '80%';
    notification.style.opacity = '1';
    notification.style.pointerEvents = 'auto';
    
    // Adicionar evento de clique para recarregar a página
    notification.onclick = function() {
        console.log("Clique na notificação detectado");
        window.location.reload();
    };
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
}