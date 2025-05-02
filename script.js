document.addEventListener('DOMContentLoaded', function() {
    // First priority: Force cache refresh for all stylesheets
    forceStyleRefresh();
    
    // Mobile Menu Toggle
    setupMobileMenu();
    
    // Contact Form
    setupContactForm();
    
    // Resource filtering
    setupResourceFiltering();
    
    // Other functionality
    setupTeamModal();
    setupFormSubmission();
    
    // Add responsive handlers
    setupResponsiveHandlers();
    
    // Functions
    
    // Force refresh of all stylesheets to prevent caching issues
    function forceStyleRefresh() {
        console.log("Forcing style refresh");
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
            console.log(`Refreshed: ${link.getAttribute('href')}`);
        });
        
        // Ensure viewport meta tag exists
        ensureViewportMeta();
        
        // Add inline style for additional fixes if needed
        addInlineStyles();
    }
    
    // Setup mobile menu functionality
    function setupMobileMenu() {
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
            if (link) {
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
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-container') && navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });
    }
    
    // Setup contact form functionality
    function setupContactForm() {
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
    }
    
    // Setup resource filtering functionality
    function setupResourceFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const resourceCards = document.querySelectorAll('.resource-card');
    
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    const filter = button.dataset.filter;
                    
                    resourceCards.forEach(card => {
                        if (filter === 'all' || card.classList.contains(filter)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        }
    }
    
    // Setup team modal functionality
    function setupTeamModal() {
        const teamMembers = document.querySelectorAll('.team-member');
        const modal = document.getElementById('team-modal');
        
        if (!modal) return;
        
        const modalImg = document.getElementById('modal-img');
        const modalName = document.getElementById('modal-name');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalLinkedIn = document.getElementById('modal-linkedin');
        const closeBtn = document.querySelector('.close-btn');
    
        teamMembers.forEach(member => {
            member.addEventListener('click', (e) => {
                // Don't open modal if clicking LinkedIn link
                if (e.target.closest('.linkedin-link')) {
                    return;
                }
    
                const img = member.querySelector('img').src;
                const name = member.querySelector('h3').textContent.trim();
                const title = member.querySelector('.team-title').textContent;
                const bio = member.querySelector('.team-bio p').textContent;
                const linkedin = member.getAttribute('data-linkedin');
    
                modalImg.src = img;
                modalName.textContent = name;
                modalTitle.textContent = title;
                modalDesc.textContent = bio;
    
                if (linkedin) {
                    modalLinkedIn.href = linkedin;
                    modalLinkedIn.style.display = 'inline-block';
                } else {
                    modalLinkedIn.style.display = 'none';
                }
    
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
    
        // Close modal with button or outside click
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            // Close modal with ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        }
    
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Setup form submission functionality
    function setupFormSubmission() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.classList.contains('footer-contact-form')) {
                // Skip the footer contact form as it's handled separately
                return;
            }
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Basic form validation
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
    
                if (!isValid) {
                    showMessage('Please fill in all required fields', 'error');
                    return;
                }
    
                // Get form data
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => data[key] = value);
    
                try {
                    const response = await fetch(form.action || 'https://formspree.io/f/xyzwkdrz', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
    
                    if (response.ok) {
                        showMessage('Message sent successfully!', 'success');
                        form.reset();
                    } else {
                        throw new Error('Network response was not ok');
                    }
                } catch (error) {
                    showMessage('There was a problem sending your message. Please try again.', 'error');
                }
            });
        });
    }
    
    // Setup responsive handlers
    function setupResponsiveHandlers() {
        // Make images responsive
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
    
        // Ensure all sections have proper overflow handling
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.overflow = 'hidden';
        });
        
        // Handle window resize events
        window.addEventListener('resize', function() {
            if (window.innerWidth > 900) {
                const navLinks = document.querySelector('.nav-links');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                const dropdowns = document.querySelectorAll('.dropdown');
                
                if (navLinks) navLinks.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });
        
        // Fix scrolling issues on load
        window.addEventListener('load', function() {
            // Reset scroll position if needed
            if (window.location.hash === '') {
                window.scrollTo(0, 0);
            }
            
            // Fix potential overflow issues
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            
            // Force refresh styles again after full page load
            forceStyleRefresh();
        });
    }
    
    // Helper: Ensure viewport meta tag exists
    function ensureViewportMeta() {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (!metaViewport) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(meta);
        }
    }
    
    // Helper: Add inline styles for fixes
    function addInlineStyles() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        
        style.type = 'text/css';
        style.appendChild(document.createTextNode(`
            body.menu-open {
                overflow: hidden;
            }
            
            @media (max-width: 767px) {
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
                
                .nav-links.active {
                    display: block;
                    max-height: calc(100vh - 70px);
                    overflow-y: auto;
                }
            }
            
            .learn-more, .resource-card a {
                color: #0066CC;
            }
        `));
        
        head.appendChild(style);
    }
    
    // Helper: Show form message
    function showFormMessage(message, type) {
        const contactForm = document.querySelector('.footer-contact-form');
        if (!contactForm) return;
        
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
    
    // Helper: Show generic message
    function showMessage(message, type) {
        const form = document.querySelector('form');
        if (!form) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;

        // Insert the message after the form
        form.parentNode.insertBefore(messageDiv, form.nextSibling);

        // Remove the message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});