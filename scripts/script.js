document.addEventListener('DOMContentLoaded', () => {
    // User interaction tracking functionality
    const trackUserInteraction = (eventType, element) => {
        const timestamp = new Date().toISOString();
        let elementType = 'unknown';
        
        // Determine element type
        if (element) {
            if (element.tagName === 'IMG') elementType = 'image';
            else if (element.tagName === 'BUTTON') elementType = 'button';
            else if (element.tagName === 'A') elementType = 'link';
            else if (element.tagName === 'INPUT') {
                if (element.type === 'text') elementType = 'text-input';
                else if (element.type === 'checkbox') elementType = 'checkbox';
                else elementType = 'input-' + element.type;
            }
            else if (element.tagName === 'SELECT') elementType = 'dropdown';
            else if (element.classList.contains('skill-item')) elementType = 'skill-item';
            else elementType = element.tagName.toLowerCase();
        }
        
        console.log(`${timestamp}, ${eventType}, ${elementType}`);
    };
    
    // Track all click events
    document.addEventListener('click', (e) => {
        trackUserInteraction('click', e.target);
    });
    
    // Log page view on load
    trackUserInteraction('view', document.body);

    // Theme toggle functionality
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle.querySelector("i");
    
    // Set initial state to light mode
    themeIcon.classList.add("fa-sun");
    themeIcon.classList.remove("fa-moon");
    document.body.classList.remove("alt");

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("alt");
        themeIcon.classList.toggle("fa-sun");
        themeIcon.classList.toggle("fa-moon");
    });

    // Welcome page functionality
    const welcomePage = document.getElementById('welcome-page');
    const mainContent = document.getElementById('main-content');

    const enterSite = () => {
        welcomePage.style.display = 'none';
        mainContent.style.display = 'block';
    };

    welcomePage.addEventListener('click', enterSite);
    
    // Fixed: Only attach event listener if element exists
    const enterButton = document.getElementById('enter-btn');
    if (enterButton) {
        enterButton.addEventListener('click', (e) => {
            e.stopPropagation();
            enterSite();
        });
    }

    // Modal functionality (fixed)
    const modalOverlay = document.getElementById('modal-overlay');
    const modalPic = document.getElementById('modal-pic');
    
    // Function to open modal with a specific image
    const openModal = (imgSrc) => {
        if (modalPic && modalOverlay) {
            modalPic.src = imgSrc;
            modalOverlay.style.display = 'block';
            
            // For gallery images, set larger dimensions
            if (imgSrc.includes('image') || imgSrc.includes('placeholder')) {
                modalPic.style.width = '80%';
                modalPic.style.height = 'auto';
                modalPic.style.maxHeight = '90vh';
            } else {
                // Reset to default for profile pic
                modalPic.style.width = '400px';
                modalPic.style.height = '400px';
                modalPic.style.maxHeight = '';
            }
            
            // Use setTimeout to ensure the display:block has taken effect
            setTimeout(() => {
                modalOverlay.classList.add('active');
                modalPic.classList.add('active');
            }, 10);
        }
    };

    // Profile picture modal trigger
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        profilePic.addEventListener('click', () => {
            openModal(profilePic.src);
        });
    }

    // Gallery images modal triggers
    const galleryImages = document.querySelectorAll('.photo-gallery img');
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            console.log('Gallery image clicked:', image.src); // Debug
            openModal(image.src);
        });
    });

    // Close modal when clicking outside the image
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                modalPic.classList.remove('active');
                
                setTimeout(() => {
                    modalOverlay.style.display = 'none';
                    // Reset modal pic styling
                    modalPic.style.width = '';
                    modalPic.style.height = '';
                    modalPic.style.maxHeight = '';
                }, 300);
            }
        });
    }

    // Skill items hover effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
});
