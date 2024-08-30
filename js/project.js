let projectsData = {};

async function loadProjectsData() {
    try {
        console.log('Attempting to fetch project data...');
        const scriptTag = document.querySelector('script[data-project-data]');
        const jsonPath = scriptTag.getAttribute('data-project-data');
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Project data fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error loading project data:', error);
        return {};
    }
}

function getProjectIdFromUrl() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment.length > 0);
    return segments[segments.length - 1] || 'index';
}


async function initializePage() {
    console.log('Initializing page...');
    const projectsData = await loadProjectsData();
    console.log('Project data after loading:', projectsData);

    const projectId = getProjectIdFromUrl();
    console.log('Current project ID:', projectId);

    if (Object.keys(projectsData).length === 0) {
        console.error('No project data loaded. Cannot proceed with initialization.');
        return;
    }

    if (!projectsData[projectId]) {
        console.error(`Project with ID "${projectId}" not found in the data.`);
        return;
    }

    loadProjectData(projectId, projectsData[projectId]);
    setupHeaderControl();
    initializeTheme();

    const scrollRightButton = document.getElementById('scroll-right');
    const backToTopButton = document.getElementById('back-to-top');
    const horizontalScroll = document.querySelector('.horizontal-scroll');

    scrollRightButton.addEventListener('click', function(e) {
        e.preventDefault();
        horizontalScroll.scrollBy({
            left: window.innerWidth,
            behavior: 'smooth'
        });
    });

    backToTopButton.addEventListener('click', function(e) {
        if (window.innerWidth > 768) {
            horizontalScroll.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    });

    document.getElementById('back-to-main').href = `../#${projectId}`;
    console.log('Page initialization complete');
}

function loadProjectData(projectId, projectData) {
    document.title = `${projectData.name} - Jaxen Dutta`;
    document.getElementById('project-name').textContent = projectData.name.toUpperCase();

    const content = document.querySelector('.horizontal-scroll');
    content.innerHTML = ''; // Clear existing content

    // Add project name section in enormous font
    const projectNameElement = document.createElement('div');
    projectNameElement.className = 'section name';
    projectNameElement.id = 'project-name-top';
    projectNameElement.innerHTML = `<h1>${projectData.name.toUpperCase()}</h1>`;
    content.appendChild(projectNameElement);

    // Create a container for overview paragraphs
    const overviewContainer = document.createElement('div');
    overviewContainer.className = 'overview-container';
    content.appendChild(overviewContainer);

    // Add overview paragraphs with links
    if (projectData.overview && projectData.overview.length > 0) {
        projectData.overview.forEach((para) => {
            const paragraphElement = document.createElement('div');
            paragraphElement.className = 'section overview-paragraph';

            const pElement = document.createElement('p');
            pElement.innerHTML = para; // Use innerHTML to preserve HTML tags
            paragraphElement.appendChild(pElement);

            // Add links to each overview paragraph
            if (projectData.links && projectData.links.length > 0) {
                const linksContainer = document.createElement('div');
                linksContainer.className = 'project-links';

                projectData.links.forEach(link => {
                    const linkElement = document.createElement('a');
                    linkElement.href = link.url;
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                    linkElement.className = 'project-link';

                    const linkText = document.createElement('span');
                    linkText.textContent = link.name.toUpperCase();
                    linkElement.appendChild(linkText);

                    const externalArrow = document.createElement('span');
                    externalArrow.className = 'external-arrow';
                    externalArrow.innerHTML = '&#8599;'; // Unicode for top-right arrow
                    linkElement.appendChild(externalArrow);

                    linksContainer.appendChild(linkElement);
                });

                paragraphElement.appendChild(linksContainer);
            }

            overviewContainer.appendChild(paragraphElement);
        });
    }

    // Typography section
    if (projectData.typography && projectData.typography.length > 0) {
        const typographySection = createTypographySection(projectData);
        typographySection.id = 'typography';
        content.appendChild(typographySection);
    }

    // Colors
    if (projectData.colors && projectData.colors.length > 0) {
        const colorSection = createColorSection(projectData.colors);
        content.appendChild(colorSection);
    }

    // Tech Stack section
    if (projectData.techStack && Object.keys(projectData.techStack).length > 0) {
        const techStackSection = createTechStackSection(projectData.techStack);
        content.appendChild(techStackSection);
    }

    // Footer
    if (projectData.footer) {
        const footerSection = createFooterSection(projectData.footer);
        content.appendChild(footerSection);
    }
}

function setupHeaderControl() {
    const header = document.querySelector('header');
    const content = document.querySelector('.horizontal-scroll');
    let isDesktop = window.innerWidth > 768; // Assuming 768px as the breakpoint

    function updateHeaderPosition() {
        const scrollLeft = content.scrollLeft;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        header.style.right = (scrollLeft > 0 || scrollTop > 0) ? '0' : '-120px';
    }

    function handleScroll(event) {
        if (isDesktop && event.target === document) {
            //if (event.deltaY === 0) return; // Skip if no vertical scroll
            // Redirect vertical scroll to horizontal on desktop
            event.preventDefault();
            content.scrollLeft += event.deltaY * 1000;
        }
        updateHeaderPosition();
    }

    function handleResize() {
        isDesktop = window.innerWidth > 768;
    }

    // Throttle function to limit the rate of execution
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Event listeners
    window.addEventListener('scroll', throttle(updateHeaderPosition, 100), { passive: true });
    content.addEventListener('scroll', throttle(updateHeaderPosition, 100), { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('resize', throttle(handleResize, 100), { passive: true });

    // Initial call to set correct state on page load
    updateHeaderPosition();
}

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

// TYPOGRAPHY----------------------------------------------------
function createTypographySection(projectData) {
    const section = document.createElement('div');
    section.className = 'section';

    const verticalHeader = document.createElement('div');
    verticalHeader.className = 'vertical-header';
    verticalHeader.textContent = 'TYPOGRAPHY\nTypoGrApHy\ntYPOgraPhy';
    section.appendChild(verticalHeader);

    const content = document.createElement('div');
    content.className = 'typography-content';
    section.appendChild(content);  // Append content immediately

    // Load all fonts first
    loadFonts(projectData.typography);

    projectData.typography.forEach(font => {
        const fontCard = createFontCard(font);
        content.appendChild(fontCard);
    });

    return section;
}

function loadFonts(fonts) {
    const style = document.createElement('style');
    fonts.forEach(font => {
        style.textContent += `@import url('${font.url}');\n`;
    });
    document.head.appendChild(style);
}

function createFontCard(font) {
    const card = document.createElement('div');
    card.className = 'typography-card';

    const headerContainer = document.createElement('div');
    headerContainer.className = 'font-header';

    const fontNameLink = document.createElement('a');
    fontNameLink.href = `https://fonts.google.com/specimen/${font.name.replace(' ', '+')}`;
    fontNameLink.target = '_blank';
    fontNameLink.rel = 'noopener noreferrer';
    fontNameLink.className = 'font-name-link';
    
    fontNameLink.innerHTML = `
        ${font.name}&#8201;
        <svg class="external-link-icon">
            <use xlink:href="#external-link-icon"></use>
        </svg>
    `;

    headerContainer.appendChild(fontNameLink);
    headerContainer.style.fontFamily = font.fontFamily;
    card.appendChild(headerContainer);

    const decorativeLine = document.createElement('div');
    decorativeLine.className = 'decorative-line';
    decorativeLine.innerHTML = '<span></span>'; // This will be our centered decorative element
    card.appendChild(decorativeLine);

    const description = document.createElement('p');
    description.textContent = font.description;
    description.className = 'font-description';
    card.appendChild(description);

    const weightsContainer = document.createElement('div');
    weightsContainer.className = 'weights-container';

    const regularWeights = createWeightExamples(font, false);
    const italicWeights = createWeightExamples(font, true);

    weightsContainer.appendChild(regularWeights);
    weightsContainer.appendChild(italicWeights);
    card.appendChild(weightsContainer);

    return card;
}

function createWeightExamples(font, isItalic) {
    const container = document.createElement('div');
    container.className = isItalic ? 'italic-weights' : 'regular-weights';

    const alphabet = 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz';
    const weights = [100, 400, 700];

    weights.forEach((weight, index) => {
        const example = document.createElement('p');
        example.style.fontFamily = font.fontFamily;
        example.style.fontWeight = weight;
        example.style.fontStyle = isItalic ? 'italic' : 'normal';
        example.textContent = alphabet;
        example.style.opacity = 0.3 + (0.7 * (index / (weights.length - 1))); // Gradual increase in opacity
        container.appendChild(example);
    });

    return container;
}

// COLORS---------------------------------------------------
function createColorSection(colorSets) {
    const section = document.createElement('div');
    section.className = 'section';

    const header = document.createElement('div');
    header.className = 'vertical-header';
    header.textContent = 'COLOURS\nc0Lours\nCol0URS';
    section.appendChild(header);

    const content = document.createElement('div');
    content.className = 'color-palette-content';

    colorSets.forEach(set => {
        const colorSet = document.createElement('div');
        colorSet.className = 'color-set';

        const colorRectangles = document.createElement('div');
        colorRectangles.className = 'color-rectangles';

        set.palette.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            colorItem.style.backgroundColor = color;

            // Determine if the color is very dark or very light
            const brightness = getBrightness(color);
            if (brightness < 0.1) {  // Adjusted threshold for very dark
                colorItem.classList.add('very-dark');
            } else if (brightness > 0.9) {  // Adjusted threshold for very light
                colorItem.classList.add('very-light');
            }

            const colorLink = document.createElement('a');
            colorLink.href = `https://www.google.com/search?q=${encodeURIComponent(color)}`;
            colorLink.target = '_blank';
            colorLink.rel = 'noopener noreferrer';
            colorLink.className = 'color-link';

            const colorText = document.createElement('span');
            colorText.className = 'color-text';
            colorText.textContent = color;

            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'color-arrow';
            arrowSpan.innerHTML = '&nearr;'; // Unicode for northeast arrow

            colorText.appendChild(arrowSpan);
            colorLink.appendChild(colorText);
            colorItem.appendChild(colorLink);

            colorRectangles.appendChild(colorItem);
        });

        const description = document.createElement('div');
        description.className = 'color-description';
        description.textContent = set.description;

        colorSet.appendChild(colorRectangles);
        colorSet.appendChild(description);
        content.appendChild(colorSet);
    });

    section.appendChild(content);
    return section;
}

// TECH STACK---------------------------------------------------
function createTechStackSection(techStack) {
    const section = document.createElement('div');
    section.className = 'section';

    const header = document.createElement('div');
    header.className = 'vertical-header';
    header.textContent = 'TECHSTACK\nTechStaCk\nTecHStAck';
    section.appendChild(header);

    const content = document.createElement('div');
    content.className = 'tech-stack-content';

    for (const [category, technologies] of Object.entries(techStack)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'tech-category';

        const categoryHeader = document.createElement('h2');
        categoryHeader.className = 'category-header';
        categoryHeader.textContent = category.toLowerCase();
        categoryDiv.appendChild(categoryHeader);

        const decorativeLine = document.createElement('div');
        decorativeLine.className = 'decorative-line';
        decorativeLine.innerHTML = '<span></span>'; // This will be our centered decorative element
        categoryDiv.appendChild(decorativeLine);

        const itemsList = document.createElement('ul');
        itemsList.className = 'tech-items-list';

        technologies.forEach(tech => {
            const listItem = document.createElement('li');
            listItem.textContent = tech.toUpperCase();
            itemsList.appendChild(listItem);
        });

        categoryDiv.appendChild(itemsList);
        content.appendChild(categoryDiv);
    }

    section.appendChild(content);
    return section;
}

function getBrightness(color) {
    // Remove any leading #
    color = color.replace('#', '');
    
    // Parse the color
    const r = parseInt(color.substr(0, 2), 16) / 255;
    const g = parseInt(color.substr(2, 2), 16) / 255;
    const b = parseInt(color.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    return luminance;
}

// FOOTER---------------------------------------------------
function createFooterSection(footerText) {
    const section = document.createElement('div');
    section.className = 'section footer-section';

    const footerContainer = document.createElement('div');
    footerContainer.className = 'footer-container';

    const footerTextElement = document.createElement('p');
    footerTextElement.className = 'footer-text';
    footerTextElement.textContent = footerText;
    footerContainer.appendChild(footerTextElement);

    const footerNameElement = document.createElement('p');
    footerNameElement.className = 'footer-name';
    footerNameElement.textContent = "Jaxen Anirban Dutta //";
    footerContainer.appendChild(footerNameElement);

    section.appendChild(footerContainer);
    return section;
}