document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar Header on Scroll
    const header = document.querySelector('.navbar-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Navbar Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileClose = document.getElementById('mobile-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileToggle && mobileOverlay) {
        mobileToggle.addEventListener('click', () => {
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll under overlay
        });
    }

    const closeMobileNav = () => {
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scroll
        }
    };

    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileNav);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // 3. Contact Form Submission & Success Modal
    const contactForm = document.getElementById('oit-contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (contactForm && successModal) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const company = document.getElementById('company').value;
            const projectType = document.getElementById('project-type').value;
            const message = document.getElementById('message').value;

            // Prepare log
            console.log('OIT Stack New Inquiry Request:', {
                name,
                email,
                phone,
                company,
                projectType,
                message,
                submittedAt: new Date().toISOString()
            });

            // Mock network latency before showing the success modal
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Request <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>';

            setTimeout(() => {
                // Show Success Modal
                successModal.classList.add('active');
                
                // Reset form fields
                contactForm.reset();
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1000);
        });
    }

    // Close Modal Event
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });

        // Close modal when clicking outside the modal card
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // 4. Update Copyright Year Dynamically
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
