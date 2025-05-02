document.addEventListener('DOMContentLoaded', function() {
    console.log("Blog script initialized");
    
    // Force refresh CSS to prevent caching issues
    refreshStyles();
    
    // Mobile Menu Toggle with debug
    initMobileMenu();
    
    // Contact Form Handling
    setupContactForm();
    
    // Add Mobile Styles
    addMobileStyles();
    
    // Handle Window Resize
    setupResizeHandler();
    
    // Functions
    
    // Force CSS refresh to prevent caching
    function refreshStyles() {
        const timestamp = new Date().getTime();
        console.log("Refreshing styles with timestamp: " + timestamp);
        
        const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
        styleLinks.forEach(link => {
            // Skip CDN files or external resources
            if (link.href.includes('cdnjs.cloudflare.com') || 
                link.href.includes('fonts.googleapis.com')) {
                return;
            }
            
            const currentHref = link.getAttribute('href').split('?')[0];
            const newHref = `${currentHref}?v=${timestamp}`;
            link.setAttribute('href', newHref);
            console.log(`Updated stylesheet: ${currentHref} -> ${newHref}`);
        });
    }
    
    // Initialize Mobile Menu
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (!mobileMenuBtn) {
            console.error("Mobile menu button not found!");
            return;
        }
        
        if (!navLinks) {
            console.error("Nav links not found!");
            return;
        }
        
        console.log("Mobile menu components found, adding listeners");
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log("Mobile menu button clicked");
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Handle Dropdowns
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            if (link) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 900) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Dropdown toggle clicked");
                        
                        const wasActive = dropdown.classList.contains('active');
                        
                        // Close all dropdowns
                        dropdowns.forEach(d => d.classList.remove('active'));
                        
                        // Toggle current dropdown
                        if (!wasActive) {
                            dropdown.classList.add('active');
                        }
                    }
                });
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
                console.log("Clicking outside menu - closing");
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });
    }
    
    // Setup Contact Form
    function setupContactForm() {
        const contactForm = document.querySelector('.footer-contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                console.log("Form submission attempted");
                
                // Get form data
                const formData = {
                    name: contactForm.querySelector('input[placeholder="Name"]').value,
                    company: contactForm.querySelector('input[placeholder="Company"]').value,
                    email: contactForm.querySelector('input[type="email"]').value,
                    source: contactForm.querySelector('select').value,
                    message: contactForm.querySelector('textarea').value
                };
                
                // Show loading state
                const submitButton = contactForm.querySelector('button');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                try {
                    // Replace this URL with your actual form handling endpoint
                    const response = await fetch('https://formspree.io/f/xyzwkdrz', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        console.log("Form submission successful");
                        // Show success message
                        showFormMessage('Thank you! We\'ll be in touch soon.', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error('Failed to submit form');
                    }
                } catch (error) {
                    console.error("Form submission error:", error);
                    // Show error message
                    showFormMessage('Oops! Something went wrong. Please try again.', 'error');
                } finally {
                    // Reset button state
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
            });
        }
    }
    
    // Show form message
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Find the form
        const contactForm = document.querySelector('.footer-contact-form');
        if (contactForm) {
            // Insert message after form
            contactForm.insertAdjacentElement('afterend', messageElement);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
    
    // Add Mobile Styles
    function addMobileStyles() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        
        style.type = 'text/css';
        style.appendChild(document.createTextNode(`
            /* Mobile Menu Fixes */
            body.menu-open {
                overflow: hidden;
            }
            
            @media (max-width: 767px) {
                .mobile-menu-btn {
                    display: block;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    z-index: 1001;
                    position: relative;
                }
                
                .mobile-menu-btn span {
                    display: block;
                    width: 24px;
                    height: 2px;
                    background: #333;
                    margin: 5px 0;
                    transition: all 0.3s ease;
                }
                
                .mobile-menu-btn.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                
                .mobile-menu-btn.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-btn.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(5px, -5px);
                }
                
                .nav-links {
                    display: none;
                    position: fixed;
                    top: 70px;
                    left: 0;
                    width: 100%;
                    background: white;
                    flex-direction: column;
                    padding: 1rem;
                    height: calc(100vh - 70px);
                    overflow-y: auto;
                    z-index: 1000;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                
                .nav-links.active {
                    display: flex;
                }
                
                .nav-links li {
                    margin: 0.75rem 0;
                }
                
                .dropdown-content {
                    display: none;
                    position: static;
                    background-color: #f9f9f9;
                    box-shadow: none;
                    padding: 0.5rem 0 0.5rem 1rem;
                    margin-top: 0.5rem;
                    width: 100%;
                }
                
                .dropdown.active .dropdown-content {
                    display: block;
                }
            }
        `));
        
        head.appendChild(style);
        console.log("Mobile styles added");
    }
    
    // Handle Window Resize
    function setupResizeHandler() {
        window.addEventListener('resize', function() {
            if (window.innerWidth > 900) {
                const navLinks = document.querySelector('.nav-links');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                
                if (navLinks) navLinks.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                
                document.body.classList.remove('menu-open');
                
                const dropdowns = document.querySelectorAll('.dropdown');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });
        console.log("Resize handler set up");
    }
}); 