// Load work experience data from JSON
async function loadWorkData() {
    try {
        const response = await fetch('js/work-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Loaded work data:', data);
        return data;
    } catch (error) {
        console.error('Error loading work data:', error);
        return {};
    }
}

// Create a single work experience item with exact same structure as original
function createWorkItem(id, data) {
    console.log('Creating work item for:', id, data);
    const item = document.createElement('div');
    item.className = 'drop-down-item';
    
    // Create exact same HTML structure as original
    item.innerHTML = `
        <div class="drop-down-label">
            <div class="drop-down-info">
                <div class="drop-down-main">${data.title}</div>
                <div class="drop-down-sub">
                    <span>
                        <a href="${data.url}" target="_blank" rel="noopener noreferrer">
                            ${data.company}&#8239;<svg class="external-link-icon" width="16" height="16">
                                <use xlink:href="#external-link-icon"></use>
                            </svg>
                        </a>
                    </span>
                </div>
            </div>
            <div class="drop-down-icon"></div>
        </div>
        <div class="drop-down-content">
            <div class="skill-tags">
                ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            ${data.team ? `
                <div class="team-info">
                    ${data.team.url 
                        ? `<a href="${data.team.url}" target="_blank" rel="noopener noreferrer">
                            ${data.team.name}&#8239;<svg class="external-link-icon" width="12" height="12">
                                <use xlink:href="#external-link-icon"></use>
                            </svg>
                           </a>`
                        : data.team.name}
                </div>` 
                : ''}
            ${data.description.map(desc => `<p>${desc}</p>`).join('')}
        </div>
        <div class="vertical-date">
            <span class="start-date">${data.duration.start.replace(' ', '&nbsp;')}</span>
            <span class="date-line"></span>
            <span class="end-date">${data.duration.end.replace(' ', '&nbsp;')}</span>
        </div>
    `;
    
    return item;
}

// Initialize the work experience section
async function initializeWorkExperience() {
    const data = await loadWorkData();
    const container = document.querySelector('.drop-down-list');
    
    if (!container) {
        console.error('Work experience container not found');
        return;
    }
    
    if (Object.keys(data).length === 0) {
        console.error('No work data loaded');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add all work items
    Object.entries(data).forEach(([id, workData]) => {
        const workItem = createWorkItem(id, workData);
        container.appendChild(workItem);
    });

    // Re-initialize the dropdown functionality
    if (typeof initializeDropDownList === 'function') {
        console.log('Initializing dropdown functionality');
        initializeDropDownList();
    } else {
        console.error('initializeDropDownList function not found');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing work experience');
    initializeWorkExperience();
});