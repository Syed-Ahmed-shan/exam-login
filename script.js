document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Send login data to server
    const response = await fetch('/login/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        window.location.href = '/admin-page.html';
    } else {
        alert('Admin login failed.');
    }
});

document.getElementById('userLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    // Send login data to server
    const response = await fetch('/login/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        window.location.href = '/exam.html';
    } else {
        alert('User login failed.');
    }
});


document.addEventListener('DOMContentLoaded', async function() {
    const examId = 'exam123'; // Replace with actual exam ID
    const questionsContainer = document.getElementById('questionsContainer');

    // Fetch questions from the backend
    const response = await fetch(`/exam/${examId}/questions`);
    const questions = await response.json();

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${question.questionText}`;
        questionElement.appendChild(questionText);

        question.options.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${index}`;
            input.value = option;
            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            questionElement.appendChild(label);
            questionElement.appendChild(document.createElement('br'));
        });

        questionsContainer.appendChild(questionElement);
    });
});

document.getElementById('examForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const examId = 'exam-details'; // Replace with actual exam ID
    const answers = {};
    const formData = new FormData(this);

    formData.forEach((value, key) => {
        answers[key] = value;
    });

    // Submit answers to the backend
    const response = await fetch(`/exam/${examId}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
    });

    if (response.ok) {
        alert('Exam submitted successfully!');
        window.location.href = '/exam-results.html';
    } else {
        alert('Failed to submit the exam.');
    }
});
