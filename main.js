document.addEventListener('DOMContentLoaded', function () {
    // Navigation handling
    const navLinks = document.querySelectorAll('.sidebar ul li a');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });

    // Profile creation form handling
    const profileForm = document.getElementById('profile-form');
    const profileSelector = document.getElementById('profile-selector');
    const transcriptProfileSelector = document.getElementById('transcript-profile-selector');
    const profiles = [];

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const profile = {
            name: document.getElementById('profile-name').value,
            age: document.getElementById('profile-age').value,
            dob: document.getElementById('profile-dob').value,
            form: document.getElementById('profile-form').value,
            gender: document.getElementById('profile-gender').value,
            email: document.getElementById('profile-email').value
        };

        profiles.push(profile);
        updateProfileSelectors();

        profileForm.reset();
    });

    function updateProfileSelectors() {
        profileSelector.innerHTML = '';
        transcriptProfileSelector.innerHTML = '';

        profiles.forEach((profile, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = profile.name;
            profileSelector.appendChild(option);

            const transcriptOption = option.cloneNode(true);
            transcriptProfileSelector.appendChild(transcriptOption);
        });
    }

    // Grade management handling
    const gradeForm = document.getElementById('grade-settings');
    const gradesContainer = document.getElementById('grades-container');
    const gradesData = {};

    gradeForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const selectedProfileIndex = profileSelector.value;
        const form = document.getElementById('grade-form').value;
        const term = document.getElementById('grade-term').value;
        const exam = document.getElementById('grade-exam').value;

        const key = `${selectedProfileIndex}-${form}-${term}-${exam}`;
        if (!gradesData[key]) {
            gradesData[key] = [];
        }

        renderGradeInputs(key);
    });

    function renderGradeInputs(key) {
        gradesContainer.innerHTML = '';

        const subjects = ['Math', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physcis', 'History', 'Geography', 'CRE', 'French', 'Music', 'Computer']; // Example subjects
        subjects.forEach(subject => {
            const label = document.createElement('label');
            label.textContent = subject;

            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = `${subject} Grade`;
            input.dataset.key = key;
            input.dataset.subject = subject;

            const div = document.createElement('div');
            div.appendChild(label);
            div.appendChild(input);

            gradesContainer.appendChild(div);
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Grades';
        saveButton.addEventListener('click', saveGrades);

        gradesContainer.appendChild(saveButton);
    }

    function saveGrades() {
        const inputs = gradesContainer.querySelectorAll('input');
        inputs.forEach(input => {
            const key = input.dataset.key;
            const subject = input.dataset.subject;
            const grade = input.value;

            if (!gradesData[key]) {
                gradesData[key] = {};
            }

            gradesData[key][subject] = grade;
        });

        console.log(gradesData); // For debugging purposes
    }

    // Transcript generation
    document.getElementById('generate-transcript').addEventListener('click', function () {
        const selectedProfileIndex = transcriptProfileSelector.value;
        if (selectedProfileIndex === '') return;

        const transcriptData = Object.keys(gradesData)
            .filter(key => key.startsWith(selectedProfileIndex))
            .map(key => ({
                key,
                grades: gradesData[key]
            }));

        // Display the transcript (this can be customized further)
        const transcriptContainer = document.createElement('div');
        transcriptContainer.innerHTML = `<h2>Transcript for ${profiles[selectedProfileIndex].name}</h2>`;
        
        transcriptData.forEach(data => {
            const [profileIndex, form, term, exam] = data.key.split('-');
            const gradesList = Object.entries(data.grades)
                .map(([subject, grade]) => `<li>${subject}: ${grade}</li>`)
                .join('');

            transcriptContainer.innerHTML += `
                <h3>Form ${form}, Term ${term}, Exam ${exam}</h3>
                <ul>${gradesList}</ul>
            `;
        });

        document.getElementById('transcript').appendChild(transcriptContainer);
    });

    // Clock and calendar display
    function updateClock() {
        const clock = document.getElementById('clock');
        const now = new Date();
        clock.textContent = now.toLocaleTimeString();
    }

    function updateCalendar() {
        const calendar = document.getElementById('calendar');
        const now = new Date();
        calendar.textContent = now.toLocaleDateString();
    }

    setInterval(updateClock, 1000);
    updateClock();
    updateCalendar();
});
