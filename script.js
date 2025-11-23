/**
 * Ameriline Pharmaceutical SRL - Main JavaScript
 * Version: 1.0
 * Description: Provides interactivity and enhanced user experience for the Ameriline website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initMobileMenu();
    initSmoothScrolling();
    initBackToTop();
    initHeaderScroll();
    initAnimations();
    // initCounterAnimation(); // Desactivado para mantener los números estáticos
    initProductHover();
    initTypingEffect();
    initHealthQuotes();
    initPharmaceuticalEffects();
});

/**
 * Preloader functionality
 * Hides the preloader after the page has loaded
 */
function initPreloader() {
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('preloader-hidden');
            
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 600);
        }
    });
}

/**
 * Mobile Menu Functionality
 * Toggles the mobile menu when the hamburger button is clicked
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('nav-active');
            menuBtn.classList.toggle('menu-btn-active');
        });
        
        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('nav-active');
                menuBtn.classList.remove('menu-btn-active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !menuBtn.contains(event.target) && nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                menuBtn.classList.remove('menu-btn-active');
            }
        });
    }
}

/**
 * Smooth Scrolling for internal links
 * Provides a smooth scrolling experience when clicking on navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Back to Top Button
 * Shows/hides the back to top button based on scroll position
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Header Scroll Effect
 * Changes the header style when scrolling down
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        // Check initial scroll position
        if (window.pageYOffset > 50) {
            header.classList.add('header-scrolled');
        }
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }
}

/**
 * AOS-like Animations
 * Animates elements when they come into view
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    function animateElements() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                // Check if element already has animation class
                if (!element.classList.contains('aos-animate')) {
                    let delay = parseInt(element.getAttribute('data-aos-delay') || 0);
                    setTimeout(() => {
                        element.classList.add('aos-animate');
                    }, delay);
                }
            }
        });
    }
    
    // Run immediately for elements visible on load
    animateElements();
    
    // And then on each scroll and resize
    window.addEventListener('scroll', animateElements);
    window.addEventListener('load', animateElements);
    window.addEventListener('resize', animateElements);
    
    // Additional checks to ensure nothing is missed
    setTimeout(animateElements, 500);
    setTimeout(animateElements, 1000);
    setTimeout(animateElements, 2000);
}

/**
 * Counter Animation for Statistics
 * Animates the counting up of numbers in the stats section
 */
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    function startCounting(stat) {
        const target = stat.textContent.replace(/[^\d]/g, ''); // Extract numbers only
        const targetNum = parseInt(target) || 0;
        const suffix = stat.textContent.replace(/[\d]/g, ''); // Extract non-numbers
        const duration = 2000; // ms
        const increment = 30; // ms
        const steps = duration / increment;
        const step = targetNum / steps;
        let current = 0;
        
        const counter = setInterval(() => {
            current += step;
            if (current >= targetNum) {
                clearInterval(counter);
                stat.textContent = targetNum + suffix;
            } else {
                stat.textContent = Math.floor(current) + suffix;
            }
        }, increment);
    }
    
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }
    
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5
        });
        
        stats.forEach(stat => {
            observer.observe(stat);
        });
    } else {
        // Fallback for older browsers
        stats.forEach(stat => {
            startCounting(stat);
        });
    }
}

/**
 * Product Hover Effect
 * Enhances the hover effects on product cards
 */
function initProductHover() {
    const productCards = document.querySelectorAll('.product-card');
    const serviceCards = document.querySelectorAll('.service-card');
    
    [...productCards, ...serviceCards].forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            
            const icon = this.querySelector('.product-icon, .service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.color = 'var(--primary-dark)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow-md)';
            
            const icon = this.querySelector('.product-icon, .service-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.color = 'var(--primary-color)';
            }
        });
    });
}

/**
 * Typing Effect for Hero Section
 * Creates a typing animation for the hero headline
 */
