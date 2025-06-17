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

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado, configurando eventos");
    
    // Observar quando o modal de configurações é aberto
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            console.log("Botão de configurações clicado");
            // Esperar um pouco para que o modal seja aberto e os botões sejam criados
            setTimeout(function() {
                replacePerformanceButtons();
            }, 300);
        });
    }
    
    // Verificar periodicamente se os botões de desempenho foram adicionados
    const checkInterval = setInterval(function() {
        const performanceButtons = document.querySelectorAll('.performance-btn');
        if (performanceButtons.length > 0) {
            console.log("Botões de desempenho encontrados");
            replacePerformanceButtons();
            clearInterval(checkInterval);
        }
    }, 1000);
});