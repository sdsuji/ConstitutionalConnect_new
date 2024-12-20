document.addEventListener('DOMContentLoaded', () => {
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionsContainer = document.getElementById('questionsContainer');
    const moduleForm = document.getElementById('moduleForm');

    // Validation Functions
    const validateField = (field, errorSpanId, errorMessage) => {
        const errorSpan = document.getElementById(errorSpanId);
        if (!field.value.trim()) {
            errorSpan.textContent = errorMessage;
            field.classList.add("error-border");
            return false;
        } else {
            errorSpan.textContent = "";
            field.classList.remove("error-border");
            return true;
        }
    };

    const validateFileField = (field, errorSpanId, allowedTypes, errorMessage) => {
        const errorSpan = document.getElementById(errorSpanId);
        if (field.files.length === 0) {
            errorSpan.textContent = errorMessage;
            field.classList.add("error-border");
            return false;
        }

        const file = field.files[0];
        const fileType = file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileType)) {
            errorSpan.textContent = errorMessage;
            field.classList.add("error-border");
            return false;
        } else {
            errorSpan.textContent = "";
            field.classList.remove("error-border");
            return true;
        }
    };

    const validateQuestions = () => {
        const questionBlocks = document.querySelectorAll('.question-block');
        const errorSpan = document.getElementById('nameError');

        if (questionBlocks.length < 5) {
            errorSpan.textContent = "At least 5 questions are required.";
            return false;
        }

        for (let block of questionBlocks) {
            const question = block.querySelector('.question');
            const options = block.querySelectorAll('.option');
            const correctOption = block.querySelector('.correct-option');

            if (!question.value.trim()) {
                errorSpan.textContent = "All questions must have text.";
                question.focus();
                return false;
            }

            for (let option of options) {
                if (!option.value.trim()) {
                    errorSpan.textContent = "All options must have text.";
                    option.focus();
                    return false;
                }
            }

            if (
                !correctOption.value.trim() ||
                isNaN(correctOption.value) ||
                correctOption.value < 1 ||
                correctOption.value > 4
            ) {
                errorSpan.textContent =
                    "Each question must have a valid correct option (1-4).";
                correctOption.focus();
                return false;
            }
        }

        errorSpan.textContent = "";
        return true;
    };

    // Add Question Functionality
    addQuestionBtn.addEventListener('click', () => {
        // Create a new question block
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.innerHTML = `
            <div class="form-group">
                <label>Question:</label>
                <input type="text" class="form-control question" placeholder="Enter question" required>
            </div>
            <div class="form-group">
                <label>Option 1:</label>
                <input type="text" class="form-control option" placeholder="Enter option 1" required>
            </div>
            <div class="form-group">
                <label>Option 2:</label>
                <input type="text" class="form-control option" placeholder="Enter option 2" required>
            </div>
            <div class="form-group">
                <label>Option 3:</label>
                <input type="text" class="form-control option" placeholder="Enter option 3" required>
            </div>
            <div class="form-group">
                <label>Option 4:</label>
                <input type="text" class="form-control option" placeholder="Enter option 4" required>
            </div>
            <div class="form-group">
                <label>Correct Option (1-4):</label>
                <input type="number" class="form-control correct-option" min="1" max="4" required>
            </div>
            <button class="btn btn-danger remove-question-btn">Remove Question</button>
        `;

        // Append the question block to the container
        questionsContainer.appendChild(questionBlock);

        // Add an event listener for the remove button
        questionBlock.querySelector('.remove-question-btn').addEventListener('click', () => {
            questionBlock.remove();
        });
    });

    // Real-time Validation
    moduleForm.addEventListener('input', (e) => {
        const { id } = e.target;
        if (id === 'moduleTitle') {
            validateField(e.target, 'titleError', 'Module title is required.');
        } else if (id === 'moduleDescription') {
            validateField(e.target, 'descriptionError', 'Module description is required.');
        } else if (id === 'moduleImage') {
            validateFileField(
                e.target,
                'imageError',
                ['jpg', 'jpeg', 'png', 'gif'],
                'Only image files (jpg, jpeg, png, gif) are allowed.'
            );
        } else if (id === 'moduleVideo') {
            validateFileField(
                e.target,
                'videoError',
                ['mp4', 'avi', 'mov'],
                'Only video files (mp4, avi, mov) are allowed.'
            );
        } else if (id === 'modulePdf') {
            validateFileField(
                e.target,
                'pdfError',
                ['pdf'],
                'Only PDF files are allowed.'
            );
        }
    });

    // Handle form submission
    moduleForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from submitting

        let isValid = true;

        isValid &= validateField(
            document.getElementById('moduleTitle'),
            'titleError',
            'Module title is required.'
        );

        isValid &= validateField(
            document.getElementById('moduleDescription'),
            'descriptionError',
            'Module description is required.'
        );

        isValid &= validateFileField(
            document.getElementById('moduleImage'),
            'imageError',
            ['jpg', 'jpeg', 'png', 'gif'],
            'Only image files (jpg, jpeg, png, gif) are allowed.'
        );

        isValid &= validateFileField(
            document.getElementById('moduleVideo'),
            'videoError',
            ['mp4', 'avi', 'mov'],
            'Only video files (mp4, avi, mov) are allowed.'
        );

        isValid &= validateFileField(
            document.getElementById('modulePdf'),
            'pdfError',
            ['pdf'],
            'Only PDF files are allowed.'
        );

        isValid &= validateQuestions();

        if (isValid) {
            // Prepare quiz questions
            const title = document.getElementById('moduleTitle').value;
            const description = document.getElementById('moduleDescription').value;
            const image = document.getElementById('moduleImage').files[0];
            const video = document.getElementById('moduleVideo').files[0];
            const pdf = document.getElementById('modulePdf').files[0];

            const questions = [];
            const questionBlocks = document.querySelectorAll('.question-block');
            questionBlocks.forEach(block => {
                const questionText = block.querySelector('.question').value;
                const options = [];
                block.querySelectorAll('.option').forEach(option => {
                    options.push(option.value);
                });
                const correctOption = block.querySelector('.correct-option').value;

                questions.push({
                    question: questionText,
                    options: options,
                    correctAnswer: correctOption - 1, // Convert to zero-based index
                });
            });

            // Prepare FormData to send the files along with the other data
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('image', image);
            formData.append('video', video);
            formData.append('pdf', pdf);
            formData.append('quiz', JSON.stringify(questions));

            // Send data to the server
            fetch('/api/admin/addModule', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    alert('Module added successfully');
                    moduleForm.reset();
                    questionsContainer.innerHTML = ''; 
                })
                .catch(error => {
                    alert('Failed to add module');
                    console.error(error);
                });
        }
    });
});

