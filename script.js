
// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Form Management
const resumeForm = document.getElementById('resume-form');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const resumePreview = document.getElementById('resume-preview');

// Add Experience Button
document.getElementById('add-experience').addEventListener('click', () => {
    const container = document.getElementById('experience-container');
    const newExperience = createExperienceItem();
    container.appendChild(newExperience);
});

// Add Education Button
document.getElementById('add-education').addEventListener('click', () => {
    const container = document.getElementById('education-container');
    const newEducation = createEducationItem();
    container.appendChild(newEducation);
});

function createExperienceItem() {
    const div = document.createElement('div');
    div.className = 'experience-item';
    div.innerHTML = `
        <div class="input-row">
            <input type="text" class="job-title" placeholder="Job Title">
            <input type="text" class="company" placeholder="Company Name">
        </div>
        <div class="input-row">
            <input type="text" class="start-date" placeholder="Start Date">
            <input type="text" class="end-date" placeholder="End Date">
        </div>
        <textarea class="job-description" placeholder="Job responsibilities and achievements..."></textarea>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;
    return div;
}

function createEducationItem() {
    const div = document.createElement('div');
    div.className = 'education-item';
    div.innerHTML = `
        <div class="input-row">
            <input type="text" class="degree" placeholder="Degree">
            <input type="text" class="school" placeholder="School/University">
        </div>
        <div class="input-row">
            <input type="text" class="graduation-year" placeholder="Graduation Year">
            <input type="text" class="gpa" placeholder="GPA (Optional)">
        </div>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;
    return div;
}

// Template Selection
const templateOptions = document.querySelectorAll('.template-option');
let selectedTemplate = 'modern';

templateOptions.forEach(option => {
    option.addEventListener('click', () => {
        templateOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        selectedTemplate = option.dataset.template;
        updatePreview();
    });
});

// Form Submission
resumeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generateResume();
});

