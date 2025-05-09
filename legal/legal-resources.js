/**
 * AU Legal Database Resources
 * This file contains the implementation of the three improvements:
 * 1. PreProcessing Legal Resources
 * 2. Citing Relevant Case-Law
 * 3. Identifying Issues With Best Practices
 */

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.legal-container')) {
        initLegalSourceSelector();
        initPreProcessingTools();
        initCitationTools();
        initBestPracticesTools();
    }
});

/**
 * Legal Source Selector Component
 * Allows users to browse and select from various Victorian legal sources
 */
function initLegalSourceSelector() {
    const sourceSelector = document.querySelector('.legal-source-selector');
    if (!sourceSelector) return;

    const sourceItems = document.querySelectorAll('.legal-source-item a');
    sourceItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            sourceItems.forEach(i => i.classList.remove('active'));
            
            this.classList.add('active');
            
            const sourceId = this.getAttribute('data-source-id');
            loadLegalSourceContent(sourceId);
        });
    });
}

/**
 * Load Legal Source Content
 * Fetches and displays content for the selected legal source
 * @param {string} sourceId - ID of the selected legal source
 */
function loadLegalSourceContent(sourceId) {
    console.log(`Loading content for source ID: ${sourceId}`);
    
    
    const contentContainer = document.querySelector('.legal-content-container');
    if (!contentContainer) return;
    
    contentContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    setTimeout(() => {
        const content = getLegalSourceSampleContent(sourceId);
        
        contentContainer.innerHTML = content;
        
        initLegalContentInteractions();
    }, 800);
}

/**
 * Get Sample Content for Legal Sources
 * Returns HTML content for the selected source ID
 * @param {string} sourceId - ID of the selected legal source
 * @returns {string} HTML content
 */
function getLegalSourceSampleContent(sourceId) {
    const contentMap = {
        'crimes-act': `
            <div class="legal-content">
                <h2>Crimes Act 1958 (Vic)</h2>
                <div class="legal-content-meta">
                    <span>Last Updated: March 1, 2023</span>
                    <span>Version: 294</span>
                </div>
                <div class="legal-content-body">
                    <p>The Crimes Act 1958 is a key piece of Victorian legislation that defines criminal offenses and their penalties.</p>
                    <h3>Key Sections</h3>
                    <ul>
                        <li><strong>Section 3</strong> - Definitions</li>
                        <li><strong>Section 15A-26</strong> - Homicide offenses</li>
                        <li><strong>Section 31-38</strong> - Assault offenses</li>
                        <li><strong>Section 74-80</strong> - Sexual offenses</li>
                        <li><strong>Section 81-82</strong> - Child abuse material offenses</li>
                    </ul>
                </div>
            </div>
        `,
        'summary-offences': `
            <div class="legal-content">
                <h2>Summary Offences Act 1966 (Vic)</h2>
                <div class="legal-content-meta">
                    <span>Last Updated: January 15, 2023</span>
                    <span>Version: 142</span>
                </div>
                <div class="legal-content-body">
                    <p>The Summary Offences Act 1966 covers minor offenses that are typically heard in the Magistrates' Court.</p>
                    <h3>Key Sections</h3>
                    <ul>
                        <li><strong>Section 4-8</strong> - Public order offenses</li>
                        <li><strong>Section 9-18</strong> - Property damage offenses</li>
                        <li><strong>Section 23-30</strong> - Weapons and firearms offenses</li>
                    </ul>
                </div>
            </div>
        `,
        'sentencing-act': `
            <div class="legal-content">
                <h2>Sentencing Act 1991 (Vic)</h2>
                <div class="legal-content-meta">
                    <span>Last Updated: February 28, 2023</span>
                    <span>Version: 198</span>
                </div>
                <div class="legal-content-body">
                    <p>The Sentencing Act 1991 provides the framework for sentencing offenders in Victorian courts.</p>
                    <h3>Key Sections</h3>
                    <ul>
                        <li><strong>Section 5</strong> - Sentencing guidelines</li>
                        <li><strong>Section 7-27</strong> - Available sentencing options</li>
                        <li><strong>Section 32-35A</strong> - Custodial orders</li>
                        <li><strong>Section 36-48Q</strong> - Community correction orders</li>
                    </ul>
                </div>
            </div>
        `,
        'default': `
            <div class="legal-content">
                <h2>Victorian Legal Resources</h2>
                <p>Select a legal source from the menu to view its content.</p>
            </div>
        `
    };
    
    return contentMap[sourceId] || contentMap['default'];
}

