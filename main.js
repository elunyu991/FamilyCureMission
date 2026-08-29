// ====================================
// FAMILY CURE MISSION - MAIN JAVASCRIPT
// ====================================

(function() {
    'use strict';

    // ====================================
    // GLOBAL VARIABLES
    // ====================================
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // ====================================
    // NAVBAR SCROLL EFFECT
    // ====================================
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ====================================
    // MOBILE MENU TOGGLE & BACKDROP
    // ====================================
    let navOverlay = null;

    function createNavOverlay() {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        navOverlay.addEventListener('click', closeMobileMenu);
        document.body.appendChild(navOverlay);
        // Trigger reflow for transition
        requestAnimationFrame(() => navOverlay.classList.add('visible'));
    }

    function removeNavOverlay() {
        if (navOverlay) {
            navOverlay.classList.remove('visible');
            navOverlay.addEventListener('transitionend', () => {
                navOverlay?.remove();
                navOverlay = null;
            }, { once: true });
            // Fallback: remove after transition anyway
            setTimeout(() => {
                navOverlay?.remove();
                navOverlay = null;
            }, 350);
        }
    }

    function toggleMobileMenu() {
        const opening = !navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = opening ? 'hidden' : '';

        if (opening) {
            createNavOverlay();
        } else {
            closeAllDropdowns();
            removeNavOverlay();
        }
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown.active').forEach(d => {
            d.classList.remove('active');
            const chevron = d.querySelector('.fa-chevron-down');
            if (chevron) chevron.style.transform = '';
        });
    }

    // Close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
        closeAllDropdowns();
        removeNavOverlay();
    }

    // ====================================
    // SCROLL TO TOP BUTTON
    // ====================================
    function handleScrollToTop() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ====================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ====================================
    function smoothScroll(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                closeMobileMenu();
            }
        }
    }

    // ====================================
    // STATS COUNTER ANIMATION
    // ====================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target], .impact-number[data-target]');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    // ====================================
    // TESTIMONIAL SLIDER
    // ====================================
    function initTestimonialSlider() {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        const testimonials = slider.querySelectorAll('.testimonial-card');
        const dotsContainer = document.querySelector('.testimonial-dots');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        let currentIndex = 0;
        const totalSlides = testimonials.length;

        // Create dots
        if (dotsContainer) {
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function showSlide(index) {
            testimonials.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });

            const dots = dotsContainer?.querySelectorAll('.dot');
            dots?.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });

            currentIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % totalSlides;
            showSlide(nextIndex);
        }

        function prevSlide() {
            const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            showSlide(prevIndex);
        }

        function goToSlide(index) {
            showSlide(index);
        }

        // Event listeners
        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        // Auto-advance slides
        setInterval(nextSlide, 5000);
    }

    // ====================================
    // FAQ ACCORDION
    // ====================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ====================================
    // FORM VALIDATION & SUBMISSION (Formspree)
    // ====================================
    function initForms() {
        const bookingForm = document.getElementById('bookingForm');
        const contactForm = document.getElementById('contactForm');
        const successModal = document.getElementById('successModal');
        const FORMPREE_ENDPOINT = 'https://formspree.io/f/mqevbgzq';

        // Set minimum date for appointment to today
        const dateInput = document.getElementById('preferred_date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // Shared submission helper
        function submitToFormspree(form, submitBtn, originalHTML, sendingLabel) {
            const formData = new FormData(form);

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${sendingLabel}`;

            // Timeout after 15 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            fetch(FORMPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            })
            .then(response => {
                clearTimeout(timeoutId);
                if (response.ok) return response.json();
                return response.json().then(err => { throw new Error(err.error || 'Submission failed'); });
            })
            .then(() => {
                showSuccessModal();
                form.reset();
            })
            .catch(error => {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    alert('Request timed out. Please check your internet connection and try again, or email us directly.');
                } else {
                    console.error('Formspree error:', error);
                    alert('Something went wrong. Please try again or contact us directly.');
                }
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            });
        }

        // Booking Form Submission
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();

                if (!this.checkValidity()) {
                    this.reportValidity();
                    return;
                }

                const btn = this.querySelector('button[type="submit"]');
                const original = btn.innerHTML;
                submitToFormspree(this, btn, original, 'Submitting...');
            });
        }

        // Contact Form Submission
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                if (!this.checkValidity()) {
                    this.reportValidity();
                    return;
                }

                const btn = this.querySelector('button[type="submit"]');
                const original = btn.innerHTML;
                submitToFormspree(this, btn, original, 'Sending...');
            });
        }

        // Success Modal
        function showSuccessModal() {
            if (successModal) {
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeSuccessModal() {
            if (successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Close modal buttons
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeSuccessModal);
        });

        // Close modal on outside click
        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) {
                    closeSuccessModal();
                }
            });
        }

        // Close modal on Escape key (only if already open)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSuccessModal();
            }
        });
    }

    // ====================================
    // ANIMATION ON SCROLL (AOS)
    // ====================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => observer.observe(el));
    }

    // ====================================
    // LAZY LOADING IMAGES
    // ====================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports lazy loading natively
            return;
        }

        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ====================================
    // DROPDOWN MENU (Desktop hover + Mobile tap)
    // ====================================
    function initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        const isMobile = () => window.innerWidth <= 992;

        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            const chevron = link?.querySelector('.fa-chevron-down, i');
            let timeout;

            // --- Desktop hover behavior ---
            dropdown.addEventListener('mouseenter', () => {
                if (isMobile()) return;
                clearTimeout(timeout);
                dropdown.classList.add('active');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            });

            dropdown.addEventListener('mouseleave', () => {
                if (isMobile()) return;
                timeout = setTimeout(() => {
                    dropdown.classList.remove('active');
                    if (chevron) chevron.style.transform = '';
                }, 300);
            });

            // --- Mobile tap behavior ---
            link?.addEventListener('click', function(e) {
                if (!isMobile()) return;
                // Only intercept if this dropdown has a submenu
                if (!dropdown.querySelector('.dropdown-menu')) return;

                e.preventDefault();
                const wasActive = dropdown.classList.contains('active');

                // Close sibling dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                        const otherChevron = d.querySelector('.dropdown > a .fa-chevron-down, .dropdown > a i');
                        if (otherChevron) otherChevron.style.transform = '';
                    }
                });

                // Toggle this one
                dropdown.classList.toggle('active');
                if (chevron) {
                    chevron.style.transform = wasActive ? '' : 'rotate(180deg)';
                }
            });
        });
    }

    // ====================================
    // ACTIVE PAGE HIGHLIGHT
    // ====================================
    function highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // ====================================
    // PRELOADER (Optional)
    // ====================================
    function hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }, 500);
        }
    }

    // ====================================
    // PERFORMANCE OPTIMIZATION
    // ====================================
    let scrollTimeout;
    function throttledScroll() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleNavbarScroll();
                handleScrollToTop();
                scrollTimeout = null;
            }, 10);
        }
    }

    // ====================================
    // EVENT LISTENERS
    // ====================================
    function attachEventListeners() {
        // Scroll events
        window.addEventListener('scroll', throttledScroll);

        // Mobile menu
        mobileMenuToggle?.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when clicking on nav links (skip dropdown parents on mobile)
        const navLinks = navMenu?.querySelectorAll('a');
        navLinks?.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't close menu when tapping a dropdown trigger on mobile
                if (window.innerWidth <= 992 && this.closest('.dropdown') && this.closest('.dropdown').querySelector('.dropdown-menu')) {
                    return;
                }
                closeMobileMenu();
            });
        });

        // Scroll to top button
        scrollToTopBtn?.addEventListener('click', scrollToTop);

        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 992) {
                    closeMobileMenu();
                }
            }, 250);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
                document.getElementById('successModal')?.classList.remove('active');
            }
        });
    }

    // ====================================
    // INITIALIZATION
    // ====================================
    function init() {
        // Run on DOM ready
        attachEventListeners();
        highlightActivePage();
        initCounters();
        initTestimonialSlider();
        initFAQ();
        initForms();
        initScrollAnimations();
        initLazyLoading();
        initDropdowns();
        hidePreloader();

        // Initial calls
        handleNavbarScroll();
        handleScrollToTop();

        console.log('Family Cure Mission website loaded successfully!');
    }

    // ====================================
    // RUN ON PAGE LOAD
    // ====================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ====================================
    // EXPORT FOR EXTERNAL USE (Optional)
    // ====================================
    window.FCM = {
        showSuccessModal: () => {
            document.getElementById('successModal')?.classList.add('active');
        },
        closeModals: () => {
            document.getElementById('successModal')?.classList.remove('active');
        },
        scrollToSection: (selector) => {
            const element = document.querySelector(selector);
            if (element) {
                const offsetTop = element.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }
    };

})();


// ====================================
// TEAM PAGE ENHANCEMENTS
// ====================================

function initTeamPage() {
    // Lazy load team member images
    const teamImages = document.querySelectorAll('.member-image img, .compact-image img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        teamImages.forEach(img => imageObserver.observe(img));
    }
    
    // Add tooltip functionality for credentials
    const credentials = document.querySelectorAll('.member-credentials span');
    credentials.forEach(credential => {
        credential.setAttribute('title', credential.textContent);
    });
    
    // Animate team cards on scroll
    const teamCards = document.querySelectorAll('.team-member-card, .team-compact-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    teamCards.forEach(card => cardObserver.observe(card));
    
    // Social links - prevent default and show sharing functionality
    const socialLinks = document.querySelectorAll('.member-social a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If the link is a placeholder (#), prevent default
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                console.log('Social link clicked:', this.getAttribute('aria-label'));
            }
        });
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamPage);
} else {
    initTeamPage();
}