// Real-time Preview Updates
const formInputs = resumeForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('input', debounce(updatePreview, 300));
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function generateResume() {
    generateBtn.classList.add('loading');
    
    setTimeout(() => {
        updatePreview();
        generateBtn.classList.remove('loading');
        downloadBtn.disabled = false;
        
        // Smooth scroll to preview on mobile
        if (window.innerWidth <= 1024) {
            document.querySelector('.preview-section').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, 1000);
}

function updatePreview() {
    const formData = collectFormData();
    
    if (!formData.fullName) {
        resumePreview.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-file-alt"></i>
                <p>Fill out the form to see your resume preview</p>
            </div>
        `;
        return;
    }
    
    let template;
    switch (selectedTemplate) {
        case 'classic':
            template = generateClassicTemplate(formData);
            break;
        case 'creative':
            template = generateCreativeTemplate(formData);
            break;
        default:
            template = generateModernTemplate(formData);
    }
    
    resumePreview.innerHTML = template;
}

function collectFormData() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        linkedin: document.getElementById('linkedin').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        experience: [],
        education: []
    };
    
    // Collect Experience
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        const exp = {
            jobTitle: item.querySelector('.job-title').value,
            company: item.querySelector('.company').value,
            startDate: item.querySelector('.start-date').value,
            endDate: item.querySelector('.end-date').value,
            description: item.querySelector('.job-description').value
        };
        if (exp.jobTitle || exp.company) {
            formData.experience.push(exp);
        }
    });
    
    // Collect Education
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        const edu = {
            degree: item.querySelector('.degree').value,
            school: item.querySelector('.school').value,
            graduationYear: item.querySelector('.graduation-year').value,
            gpa: item.querySelector('.gpa').value
        };
        if (edu.degree || edu.school) {
            formData.education.push(edu);
        }
    });
    
    return formData;
}

function generateModernTemplate(data) {
    const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    
    return `
        <div class="resume-template modern-template">
            <div class="resume-header">
                <h1>${data.fullName}</h1>
                <div class="contact-info">
                    ${data.email ? `<span><i class="fas fa-envelope"></i> ${data.email}</span>` : ''}
                    ${data.phone ? `<span><i class="fas fa-phone"></i> ${data.phone}</span>` : ''}
                    ${data.location ? `<span><i class="fas fa-map-marker-alt"></i> ${data.location}</span>` : ''}
                    ${data.linkedin ? `<span><i class="fab fa-linkedin"></i> LinkedIn</span>` : ''}
                    ${data.website ? `<span><i class="fas fa-globe"></i> Website</span>` : ''}
                </div>
            </div>
            
            ${data.summary ? `
                <div class="section">
                    <h2>Professional Summary</h2>
                    <p>${data.summary}</p>
                </div>
            ` : ''}
            
            ${data.experience.length > 0 ? `
                <div class="section">
                    <h2>Work Experience</h2>
                    ${data.experience.map(exp => `
                        <div class="experience-entry">
                            <h3>${exp.jobTitle}</h3>
                            <div class="company">${exp.company}</div>
                            <div class="date-range">${exp.startDate} - ${exp.endDate}</div>
                            <p>${exp.description}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${data.education.length > 0 ? `
                <div class="section">
                    <h2>Education</h2>
                    ${data.education.map(edu => `
                        <div class="education-entry">
                            <h3>${edu.degree}</h3>
                            <div class="school">${edu.school}</div>
                            <div class="date-range">${edu.graduationYear} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${skillsArray.length > 0 ? `
                <div class="section">
                    <h2>Skills</h2>
                    <div class="skills-list">
                        ${skillsArray.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function generateClassicTemplate(data) {
    const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    
    return `
        <div class="resume-template classic-template">
            <div class="resume-header">
                <h1>${data.fullName}</h1>
                <div class="contact-info">
                    ${data.email ? `${data.email}` : ''} 
                    ${data.phone ? `| ${data.phone}` : ''} 
                    ${data.location ? `| ${data.location}` : ''}
                    ${data.linkedin ? `| LinkedIn Profile` : ''}
                    ${data.website ? `| ${data.website}` : ''}
                </div>
            </div>
            
            ${data.summary ? `
                <div class="section">
                    <h2>Objective</h2>
                    <p>${data.summary}</p>
                </div>
            ` : ''}
            
            ${data.experience.length > 0 ? `
                <div class="section">
                    <h2>Professional Experience</h2>
                    ${data.experience.map(exp => `
                        <div class="experience-entry">
                            <h3>${exp.jobTitle} - ${exp.company}</h3>
                            <div class="date-range">${exp.startDate} to ${exp.endDate}</div>
                            <p>${exp.description}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${data.education.length > 0 ? `
                <div class="section">
                    <h2>Education</h2>
                    ${data.education.map(edu => `
                        <div class="education-entry">
                            <h3>${edu.degree} - ${edu.school}</h3>
                            <div class="date-range">${edu.graduationYear} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${skillsArray.length > 0 ? `
                <div class="section">
                    <h2>Core Competencies</h2>
                    <p>${skillsArray.join(' • ')}</p>
                </div>
            ` : ''}
        </div>
    `;
}

function generateCreativeTemplate(data) {
    const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    
    return `
        <div class="resume-template creative-template">
            <div class="sidebar">
                <h1>${data.fullName}</h1>
                
                <h2>Contact</h2>
                <div class="contact-section">
                    ${data.email ? `<p><i class="fas fa-envelope"></i> ${data.email}</p>` : ''}
                    ${data.phone ? `<p><i class="fas fa-phone"></i> ${data.phone}</p>` : ''}
                    ${data.location ? `<p><i class="fas fa-map-marker-alt"></i> ${data.location}</p>` : ''}
                    ${data.linkedin ? `<p><i class="fab fa-linkedin"></i> LinkedIn</p>` : ''}
                    ${data.website ? `<p><i class="fas fa-globe"></i> Website</p>` : ''}
                </div>
                
                ${skillsArray.length > 0 ? `
                    <h2>Skills</h2>
                    <div class="skills-section">
                        ${skillsArray.map(skill => `<p>• ${skill}</p>`).join('')}
                    </div>
                ` : ''}
                
                ${data.education.length > 0 ? `
                    <h2>Education</h2>
                    ${data.education.map(edu => `
                        <div class="education-entry">
                            <h4>${edu.degree}</h4>
                            <p>${edu.school}</p>
                            <p>${edu.graduationYear} ${edu.gpa ? `| ${edu.gpa}` : ''}</p>
                        </div>
                    `).join('')}
                ` : ''}
            </div>
            
            <div class="main-content">
                ${data.summary ? `
                    <div class="section">
                        <h2>About Me</h2>
                        <p>${data.summary}</p>
                    </div>
                ` : ''}
                
                ${data.experience.length > 0 ? `
                    <div class="section">
                        <h2>Experience</h2>
                        ${data.experience.map(exp => `
                            <div class="experience-entry">
                                <h3>${exp.jobTitle}</h3>
                                <div class="company">${exp.company}</div>
                                <div class="date-range">${exp.startDate} - ${exp.endDate}</div>
                                <p>${exp.description}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// PDF Download Functionality
downloadBtn.addEventListener('click', () => {
    const element = resumePreview;
    const opt = {
        margin: 0.5,
        filename: `${document.getElementById('fullName').value || 'resume'}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    downloadBtn.disabled = true;
    
    html2pdf().set(opt).from(element).save().then(() => {
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
        downloadBtn.disabled = false;
    });
});

// Add CSS for remove buttons
const style = document.createElement('style');
style.textContent = `
    .remove-btn {
        background: var(--danger-color);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        cursor: pointer;
        margin-top: 0.5rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        width: fit-content;
    }
    
    .remove-btn:hover {
        background: #dc2626;
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);

// Initialize preview
updatePreview();
