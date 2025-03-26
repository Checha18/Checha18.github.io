document.addEventListener('DOMContentLoaded', () => {
    const enterButton = document.getElementById('enter-btn');
    const welcomePage = document.getElementById('welcome-page');
    const mainContent = document.getElementById('main-content');

    const enterSite = () => {
        welcomePage.style.display = 'none';
        mainContent.style.display = 'block';
    };

    welcomePage.addEventListener('click', enterSite);
    enterButton.addEventListener('click', (e) => {
        e.stopPropagation();  // Prevent double triggering
        enterSite();
    });

    // Profile picture modal functionality
    const profilePic = document.getElementById('profile-pic');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalPic = document.getElementById('modal-pic');

    profilePic.addEventListener('click', () => {
        modalPic.src = profilePic.src;
        modalOverlay.style.display = 'block';
        // Use setTimeout to ensure the display:block has taken effect
        setTimeout(() => {
            modalOverlay.classList.add('active');
            modalPic.classList.add('active');
        }, 10);
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            modalPic.classList.remove('active');
            setTimeout(() => {
                modalOverlay.style.display = 'none';
            }, 300); // Match the CSS transition duration
        }
    });

    // Cursor trail effect
    const createTrail = () => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 500);
    };

    document.addEventListener('mousemove', (e) => {
        const trail = createTrail();
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
    });

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
