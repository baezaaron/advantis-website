document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            console.log("Mobile menu toggled");
        });
    }

    // Handle dropdowns in mobile view
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                e.stopPropagation();
                const wasActive = dropdown.classList.contains('active');
                
                // Close all other dropdowns
                dropdowns.forEach(d => d.classList.remove('active'));
                
                // Toggle clicked dropdown
                if (!wasActive) {
                    dropdown.classList.add('active');
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Contact form submission handling
    const contactForm = document.querySelector('.footer-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
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
                    // Show success message
                    showFormMessage('Thank you! We\'ll be in touch soon.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to submit form');
                }
            } catch (error) {
                // Show error message
                showFormMessage('Oops! Something went wrong. Please try again.', 'error');
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // Function to show form messages
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

        // Insert message after form
        contactForm.insertAdjacentElement('afterend', messageElement);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Force CSS refresh to prevent caching
    function refreshStyles() {
        const timestamp = new Date().getTime();
        
        const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
        styleLinks.forEach(link => {
            // Skip CDN files or external resources
            if (link.href.includes('cdnjs.cloudflare.com') || 
                link.href.includes('fonts.googleapis.com')) {
                return;
            }
            
            const currentHref = link.getAttribute('href').split('?')[0];
            link.setAttribute('href', `${currentHref}?v=${timestamp}`);
        });
    }

    // Refresh styles to prevent caching issues
    refreshStyles();

    // Add CSS to fix mobile menu appearance
    function addMobileStyles() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        
        style.type = 'text/css';
        style.appendChild(document.createTextNode(`
            body.menu-open {
                overflow: hidden;
            }
            
            @media (max-width: 767px) {
                .nav-links.active {
                    display: block;
                    max-height: calc(100vh - 70px);
                    overflow-y: auto;
                }
                
                .nav-links.active li {
                    margin-bottom: 0.75rem;
                }
                
                .dropdown-content {
                    position: static;
                    box-shadow: none;
                    display: none;
                    padding-left: 1.5rem;
                    background: #f9f9f9;
                    margin-top: 0.5rem;
                    border-radius: 4px;
                }
                
                .dropdown.active .dropdown-content {
                    display: block;
                }
            }
        `));
        
        head.appendChild(style);
    }
    
    // Add the mobile styles
    addMobileStyles();
    
    // Handle window resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
}); 