/**
 * Initialize interactions for loaded legal content
 */
function initLegalContentInteractions() {
    console.log('Initializing legal content interactions');
}

/**
 * IMPROVEMENT 1: PreProcessing Legal Resources
 * Tools for preprocessing legal documents for analysis
 */
function initPreProcessingTools() {
    const preprocessingForm = document.querySelector('.preprocessing-form');
    if (!preprocessingForm) return;
    
    preprocessingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(preprocessingForm);
        const documentType = formData.get('document-type');
        const documentText = formData.get('document-text');
        
        if (!documentText) {
            showNotification('Please enter document text', 'error');
            return;
        }
        
        const resultsContainer = document.querySelector('.preprocessing-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
        }
        
        setTimeout(() => {
            const processedText = preprocessLegalDocument(documentText, documentType);
            
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <h3>Processed Document</h3>
                    <div class="processed-document">
                        ${processedText}
                    </div>
                    <div class="preprocessing-actions">
                        <button class="btn-legal btn-legal-primary" onclick="downloadProcessedDocument()">Download</button>
                        <button class="btn-legal btn-legal-secondary" onclick="copyToClipboard('.processed-document')">Copy to Clipboard</button>
                    </div>
                `;
            }
            
            showNotification('Document processed successfully', 'success');
        }, 1500);
    });
}

/**
 * Preprocess Legal Document
 * Processes legal text based on document type
 * @param {string} text - Raw document text
 * @param {string} type - Document type
 * @returns {string} Processed HTML
 */
function preprocessLegalDocument(text, type) {
    
    let processed = text.split('\n\n').map(para => {
        if (para.trim() === '') return '';
        return `<p>${para.trim()}</p>`;
    }).join('');
    
    processed = processed.replace(/Section (\d+[A-Z]?(?:-\d+[A-Z]?)?)\s*[:–-]\s*([^\n]+)/g, 
        '<h4 class="section-heading">Section $1: $2</h4>');
    
    processed = processed.replace(/\b([A-Z][a-z]+ v [A-Z][a-z]+)\b \[?(\d{4})\]? ([A-Z]+) (\d+)/g, 
        '<span class="case-citation">$1 [$2] $3 $4</span>');
    
    processed = processed.replace(/\b([A-Za-z\s]+Act\s+\d{4})\b(\s+\(Vic\))?/g, 
        '<span class="statute-citation">$1$2</span>');
    
    switch (type) {
        case 'case-law':
            processed = `<div class="processed-case-law">${processed}</div>`;
            break;
        case 'legislation':
            processed = `<div class="processed-legislation">${processed}</div>`;
            break;
        case 'submission':
            processed = `<div class="processed-submission">${processed}</div>`;
            break;
        default:
            processed = `<div class="processed-document">${processed}</div>`;
    }
    
    return processed;
}

/**
 * Download Processed Document
 * Creates and downloads a file with the processed document
 */
function downloadProcessedDocument() {
    const processedContent = document.querySelector('.processed-document').innerHTML;
    const blob = new Blob([processedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed-legal-document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Copy to Clipboard
 * Copies the content of the specified selector to clipboard
 * @param {string} selector - CSS selector for the element to copy
 */
function copyToClipboard(selector) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const text = element.innerText;
    
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Copied to clipboard', 'success');
    } catch (err) {
        showNotification('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textarea);
}

/**
 * IMPROVEMENT 2: Citing Relevant Case-Law
 * Tools for finding and citing relevant case law
 */
function initCitationTools() {
    const citationSearch = document.querySelector('.citation-search form');
    if (!citationSearch) return;
    
    citationSearch.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(citationSearch);
        const query = formData.get('citation-query');
        const jurisdiction = formData.get('jurisdiction');
        
        if (!query) {
            showNotification('Please enter a search query', 'error');
            return;
        }
        
        const resultsContainer = document.querySelector('.citation-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
        }
        
        setTimeout(() => {
            const results = searchCaseLaw(query, jurisdiction);
            
            if (resultsContainer) {
                if (results.length === 0) {
                    resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
                } else {
                    resultsContainer.innerHTML = results.map(result => `
                        <div class="citation-item" data-id="${result.id}">
                            <div class="citation-title">${result.title}</div>
                            <div class="citation-meta">
                                <span>${result.court}</span>
                                <span>${result.year}</span>
                                <span>${result.citation}</span>
                            </div>
                            <div class="citation-content">${result.excerpt}</div>
                            <div class="citation-actions">
                                <button class="btn-cite" onclick="citeCaseLaw('${result.id}')">Cite</button>
                                <button class="btn-save" onclick="saveCaseLaw('${result.id}')">Save</button>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }, 1500);
    });
}

