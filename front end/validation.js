document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const isFormValid = validateInputs();

        if (isFormValid) {
            // In a real application, you would submit the form here.
            // For this example, we'll just log a success message.
            console.log('Form is valid and ready to be submitted.');
            alert('Account created successfully!');
            form.reset();
            // After resetting, clear all success states
            [firstName, lastName, email, password, confirmPassword].forEach(setSuccess);
            window.location.href = 'login.html';
        } else {
            console.log('Form has validation errors.');
        }
    });

    const setError = (element, message) => {
        const errorDisplay = element.parentElement.nextElementSibling;
        errorDisplay.innerText = message;
        element.classList.add('input-error');
    };

    const setSuccess = (element) => {
        const errorDisplay = element.parentElement.nextElementSibling;
        errorDisplay.innerText = '';
        element.classList.remove('input-error');
    };

    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validateInputs = () => {
        let isValid = true;
        const firstNameValue = firstName.value.trim();
        const lastNameValue = lastName.value.trim();
        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();

        if (firstNameValue === '') {
            setError(firstName, 'First name is required');
            isValid = false;
        } else {
            setSuccess(firstName);
        }

        if (lastNameValue === '') {
            setError(lastName, 'Last name is required');
            isValid = false;
        } else {
            setSuccess(lastName);
        }

        if (emailValue === '') {
            setError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(email, 'Provide a valid email address');
            isValid = false;
        } else {
            setSuccess(email);
        }

        if (passwordValue === '') {
            setError(password, 'Password is required');
            isValid = false;
        } else if (passwordValue.length < 8) {
            setError(password, 'Password must be at least 8 characters.');
            isValid = false;
        } else {
            setSuccess(password);
        }

        if (confirmPasswordValue === '') {
            setError(confirmPassword, 'Please confirm your password');
            isValid = false;
        } else if (confirmPasswordValue !== passwordValue) {
            setError(confirmPassword, "Passwords don't match");
            isValid = false;
        } else {
            setSuccess(confirmPassword);
        }

        return isValid;
    };
});