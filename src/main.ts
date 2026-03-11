import './style.css'

// Declare particles.js types
declare const particlesJS: (id: string, config: object) => void;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initParticles();
    initCustomCursor();
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initSkillBars();
    initMobileMenu();
    initContactForm();
});

// Particles.js Configuration
function initParticles() {
    // Attendre que particles.js soit chargé
    const checkParticles = () => {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#6366f1'
                    },
                    shape: {
                        type: 'circle'
                    },
                    opacity: {
                        value: 0.5,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 2,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#6366f1',
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 0.5
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        } else {
            // Réessayer dans 100ms si pas encore chargé
            setTimeout(checkParticles, 100);
        }
    };
    
    checkParticles();
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor') as HTMLElement;
    const cursorFollower = document.querySelector('.cursor-follower') as HTMLElement;
    
    if (!cursor || !cursorFollower) return;

    // Hide default cursor on desktop
    if (window.innerWidth > 768) {
        document.body.style.cursor = 'none';
    }

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Scale up cursor on hover over links and buttons
    const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .social-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursorFollower.style.transform = 'scale(1.5)';
            cursorFollower.style.opacity = '0.2';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
            cursorFollower.style.opacity = '0.5';
        });
    });
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = (section as HTMLElement).offsetHeight;
            const sectionTop = (section as HTMLElement).offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Close mobile menu if open
            const navLinksContainer = document.querySelector('.nav-links');
            navLinksContainer?.classList.remove('active');
        });
    });
}

// Typing Effect
function initTypingEffect() {
    const typedTextElement = document.querySelector('.typed-text') as HTMLElement | null;
    if (!typedTextElement) return;

    const texts = [
        'Développeur Full-Stack',
        'Passionné de Data Science',
        'Créateur de Bots Discord',
        'Amateur de jeux vidéo',
        'Développeur Python'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typedTextElement!.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement!.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing
    setTimeout(type, 1500);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.section-header, .about-card, .project-card, .skills-category, .contact-card');
    animateElements.forEach(el => {
        el.classList.add('animate-hidden');
        observer.observe(el);
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                if (progress) {
                    (entry.target as HTMLElement).style.width = progress + '%';
                }
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Mobile Menu
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Contact Form - Send to Discord via Backend
function initContactForm() {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    const statusDiv = document.getElementById('form-status') as HTMLElement;
    const btnText = document.querySelector('.btn-text') as HTMLElement;
    const btnLoading = document.querySelector('.btn-loading') as HTMLElement;
    const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            firstname: (document.getElementById('firstname') as HTMLInputElement).value,
            lastname: (document.getElementById('lastname') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            message: (document.getElementById('message') as HTMLTextAreaElement).value,
            website: (document.getElementById('website') as HTMLInputElement).value // Honeypot
        };

        // Show loading state
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
        if (submitBtn) submitBtn.disabled = true;
        statusDiv.className = 'form-status';
        statusDiv.style.display = 'none';

        try {
            const response = await fetch('http://localhost:3001/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Success
                statusDiv.textContent = '✨ Message envoyé avec succès sur Discord !';
                statusDiv.className = 'form-status success';
                form.reset();
            } else {
                throw new Error('Erreur serveur');
            }
        } catch (error) {
            // Error
            statusDiv.textContent = '❌ Erreur lors de l\'envoi. Assurez-vous que le serveur backend est lancé.';
            statusDiv.className = 'form-status error';
        } finally {
            // Reset button state
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-hidden {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);