/**
 * Search Case Law
 * Searches for relevant case law based on query and jurisdiction
 * @param {string} query - Search query
 * @param {string} jurisdiction - Jurisdiction filter
 * @returns {Array} Search results
 */
function searchCaseLaw(query, jurisdiction) {
    
    const allResults = [
        {
            id: 'case1',
            title: 'Smith v Jones',
            court: 'Supreme Court of Victoria',
            year: '2022',
            citation: '[2022] VSC 123',
            excerpt: 'The Court held that in cases of negligence, the plaintiff must establish that the defendant owed a duty of care...'
        },
        {
            id: 'case2',
            title: 'R v Brown',
            court: 'Court of Appeal, Victoria',
            year: '2021',
            citation: '[2021] VSCA 45',
            excerpt: 'In considering the elements of self-defense, the Court emphasized that the response must be proportionate...'
        },
        {
            id: 'case3',
            title: 'Wilson v State of Victoria',
            court: 'Supreme Court of Victoria',
            year: '2020',
            citation: '[2020] VSC 287',
            excerpt: 'The plaintiff\'s claim for false imprisonment was upheld, with the Court finding that the detention was unlawful...'
        },
        {
            id: 'case4',
            title: 'Green v Taylor',
            court: 'County Court of Victoria',
            year: '2022',
            citation: '[2022] VCC 78',
            excerpt: 'In this property dispute, the Court applied the principles established in Jones v Smith...'
        },
        {
            id: 'case5',
            title: 'Director of Public Prosecutions v Williams',
            court: 'Court of Appeal, Victoria',
            year: '2019',
            citation: '[2019] VSCA 219',
            excerpt: 'The Court clarified the application of Section 17 of the Crimes Act 1958 in cases involving threats...'
        }
    ];
    
    let filteredResults = allResults;
    if (jurisdiction !== 'all') {
        filteredResults = allResults.filter(result => {
            if (jurisdiction === 'vic' && result.court.includes('Victoria')) return true;
            if (jurisdiction === 'nsw' && result.court.includes('New South Wales')) return true;
            if (jurisdiction === 'qld' && result.court.includes('Queensland')) return true;
            if (jurisdiction === 'federal' && (result.court.includes('Federal') || result.court.includes('High Court'))) return true;
            return false;
        });
    }
    
    if (query) {
        const lowerQuery = query.toLowerCase();
        filteredResults = filteredResults.filter(result => {
            return result.title.toLowerCase().includes(lowerQuery) || 
                   result.excerpt.toLowerCase().includes(lowerQuery) ||
                   result.citation.toLowerCase().includes(lowerQuery);
        });
    }
    
    return filteredResults;
}

/**
 * Cite Case Law
 * Generates a citation for the selected case
 * @param {string} caseId - ID of the selected case
 */
