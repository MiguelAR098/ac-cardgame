// Funções do timer
function toggleTimer(timer, timerElement, toggleBtn) {
    if (timer.running) {
        pauseTimer(timer);
        toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        startTimer(timer, timerElement, toggleBtn);
        toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function startTimer(timer, timerElement, toggleBtn) {
    if (timer.interval) {
        clearInterval(timer.interval);
    }
    
    timer.running = true;
    timer.interval = setInterval(() => {
        if (timer.seconds > 0) {
            timer.seconds--;
            updateTimerDisplay(timerElement, timer.seconds);
            
            if (timer.seconds === 0) {
                pauseTimer(timer);
                toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
                showNotification('Tempo esgotado!');
            }
        }
    }, 1000);
}

function pauseTimer(timer) {
    if (timer.interval) {
        clearInterval(timer.interval);
    }
    timer.running = false;
}

function resetTimer(timer, timerElement, toggleBtn, duration) {
    pauseTimer(timer);
    timer.seconds = duration;
    updateTimerDisplay(timerElement, timer.seconds);
    toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function updateTimerDisplay(timerElement, seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}