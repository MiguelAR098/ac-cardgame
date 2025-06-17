// Função para mostrar notificação forçada (garantindo visibilidade em dispositivos móveis)
function showForceNotification(message, onClick = null) {
    // Remover notificações anteriores
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    // Criar nova notificação com estilo forçado
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.opacity = '1';
    notification.style.zIndex = '9999';
    notification.style.transform = 'translateX(-50%) translateY(10px)';
    notification.style.backgroundColor = 'var(--accent-color)';
    notification.style.border = '2px solid var(--light-color)';
    notification.style.boxShadow = '0 0 20px rgba(46, 139, 87, 0.8)';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.fontWeight = 'bold';
    notification.style.textAlign = 'center';
    notification.style.maxWidth = '80%';
    
    // Adicionar cursor pointer e evento de clique se onClick for fornecido
    if (onClick) {
        notification.style.cursor = 'pointer';
        notification.style.pointerEvents = 'auto';
        notification.addEventListener('click', onClick);
    }
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover após 5 segundos se não houver onClick
    if (!onClick) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Substituir a função setUserPerformancePreference para usar a notificação forçada
window.setUserPerformancePreference = function(level) {
    localStorage.setItem('userPerformancePreference', level);
    showForceNotification('Toque aqui para aplicar as alterações de desempenho', () => {
        window.location.reload();
    });
};

// Remover destaque azul em dispositivos móveis
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar estilo para remover o destaque azul em todos os botões
    const style = document.createElement('style');
    style.textContent = `
        button, 
        input,
        .btn-large, 
        .btn-small, 
        .btn-timer, 
        .tool-btn,
        .settings-btn,
        .fullscreen-btn,
        .close-btn,
        .confirm-btn {
            -webkit-tap-highlight-color: transparent !important;
            outline: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Substituir a função original de setUserPerformancePreference
    const originalSetUserPerformancePreference = window.setUserPerformancePreference;
    window.setUserPerformancePreference = function(level) {
        localStorage.setItem('userPerformancePreference', level);
        showForceNotification('Toque aqui para aplicar as alterações de desempenho', () => {
            window.location.reload();
        });
    };
});