function citeCaseLaw(caseId) {
    const caseElement = document.querySelector(`.citation-item[data-id="${caseId}"]`);
    if (!caseElement) return;
    
    const title = caseElement.querySelector('.citation-title').textContent;
    const citation = caseElement.querySelector('.citation-meta').textContent;
    
    const aglcCitation = `${title} ${citation.split('Citation:')[1].trim()}`;
    
    const modalHTML = `
        <div class="citation-modal">
            <div class="modal-header">
                <h3>Citation Formats</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="citation-format">
                    <h4>AGLC Format</h4>
                    <div class="citation-text">${aglcCitation}</div>
                    <button class="btn-legal btn-legal-secondary" onclick="copyToClipboard('.citation-text')">Copy</button>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container active';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    const closeButton = modalContainer.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
        });
    }
}

/**
 * Save Case Law
 * Saves the selected case to the user's saved items
 * @param {string} caseId - ID of the selected case
 */
function saveCaseLaw(caseId) {
    showNotification('Case saved to your library', 'success');
}

/**
 * IMPROVEMENT 3: Identifying Issues With Best Practices
 * Tools for identifying legal issues and best practices
 */
function initBestPracticesTools() {
    const bestPracticesContainer = document.querySelector('.best-practices-container');
    if (!bestPracticesContainer) return;
    
    loadBestPractices();
    
    const filterForm = document.querySelector('.best-practices-filter form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(filterForm);
            const category = formData.get('category');
            const severity = formData.get('severity');
            
            filterBestPractices(category, severity);
        });
    }
}

/**
 * Load Best Practices
 * Loads and displays legal best practices
 */
function loadBestPractices() {
    const bestPracticesList = document.querySelector('.best-practices-list');
    if (!bestPracticesList) return;
    
    bestPracticesList.innerHTML = '<div class="loading-spinner"></div>';
    
    setTimeout(() => {
        const bestPractices = getBestPracticesSampleData();
        
        bestPracticesList.innerHTML = bestPractices.map(practice => `
            <li class="best-practice-item" data-category="${practice.category}" data-severity="${practice.severity}">
                <div class="best-practice-header">
                    <div class="best-practice-title">${practice.title}</div>
                    <div class="best-practice-tag tag-${practice.severity}">${getSeverityLabel(practice.severity)}</div>
                </div>
                <div class="best-practice-content">${practice.content}</div>
                <div class="best-practice-references">
                    <h4>References</h4>
                    <ul>
                        ${practice.references.map(ref => `<li>${ref}</li>`).join('')}
                    </ul>
                </div>
            </li>
        `).join('');
    }, 1000);
}

/**
 * Get Best Practices Sample Data
 * Returns sample data for best practices
 * @returns {Array} Best practices data
 */
function getBestPracticesSampleData() {
    return [
        {
            id: 'bp1',
            title: 'Proper Citation of Victorian Legislation',
            category: 'citation',
            severity: 'recommended',
            content: 'When citing Victorian legislation, always include the full title of the Act, the year, and the jurisdiction in parentheses. For example, "Crimes Act 1958 (Vic)". For specific sections, include the section number after the Act citation.',
            references: [
                'Australian Guide to Legal Citation (4th ed, 2018) Rule 3.1',
                'Victorian Government Solicitor\'s Office Style Guide (2022)'
            ]
        },
        {
            id: 'bp2',
            title: 'Verification of Current Legislation',
            category: 'research',
            severity: 'critical',
            content: 'Always verify that you are referring to the current version of legislation. Victorian legislation is frequently amended, and relying on outdated provisions can lead to serious errors. Use the official Victorian Legislation website to check the current status of any Act or Regulation.',
            references: [
                'Victorian Legislation and Parliamentary Documents website',
                'Legal Profession Uniform Law Australian Solicitors\' Conduct Rules 2015, r 4.1.3'
            ]
        },
        {
            id: 'bp3',
            title: 'Proper Handling of Client Information',
            category: 'confidentiality',
            severity: 'critical',
            content: 'Client information must be kept confidential and secure. This includes both digital and physical documents. Implement appropriate security measures for electronic storage and ensure physical documents are properly secured when not in use.',
            references: [
                'Legal Profession Uniform Law Australian Solicitors\' Conduct Rules 2015, r 9',
                'Privacy Act 1988 (Cth)',
                'Privacy and Data Protection Act 2014 (Vic)'
            ]
        },
        {
            id: 'bp4',
            title: 'Checking for Relevant Practice Directions',
            category: 'procedure',
            severity: 'warning',
            content: 'Victorian courts frequently issue practice directions that modify procedural requirements. Always check for relevant practice directions before filing documents or appearing in court. Failure to comply with practice directions can result in procedural errors and delays.',
            references: [
                'Supreme Court of Victoria Practice Notes',
                'County Court of Victoria Practice Notes',
                'Magistrates\' Court of Victoria Practice Directions'
            ]
        },
        {
            id: 'bp5',
            title: 'Proper Format for Affidavits',
            category: 'documentation',
            severity: 'recommended',
            content: 'Affidavits filed in Victorian courts must comply with specific formatting requirements. This includes proper numbering of paragraphs, appropriate margins, and correct jurat wording. Different courts may have slightly different requirements.',
            references: [
                'Supreme Court (General Civil Procedure) Rules 2015 (Vic) O 43',
                'County Court Civil Procedure Rules 2018 (Vic) O 43',
                'Magistrates\' Court General Civil Procedure Rules 2020 (Vic) O 43'
            ]
        },
        {
            id: 'bp6',
            title: 'Compliance with Filing Deadlines',
            category: 'procedure',
            severity: 'critical',
            content: 'Court filing deadlines in Victoria are strictly enforced. Missing a deadline can have serious consequences, including dismissal of a case or entry of default judgment. Always calendar deadlines with appropriate reminders and consider potential delays in the filing process.',
            references: [
                'Supreme Court (General Civil Procedure) Rules 2015 (Vic)',
                'County Court Civil Procedure Rules 2018 (Vic)',
                'Magistrates\' Court General Civil Procedure Rules 2020 (Vic)'
            ]
        },
        {
            id: 'bp7',
            title: 'Proper Use of Expert Evidence',
            category: 'evidence',
            severity: 'warning',
            content: 'Expert evidence in Victorian courts must comply with specific rules. Experts must acknowledge their duty to the court, and their reports must include certain information. Failure to comply can result in the evidence being excluded.',
            references: [
                'Supreme Court (General Civil Procedure) Rules 2015 (Vic) O 44',
                'County Court Civil Procedure Rules 2018 (Vic) O 44',
                'Evidence Act 2008 (Vic) s 76-80'
            ]
        }
    ];
}

/**
 * Get Severity Label
 * Returns a human-readable label for severity levels
 * @param {string} severity - Severity code
 * @returns {string} Human-readable label
 */
function getSeverityLabel(severity) {
    switch (severity) {
        case 'recommended':
            return 'Recommended';
        case 'warning':
            return 'Warning';
        case 'critical':
            return 'Critical';
        default:
            return severity.charAt(0).toUpperCase() + severity.slice(1);
    }
}

/**
 * Filter Best Practices
 * Filters the displayed best practices based on category and severity
 * @param {string} category - Category filter
 * @param {string} severity - Severity filter
 */
function filterBestPractices(category, severity) {
    const bestPracticeItems = document.querySelectorAll('.best-practice-item');
    
    bestPracticeItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemSeverity = item.getAttribute('data-severity');
        
        const categoryMatch = category === 'all' || itemCategory === category;
        const severityMatch = severity === 'all' || itemSeverity === severity;
        
        if (categoryMatch && severityMatch) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Show Notification
 * Displays a notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    const container = document.querySelector('.notification-container');
    if (container) {
        container.appendChild(notification);
        
        const closeButton = notification.querySelector('.notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                container.removeChild(notification);
            });
        }
        
        setTimeout(() => {
            if (notification.parentNode === container) {
                container.removeChild(notification);
            }
        }, 5000);
    }
}
