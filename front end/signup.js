document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const courseInput = document.getElementById('course');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const formError = document.getElementById('form-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isFormValid = validateInputs();

        if (isFormValid) {
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                course: courseInput.value,
                password: passwordInput.value
            };

            try {
                const response = await fetch('http://localhost:5000/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (!response.ok) {
                    // Display server-side error message (e.g., "User already exists")
                    formError.innerText = data.msg || 'An unknown error occurred.';
                    throw new Error(data.msg || `HTTP error! status: ${response.status}`);
                }

                // Handle success
                console.log('Success:', data);
                alert(data.msg); // "Student registered successfully..."
                // Redirect to marks entry page, passing the new student ID
                window.location.href = `marks-entry.html?studentId=${data.studentId}`;

            } catch (error) {
                console.error('Submission error:', error);
                // The error message is already set in the `if (!response.ok)` block
                // for HTTP errors. This will catch network errors.
                if (!formError.innerText) {
                    formError.innerText = 'Could not connect to the server. Please try again later.';
                }
            }
        } else {
            console.log('Form has validation errors.');
            formError.innerText = ''; // Clear server errors if client validation fails
        }
    });

    const setError = (element, message) => {
        const errorDisplay = element.parentElement.parentElement.querySelector('.error-message');
        errorDisplay.innerText = message;
        element.classList.add('input-error');
    };

    const setSuccess = (element) => {
        const errorDisplay = element.parentElement.parentElement.querySelector('.error-message');
        errorDisplay.innerText = '';
        element.classList.remove('input-error');
    };

    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validateInputs = () => {
        let isValid = true;
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const courseValue = courseInput.value;
        const passwordValue = passwordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();

        // Clear previous server error
        formError.innerText = '';

        if (nameValue === '') {
            setError(nameInput, 'Full name is required');
            isValid = false;
        } else {
            setSuccess(nameInput);
        }

        if (emailValue === '') {
            setError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(emailInput, 'Provide a valid email address');
            isValid = false;
        } else {
            setSuccess(emailInput);
        }
        
        if (courseValue === '') {
            setError(courseInput, 'Please select a course');
            isValid = false;
        } else {
            setSuccess(courseInput);
        }

        if (passwordValue === '') {
            setError(passwordInput, 'Password is required');
            isValid = false;
        } else if (passwordValue.length < 8) {
            setError(passwordInput, 'Password must be at least 8 characters.');
            isValid = false;
        } else {
            setSuccess(passwordInput);
        }

        if (confirmPasswordValue === '') {
            setError(confirmPasswordInput, 'Please confirm your password');
            isValid = false;
        } else if (confirmPasswordValue !== passwordValue) {
            setError(confirmPasswordInput, "Passwords don't match");
            isValid = false;
        } else {
            setSuccess(confirmPasswordInput);
        }

        return isValid;
    };
});