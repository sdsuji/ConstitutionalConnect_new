document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id'); // Get the module ID from URL

    // Ensure the user is logged in and has a valid token
    const userToken = localStorage.getItem('userToken'); // Retrieve the token from localStorage
    if (!userToken) {
        alert('You must be logged in to submit the quiz.');
        return; // Exit the function if no token is available
    }

    if (moduleId) {
        // Fetch the module data from the backend
        fetch(`/api/modules/${moduleId}`)
            .then(response => response.json())
            .then(module => {
                // Set the quiz title
                document.getElementById('quiz-title').textContent = `Quiz for ${module.title}`;

                // Display the quiz questions
                const quizContainer = document.getElementById('quiz-container');
                module.quiz.forEach((question, index) => {
                    const questionDiv = document.createElement('div');
                    questionDiv.classList.add('quiz-question');

                    const questionText = document.createElement('p');
                    questionText.textContent = question.question;
                    questionDiv.appendChild(questionText);

                    question.options.forEach((option, i) => {
                        const optionLabel = document.createElement('label');
                        optionLabel.innerHTML = ` 
                            <input type="radio" name="question-${index}" value="${i}" ${module.userResponses && module.userResponses[index] && module.userResponses[index].userAnswer === option ? 'checked' : ''} ${module.userResponses ? 'disabled' : ''}>
                            ${option}
                        `;
                        if (module.userResponses && module.userResponses[index]) {
                            if (i === question.correctAnswer) {
                                optionLabel.innerHTML += " (Correct)";
                            }
                            if (module.userResponses[index].userAnswer === option && i !== question.correctAnswer) {
                                optionLabel.innerHTML += " (Your Answer)";
                            }
                        }
                        questionDiv.appendChild(optionLabel);
                    });

                    quizContainer.appendChild(questionDiv);
                });

                // If the user has already submitted, display the score
                if (module.userResponses) {
                    const scoreDisplay = document.createElement('div');
                    scoreDisplay.textContent = `Your score: ${module.score} / ${module.quiz.length}`;
                    quizContainer.appendChild(scoreDisplay);
                }

                // If the user has not taken the quiz yet, add the submit button
                if (!module.userResponses) {
                    const submitButton = document.createElement('button');
                    submitButton.textContent = 'Submit Quiz';
                    submitButton.id = 'submit-quiz';
                    quizContainer.appendChild(submitButton);

                    submitButton.addEventListener('click', () => {
                        console.log('Submit button clicked!'); // Debugging step

                        let score = 0;
                        const userResponses = [];

                        // Calculate score based on selected answers
                        module.quiz.forEach((question, index) => {
                            const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
                            if (selectedOption) {
                                const selectedValue = parseInt(selectedOption.value);
                                userResponses.push({
                                    question: question.question,
                                    userAnswer: question.options[selectedValue],
                                    correctAnswer: question.options[question.correctAnswer],
                                });
                                if (selectedValue === question.correctAnswer) {
                                    score++;
                                }
                            }
                        });

                        // Ensure the user has answered all questions before submitting
                        if (userResponses.length !== module.quiz.length) {
                            alert('Please answer all the questions before submitting!');
                            return;
                        }

                        // Show the score in an alert box before submitting
                        alert(`You scored ${score} out of ${module.quiz.length}`);

                        // Show loading indicator while submitting
                        const loadingIndicator = document.createElement('div');
                        loadingIndicator.textContent = 'Submitting...';
                        quizContainer.appendChild(loadingIndicator);

                        // Save score and user responses to the backend
                        fetch(`/api/userProgress/${moduleId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${userToken}`,
                            },
                            body: JSON.stringify({
                                score: score,
                                responses: userResponses,
                            }),
                        })
                        .then(response => response.json())
                        .then(data => {
                            // Removed the "Quiz submitted!" alert
                            // Display score on the page
                            const scoreElement = document.createElement('div');
                            scoreElement.textContent = `Your score: ${data.score}`;
                            quizContainer.appendChild(scoreElement); // Add score to DOM

                            // Disable the submit button to prevent further attempts
                            submitButton.disabled = true;

                            // Optionally, reload the page to show responses (but you could also dynamically update the page)
                            if (moduleId) {
                                window.location.assign(`/pdf.html?id=${moduleId}`);
                            } else {
                                console.error("Module ID is missing.");
                            } // Redirect to pdf.html after submission
                        })
                        .catch(error => {
                            console.error('Error submitting quiz:', error);
                            alert('An error occurred while submitting the quiz.');
                        });
                    });
                }
            })
            .catch(error => console.error('Error loading module details:', error));
    } else {
        console.error('Module ID not found in URL');
    }
});
