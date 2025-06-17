// Configuração das partículas com otimização para desempenho
document.addEventListener('DOMContentLoaded', function() {
    // Configurações para dispositivos de baixo desempenho (extremamente leve)
    const veryLowPerformanceConfig = {
        "particles": {
            "number": {
                "value": 10,
                "density": {
                    "enable": true,
                    "value_area": 1000
                }
            },
            "color": {
                "value": "#5caa6f"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.3,
                "random": false,
                "anim": {
                    "enable": false
                }
            },
            "size": {
                "value": 2,
                "random": false,
                "anim": {
                    "enable": false
                }
            },
            "line_linked": {
                "enable": false
            },
            "move": {
                "enable": true,
                "speed": 0.5,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false
                },
                "onclick": {
                    "enable": false
                },
                "resize": false
            }
        },
        "retina_detect": false
    };
    
    // Configurações para dispositivos de baixo desempenho
    const lowPerformanceConfig = {
        "particles": {
            "number": {
                "value": 15,
                "density": {
                    "enable": true,
                    "value_area": 900
                }
            },
            "color": {
                "value": "#5caa6f"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.4,
                "random": false,
                "anim": {
                    "enable": false
                }
            },
            "size": {
                "value": 2.5,
                "random": true,
                "anim": {
                    "enable": false
                }
            },
            "line_linked": {
                "enable": false
            },
            "move": {
                "enable": true,
                "speed": 0.8,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false
                },
                "onclick": {
                    "enable": false
                },
                "resize": true
            }
        },
        "retina_detect": false
    };
    
    // Configurações para dispositivos de médio desempenho
    const mediumPerformanceConfig = {
        "particles": {
            "number": {
                "value": 40,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#5caa6f"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#2e8b57",
                "opacity": 0.3,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1.5,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "push": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": false
    };
    
    // Configurações para dispositivos de alto desempenho
    const highPerformanceConfig = {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#5caa6f"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#2e8b57",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    };
    
    // Escolher a configuração com base no nível de desempenho
    const performanceLevel = getPerformanceLevel();
    let config;
    
    switch (performanceLevel) {
        case 'veryLow':
            config = veryLowPerformanceConfig;
            document.body.classList.add('very-low-performance');
            break;
        case 'low':
            config = lowPerformanceConfig;
            document.body.classList.add('low-performance');
            break;
        case 'medium':
            config = mediumPerformanceConfig;
            document.body.classList.add('medium-performance');
            break;
        default:
            config = highPerformanceConfig;
    }
    
    // Verificar se o dispositivo é muito fraco para usar particles.js
    if (performanceLevel === 'veryLow') {
        // Para dispositivos muito fracos, usar um fundo estático em vez de partículas
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            particlesContainer.style.background = 'var(--secondary-color)';
            
            // Adicionar apenas algumas partículas estáticas para manter a estética
            for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                particle.className = 'static-particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.opacity = Math.random() * 0.5;
                particle.style.width = `${Math.random() * 3 + 1}px`;
                particle.style.height = particle.style.width;
                particlesContainer.appendChild(particle);
            }
            
            // Adicionar estilo para partículas estáticas
            const style = document.createElement('style');
            style.textContent = `
                .static-particle {
                    position: absolute;
                    background-color: var(--light-color);
                    border-radius: 50%;
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        // Inicializar particles.js com a configuração escolhida para outros dispositivos
        try {
            particlesJS('particles-js', config);
        } catch (e) {
            console.error("Erro ao inicializar particles.js:", e);
            // Fallback para fundo estático em caso de erro
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                particlesContainer.style.background = 'var(--secondary-color)';
            }
        }
    }
});