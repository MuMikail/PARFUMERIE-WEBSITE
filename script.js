document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.perfume-section');
    const centerLogo = document.querySelector('.center-logo');
    const mainContent = document.querySelector('.main-content');
    const images = document.querySelectorAll('.perfume-image');
    const sectionInfos = document.querySelectorAll('.section-info');
    const forHimInfo = document.querySelector('.for-him-info');
    const forHerInfo = document.querySelector('.for-her-info');
    
    let hoverTimeout;
    let currentHoverSection = null;
    
    // Function to show section info and keep hover active
    function showSectionInfo(sectionType) {
        // Clear any existing timeout IMMEDIATELY
        clearTimeout(hoverTimeout);
        
        // Hide center logo
        if (centerLogo) {
            centerLogo.classList.add('js-hidden');
        }
        
        // RESET SEMUA SECTION DULU SEBELUM SET YANG BARU
        sections.forEach(section => {
            section.classList.remove('js-active', 'js-inactive');
        });
        
        // Show corresponding section info and keep section expanded
        if (sectionType === 'him') {
            forHimInfo.classList.add('show');
            forHerInfo.classList.remove('show');
            
            // Keep left section expanded, right section shrink
            sections[0].classList.add('js-active');
            sections[1].classList.add('js-inactive');
            currentHoverSection = 'him';
            
        } else if (sectionType === 'her') {
            forHerInfo.classList.add('show');
            forHimInfo.classList.remove('show');
            
            // Keep right section expanded, left section shrink
            sections[1].classList.add('js-active');
            sections[0].classList.add('js-inactive');
            currentHoverSection = 'her';
        }
    }
    
    // Function to hide section info with delay
    function hideSectionInfo() {
        // HAPUS DELAY ATAU KURANGI JADI SANGAT KECIL
        hoverTimeout = setTimeout(() => {
            sectionInfos.forEach(info => {
                info.classList.remove('show');
            });
            
            // Remove hover from all sections
            sections.forEach(section => {
                section.classList.remove('js-active', 'js-inactive');
            });
            
            // Show center logo
            if (centerLogo) {
                centerLogo.classList.remove('js-hidden');
            }
            
            currentHoverSection = null;
        }, 50); // KURANGI DARI 100ms JADI 50ms
    }
    
    // Add hover effects to sections
    sections.forEach((section, index) => {
        section.addEventListener('mouseenter', function() {
            // LANGSUNG CLEAR TIMEOUT TANPA DELAY
            clearTimeout(hoverTimeout);
            
            if (section.classList.contains('left-section')) {
                showSectionInfo('him');
            } else if (section.classList.contains('right-section')) {
                showSectionInfo('her');
            }
        });
        
        section.addEventListener('mouseleave', function() {
            // CUMA HIDE KALO BENER-BENER KELUAR DARI SEMUA AREA
            if (!isHoveringAnyArea()) {
                hideSectionInfo();
            }
        });
    });
    
    // Function to check if hovering on any interactive area
    function isHoveringAnyArea() {
        return forHimInfo.matches(':hover') || 
               forHerInfo.matches(':hover') ||
               sections[0].matches(':hover') ||
               sections[1].matches(':hover');
    }
    
    // Add hover effects to section infos
    if (forHimInfo) {
        forHimInfo.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            showSectionInfo('him');
        });
        
        forHimInfo.addEventListener('mouseleave', function() {
            if (!sections[0].matches(':hover')) {
                hideSectionInfo();
            }
        });
    }
    
    if (forHerInfo) {
        forHerInfo.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            showSectionInfo('her');
        });
        
        forHerInfo.addEventListener('mouseleave', function() {
            if (!sections[1].matches(':hover')) {
                hideSectionInfo();
            }
        });
    }
    
    // Show center logo when not hovering any section or text
    if (mainContent) {
        mainContent.addEventListener('mouseleave', function() {
            // LANGSUNG RESET TANPA CEK HOVER
            clearTimeout(hoverTimeout);
            
            if (centerLogo) {
                centerLogo.classList.remove('js-hidden');
            }
            
            // Hide all section infos
            sectionInfos.forEach(info => {
                info.classList.remove('show');
            });
            
            // Remove hover from all sections
            sections.forEach(section => {
                section.classList.remove('js-active', 'js-inactive');
            });
            
            currentHoverSection = null;
        });
    }

    // Add click handlers for navigation links
    const navLinks = document.querySelectorAll('.nav-left, .nav-right');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(this.textContent + ' clicked');
        });
    });

    // Add click handlers for explore links
    const exploreLinks = document.querySelectorAll('.explore-link');
    exploreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Explore fragrances clicked');
        });
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        clearTimeout(hoverTimeout);
        
        if (centerLogo) {
            centerLogo.classList.remove('js-hidden');
        }
        
        if (window.innerWidth <= 768) {
            sections.forEach(section => {
                section.classList.remove('js-active', 'js-inactive');
            });
            
            sectionInfos.forEach(info => {
                info.classList.remove('show');
            });
            
            currentHoverSection = null;
        }
    });
    
    // Preload images
    const imageUrls = [
        'images/man.jpg',
        'images/women.png'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
    
    // Error handling for missing images
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            this.parentElement.style.background = 'linear-gradient(45deg, #333, #666)';
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
    
    // Mobile touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                sections[1].classList.add('mobile-active');
                sections[0].classList.remove('mobile-active');
            } else {
                sections[0].classList.add('mobile-active');
                sections[1].classList.remove('mobile-active');
            }
            
            setTimeout(() => {
                sections.forEach(section => {
                    section.classList.remove('mobile-active');
                });
            }, 3000);
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            sections[0].classList.add('keyboard-focus');
            sections[1].classList.remove('keyboard-focus');
            sections[0].focus();
        } else if (e.key === 'ArrowRight') {
            sections[1].classList.add('keyboard-focus');
            sections[0].classList.remove('keyboard-focus');
            sections[1].focus();
        } else if (e.key === 'Escape') {
            sections.forEach(section => {
                section.classList.remove('keyboard-focus');
                section.blur();
            });
        }
    });
    
    // Add tabindex for keyboard navigation
    sections.forEach((section, index) => {
        section.setAttribute('tabindex', '0');
        section.setAttribute('role', 'button');
        section.setAttribute('aria-label', `Explore ${index === 0 ? 'men\'s' : 'women\'s'} perfume collection`);
    });
    
    // Performance optimization with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: [0.1, 0.5, 0.9]
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (sectionObserver) {
            sectionObserver.disconnect();
        }
        clearTimeout(hoverTimeout);
    });
});
