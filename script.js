document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.footer-contact-form');
    
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

    // Resource filtering and interaction
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

    // Read More functionality
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = link.dataset.articleId;
            // Replace with your actual article URL structure
            window.location.href = `article.html?id=${articleId}`;
        });
    });

    // Team Member Modal Functionality
    const teamMembers = document.querySelectorAll('.team-member');
    const modal = document.getElementById('team-modal');
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

    // Close modal when clicking the close button or outside the modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});