function initTypingEffect() {
    const element = document.querySelector('.animated-heading');
    
    if (element) {
        // Save original content
        const originalContent = element.innerHTML;
        
        // Extract text and tags
        const textParts = originalContent.split(/(<[^>]*>)/);
        let currentText = '';
        let i = 0;
        const speed = 50; // typing speed in milliseconds
        
        function typeWriter() {
            if (i < textParts.length) {
                // If it's an HTML tag, add it directly
                if (textParts[i].startsWith('<') && textParts[i].endsWith('>')) {
                    currentText += textParts[i];
                } else {
                    // If it's text, add it character by character
                    let j = 0;
                    const text = textParts[i];
                    const textInterval = setInterval(() => {
                        if (j < text.length) {
                            currentText += text.charAt(j);
                            element.innerHTML = currentText;
                            j++;
                        } else {
                            clearInterval(textInterval);
                            i++;
                            setTimeout(typeWriter, speed);
                        }
                    }, speed);
                    return;
                }
                element.innerHTML = currentText;
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start the effect after a small delay
        setTimeout(typeWriter, 500);
    }
}

/**
 * Health Quotes Rotation
 * Rotates inspiring health quotes in the hero section
 */
function initHealthQuotes() {
    const quotes = [
        "Transformamos la salud en esperanza",
        "Tu bienestar es nuestra prioridad",
        "Más de 30 años cuidando tu salud",
        "Productos farmacéuticos de calidad internacional",
        "Comprometidos con el bienestar del Caribe"
    ];
    
    const quoteElement = document.querySelector('.health-quote');
    if (quoteElement) {
        let currentQuote = 0;
        
        function rotateQuotes() {
            quoteElement.style.opacity = '0';
            
            setTimeout(() => {
                quoteElement.textContent = quotes[currentQuote];
                quoteElement.style.opacity = '1';
                currentQuote = (currentQuote + 1) % quotes.length;
            }, 300);
        }
        
        // Start rotation
        setInterval(rotateQuotes, 4000);
    }
}

/**
 * Pharmaceutical-specific effects
 * Adds special effects for pharmaceutical theme
 */
function initPharmaceuticalEffects() {
    // Add medical cross animation to certain elements
    const medicalElements = document.querySelectorAll('.medical-cross');
    medicalElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(5deg) scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });
    
    // Add pill shape hover effects
    const pillShapes = document.querySelectorAll('.pill-shape');
    pillShapes.forEach(pill => {
        pill.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(3deg)';
        });
        
        pill.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Health tip tooltips
    const healthTips = [
        "Mantén una rutina de medicación constante",
        "Consulta siempre a tu médico antes de cambiar tratamientos",
        "Almacena los medicamentos en lugares frescos y secos",
        "Verifica la fecha de caducidad de tus medicamentos",
        "Mantén tus medicamentos fuera del alcance de los niños"
    ];
    
    let tipIndex = 0;
    const tipElement = document.getElementById('health-tip');
    if (tipElement) {
        function showNextTip() {
            tipElement.textContent = healthTips[tipIndex];
            tipElement.style.opacity = '1';
            tipIndex = (tipIndex + 1) % healthTips.length;
            
            setTimeout(() => {
                tipElement.style.opacity = '0';
            }, 3000);
        }
        
        setInterval(showNextTip, 5000);
        showNextTip(); // Show first tip immediately
    }
}

/**
 * Add parallax effect to shapes in hero section
 */
window.addEventListener('mousemove', function(e) {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach(shape => {
        const speed = shape.getAttribute('data-speed') || 5;
        const moveX = (x * speed);
        const moveY = (y * speed);
        
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

/**
 * Add active class to current section in navigation
 */
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/**
 * Product filter functionality (if needed)
 */
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    card.classList.add('aos-animate');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Trust indicators animation
 */
function initTrustIndicators() {
    const trustElements = document.querySelectorAll('.trust-indicator');
    
    trustElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

/**
 * Pharmaceutical certification badges
 */
function initCertificationBadges() {
    const badges = document.querySelectorAll('.quality-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
            this.style.boxShadow = '0 5px 15px rgba(0, 166, 81, 0.3)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
}

/**
 * Initialize all pharmaceutical-specific features
 */
document.addEventListener('DOMContentLoaded', function() {
    initTrustIndicators();
    initCertificationBadges();
    
    // Initialize product filter if filter buttons exist
    if (document.querySelectorAll('.filter-btn').length > 0) {
        initProductFilter();
    }
});

/**
 * Error handling for missing elements
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
    // Could log errors to analytics service here
});

/**
 * Accessibility enhancements
 */
function initAccessibility() {
    // Add keyboard navigation support
    document.querySelectorAll('.product-card, .service-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('.product-link');
                if (link) link.click();
            }
        });
    });
    
    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'visually-hidden';
    document.body.appendChild(announcer);
    
    // Update announcer when sections change
    window.addEventListener('scroll', function() {
        const currentSection = getCurrentSection();
        if (currentSection) {
            announcer.textContent = `Navegando por la sección: ${currentSection}`;
        }
    });
}

/**
 * Get current section based on scroll position
 */
function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    let current = null;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
            current = section.getAttribute('id');
        }
    });
    
    return current;
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

/**
 * WhatsApp Chat Widget
 * Shows/hides the WhatsApp chat widget
 */
function initWhatsAppWidget() {
    const toggle = document.getElementById('whatsappToggle');
    const close = document.getElementById('whatsappClose');
    const container = document.querySelector('.whatsapp-chat-container');
    
    if (!toggle || !close || !container) return;
    
    // Show chat on toggle click
    toggle.addEventListener('click', function() {
        container.classList.add('active');
        toggle.classList.add('hidden');
    });
    
    // Hide chat on close click
    close.addEventListener('click', function() {
        container.classList.remove('active');
        toggle.classList.remove('hidden');
    });
    
    // Show widget after 2 seconds
    setTimeout(function() {
        if (toggle) {
            toggle.style.opacity = '1';
        }
    }, 500);
}

// Initialize WhatsApp widget when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsAppWidget);
} else {
    initWhatsAppWidget();
}