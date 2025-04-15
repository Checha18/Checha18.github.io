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
    
    // Text analyzer functionality
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadSampleBtn = document.getElementById('load-sample');
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeText);
    }
    
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', loadSampleText);
    }
});

// Text analyzer functions
function loadSampleText() {
    fetch('https://www.gutenberg.org/files/1342/1342-0.txt') // Pride and Prejudice
        .then(response => response.text())
        .then(text => {
            document.getElementById('text-input').value = text.slice(0, 50000); // Limit to prevent browser issues
        })
        .catch(error => {
            console.error('Error loading sample text:', error);
            document.getElementById('text-input').value = "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him...";
        });
}

function analyzeText() {
    const text = document.getElementById('text-input').value;
    if (!text.trim()) {
        alert('Please enter some text to analyze.');
        return;
    }
    
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results
    
    // Basic text statistics
    displayBasicStats(text, resultsContainer);
    
    // Pronouns analysis
    displayPronounsAnalysis(text, resultsContainer);
    
    // Prepositions analysis
    displayPrepositionsAnalysis(text, resultsContainer);
    
    // Indefinite articles analysis
    displayArticlesAnalysis(text, resultsContainer);
}

function displayBasicStats(text, container) {
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const words = text.trim().split(/\s+/).length;
    const spaces = (text.match(/\s/g) || []).length;
    const newlines = (text.match(/\n/g) || []).length;
    const specialSymbols = (text.match(/[^\w\s]/g) || []).length;
    
    const section = document.createElement('div');
    section.className = 'results-section';
    
    section.innerHTML = `
        <h3 class="results-title">Basic Text Statistics</h3>
        <table>
            <tr><td>Letters:</td><td>${letters}</td></tr>
            <tr><td>Words:</td><td>${words}</td></tr>
            <tr><td>Spaces:</td><td>${spaces}</td></tr>
            <tr><td>Newlines:</td><td>${newlines}</td></tr>
            <tr><td>Special Symbols:</td><td>${specialSymbols}</td></tr>
        </table>
    `;
    
    container.appendChild(section);
}

function displayPronounsAnalysis(text, container) {
    // Define list of common English pronouns
    const pronouns = [
        'i', 'me', 'my', 'mine', 'myself',
        'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself',
        'she', 'her', 'hers', 'herself',
        'it', 'its', 'itself',
        'we', 'us', 'our', 'ours', 'ourselves',
        'they', 'them', 'their', 'theirs', 'themselves',
        'who', 'whom', 'whose', 'which', 'that'
    ];
    
    // Use regex to find words (accounting for word boundaries)
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Count each pronoun
    const pronounCounts = {};
    pronouns.forEach(pronoun => {
        pronounCounts[pronoun] = 0;
    });
    
    words.forEach(word => {
        if (pronouns.includes(word)) {
            pronounCounts[word]++;
        }
    });
    
    // Filter to include only pronouns that appear in the text
    const filteredPronounCounts = Object.entries(pronounCounts)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]); // Sort by count in descending order
    
    const section = document.createElement('div');
    section.className = 'results-section';
    
    let tableContent = filteredPronounCounts.map(([pronoun, count]) => 
        `<tr><td>${pronoun}</td><td>${count}</td></tr>`
    ).join('');
    
    if (!tableContent) {
        tableContent = '<tr><td colspan="2">No pronouns found in the text.</td></tr>';
    }
    
    section.innerHTML = `
        <h3 class="results-title">Pronoun Analysis</h3>
        <table>
            <thead>
                <tr>
                    <th>Pronoun</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                ${tableContent}
            </tbody>
        </table>
    `;
    
    container.appendChild(section);
}

function displayPrepositionsAnalysis(text, container) {
    // Define list of common English prepositions
    const prepositions = [
        'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
        'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides',
        'between', 'beyond', 'by', 'concerning', 'despite', 'down', 'during',
        'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of',
        'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
        'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards',
        'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
    ];
    
    // Use regex to find words (accounting for word boundaries)
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Count each preposition
    const prepositionCounts = {};
    prepositions.forEach(preposition => {
        prepositionCounts[preposition] = 0;
    });
    
    words.forEach(word => {
        if (prepositions.includes(word)) {
            prepositionCounts[word]++;
        }
    });
    
    // Filter to include only prepositions that appear in the text
    const filteredPrepositionCounts = Object.entries(prepositionCounts)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]); // Sort by count in descending order
    
    const section = document.createElement('div');
    section.className = 'results-section';
    
    let tableContent = filteredPrepositionCounts.map(([preposition, count]) => 
        `<tr><td>${preposition}</td><td>${count}</td></tr>`
    ).join('');
    
    if (!tableContent) {
        tableContent = '<tr><td colspan="2">No prepositions found in the text.</td></tr>';
    }
    
    section.innerHTML = `
        <h3 class="results-title">Preposition Analysis</h3>
        <table>
            <thead>
                <tr>
                    <th>Preposition</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                ${tableContent}
            </tbody>
        </table>
    `;
    
    container.appendChild(section);
}

function displayArticlesAnalysis(text, container) {
    // Define indefinite articles
    const articles = ['a', 'an'];
    
    // Use regex to find words (accounting for word boundaries)
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Count each article
    const articleCounts = {
        'a': 0,
        'an': 0
    };
    
    words.forEach(word => {
        if (articles.includes(word)) {
            articleCounts[word]++;
        }
    });
    
    const section = document.createElement('div');
    section.className = 'results-section';
    
    const tableContent = Object.entries(articleCounts)
        .map(([article, count]) => `<tr><td>${article}</td><td>${count}</td></tr>`)
        .join('');
    
    section.innerHTML = `
        <h3 class="results-title">Indefinite Article Analysis</h3>
        <table>
            <thead>
                <tr>
                    <th>Article</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                ${tableContent}
            </tbody>
        </table>
    `;
    
    container.appendChild(section);
}