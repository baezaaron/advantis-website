document.addEventListener('DOMContentLoaded', function() {
    // First priority: Force cache refresh for all stylesheets
    forceStyleRefresh();
    
    // Add anchor link offset handling
    handleAnchorLinks();
    
    // Mobile Menu Toggle - enhanced implementation
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
            
            // Extract the current href without any query parameters
            const currentHref = link.getAttribute('href').split('?')[0];
            // Add timestamp as version parameter 
            link.setAttribute('href', `${currentHref}?v=${timestamp}`);
            console.log(`Refreshed: ${link.getAttribute('href')}`);
        });
        
        // Ensure viewport meta tag exists
        ensureViewportMeta();
        
        // Add inline style for additional fixes if needed
        addInlineStyles();
    }
    
    // Handle anchor links with offset for fixed header
    function handleAnchorLinks() {
        // Check if we have a hash in the URL on page load
        if (window.location.hash) {
            // Wait a brief moment for the page to settle
            setTimeout(function() {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    scrollToElementWithOffset(targetElement, 100);
                }
            }, 100);
        }
        
        // Add click event listeners to all internal anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                if (targetId) {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        scrollToElementWithOffset(targetElement, 100);
                        
                        // Update URL without scrolling
                        if (history.pushState) {
                            history.pushState(null, null, `#${targetId}`);
                        }
                    }
                }
            });
        });
        
        // Also handle Learn More links that point to anchors on other pages
        const externalAnchorLinks = document.querySelectorAll('a.learn-more[href*="#"]');
        externalAnchorLinks.forEach(link => {
            // Store the offset in a data attribute to be used when the target page loads
            link.setAttribute('data-scroll-offset', 'true');
        });
    }
    
    // Scroll to element with offset
    function scrollToElementWithOffset(element, offset) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Setup mobile menu functionality - improved implementation
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const navContainer = document.querySelector('.nav-container');
        const dropdowns = document.querySelectorAll('.dropdown');
        
        if (!mobileMenuBtn || !navLinks) return;
        
        // Fix for iOS Safari - ensure menu button works correctly
        mobileMenuBtn.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent default behavior for touch events
            toggleMobileMenu();
        });
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        function toggleMobileMenu() {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            console.log("Mobile menu toggled");
        }
        
        // Improved dropdown handling in mobile view
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            if (link && dropdownContent) {
                // Create a toggle indicator for mobile view
                const toggleIndicator = document.createElement('span');
                toggleIndicator.className = 'dropdown-toggle';
                toggleIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
                
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 900) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const wasActive = dropdown.classList.contains('active');
                        
                        // Close all other dropdowns
                        dropdowns.forEach(d => {
                            if (d !== dropdown) d.classList.remove('active');
                        });
                        
                        // Toggle clicked dropdown
                        dropdown.classList.toggle('active');
                    }
                });
                
                // Prevent dropdown content clicks from closing the menu
                if (dropdownContent) {
                    dropdownContent.addEventListener('click', function(e) {
                        if (window.innerWidth <= 900) {
                            e.stopPropagation();
                        }
                    });
                }
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks && navLinks.classList.contains('active') && 
                !e.target.closest('.nav-container')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });
        
        // When screen size changes, reset menu state
        window.addEventListener('resize', function() {
            if (window.innerWidth > 900) {
                if (navLinks) navLinks.classList.remove('active');
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
        const resourcesContainer = document.querySelector('.resources-container');
        
        if (!filterButtons.length || !resourcesContainer) return;
        
        // Check if we need pagination
        function updatePagination() {
            const visibleCards = document.querySelectorAll('.resource-card:not([style*="display: none"])');
            let paginationContainer = document.querySelector('.pagination');
            
            // If there are more than 6 visible items, we need pagination
            const needsPagination = visibleCards.length > 6;
            
            // If pagination exists but we don't need it, remove it
            if (!needsPagination && paginationContainer) {
                paginationContainer.remove();
                
                // Make all cards visible again
                visibleCards.forEach(card => {
                    card.style.display = 'block';
                });
                
                return;
            }
            
            // If we need pagination but don't have the container yet
            if (needsPagination && !paginationContainer) {
                paginationContainer = document.createElement('div');
                paginationContainer.className = 'pagination';
                
                // Create page buttons based on the number of cards (6 per page)
                const pageCount = Math.ceil(visibleCards.length / 6);
                
                for (let i = 1; i <= pageCount; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = 'page-btn' + (i === 1 ? ' active' : '');
                    pageBtn.textContent = i;
                    pageBtn.setAttribute('aria-label', 'Page ' + i);
                    
                    pageBtn.addEventListener('click', function() {
                        // Update active state
                        document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Show/hide appropriate cards
                        const pageIndex = parseInt(this.textContent);
                        const startIdx = (pageIndex - 1) * 6;
                        const endIdx = startIdx + 6;
                        
                        Array.from(visibleCards).forEach((card, idx) => {
                            card.style.display = (idx >= startIdx && idx < endIdx) ? 'block' : 'none';
                        });
                        
                        // Scroll to top of resources section
                        const resourcesSection = document.querySelector('.resources-container');
                        if (resourcesSection) {
                            scrollToElementWithOffset(resourcesSection, 100);
                        }
                    });
                    
                    paginationContainer.appendChild(pageBtn);
                }
                
                resourcesContainer.appendChild(paginationContainer);
                
                // Show only first page
                Array.from(visibleCards).forEach((card, idx) => {
                    card.style.display = (idx < 6) ? 'block' : 'none';
                });
            } else if (needsPagination && paginationContainer) {
                // Update existing pagination if filter changed
                // Remove existing buttons
                while (paginationContainer.firstChild) {
                    paginationContainer.removeChild(paginationContainer.firstChild);
                }
                
                // Create new page buttons
                const pageCount = Math.ceil(visibleCards.length / 6);
                
                for (let i = 1; i <= pageCount; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = 'page-btn' + (i === 1 ? ' active' : '');
                    pageBtn.textContent = i;
                    pageBtn.setAttribute('aria-label', 'Page ' + i);
                    
                    pageBtn.addEventListener('click', function() {
                        // Update active state
                        document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Show/hide appropriate cards
                        const pageIndex = parseInt(this.textContent);
                        const startIdx = (pageIndex - 1) * 6;
                        const endIdx = startIdx + 6;
                        
                        Array.from(visibleCards).forEach((card, idx) => {
                            card.style.display = (idx >= startIdx && idx < endIdx) ? 'block' : 'none';
                        });
                        
                        // Scroll to top of resources section
                        const resourcesSection = document.querySelector('.resources-container');
                        if (resourcesSection) {
                            scrollToElementWithOffset(resourcesSection, 100);
                        }
                    });
                    
                    paginationContainer.appendChild(pageBtn);
                }
                
                // Show only first page
                Array.from(visibleCards).forEach((card, idx) => {
                    card.style.display = (idx < 6) ? 'block' : 'none';
                });
            }
        }
        
        // Apply filters and update pagination
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Show/hide cards based on filter
                resourceCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const cardTypes = card.getAttribute('data-type').split(' ');
                        card.style.display = cardTypes.includes(filter) ? 'block' : 'none';
                    }
                });
                
                // Update pagination after filtering
                updatePagination();
            });
        });
        
        // Initialize pagination on page load
        updatePagination();
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