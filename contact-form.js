/**
 * Ameriline Pharmaceutical SRL - Contact Form Handler
 * Handles the contact form submission via AJAX for pharmaceutical inquiries
 */

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

/**
 * Initialize contact form with validation and AJAX submission
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Add honeypot field for anti-spam (invisible to users)
        const honeypotField = document.createElement('input');
        honeypotField.type = 'text';
        honeypotField.name = 'honeypot';
        honeypotField.id = 'honeypot';
        honeypotField.style.display = 'none';
        honeypotField.setAttribute('tabindex', '-1');
        honeypotField.setAttribute('autocomplete', 'off');
        contactForm.appendChild(honeypotField);
        
        // Add pharmaceutical-specific validation
        addPharmaceuticalValidation(contactForm);
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            if (validateForm(contactForm)) {
                // Show loading indicator
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando consulta...';
                
                // Prepare form data with pharmaceutical context
                const formData = new FormData(contactForm);
                formData.append('form_type', 'pharmaceutical_inquiry');
                formData.append('company_name', 'Ameriline Pharmaceutical SRL');
                
                // Submit form via AJAX
                fetch('process-form.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la conexión con el servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    // Restore button
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    
                    if (data.status === 'success') {
                        // Success message
                        showFormMessage(contactForm, true, data.message || 'Consulta enviada exitosamente. Nos pondremos en contacto contigo pronto para atender tus necesidades farmacéuticas.');
                        
                        // Redirect to thank you page after brief delay
                        setTimeout(() => {
                            window.location.href = 'thank-you.html';
                        }, 2000);
                        
                        // Track successful form submission (if analytics available)
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'form_submit', {
                                'event_category': 'engagement',
                                'event_label': 'pharmaceutical_inquiry'
                            });
                        }
                    } else {
                        // Server error
                        showFormMessage(contactForm, false, data.message || 'Hubo un problema al enviar tu consulta. Por favor intenta nuevamente.');
                        
                        // Show specific errors if available
                        if (data.errors && data.errors.length > 0) {
                            const errorList = document.createElement('ul');
                            errorList.className = 'error-list';
                            
                            data.errors.forEach(error => {
                                const errorItem = document.createElement('li');
                                errorItem.textContent = error;
                                errorList.appendChild(errorItem);
                            });
                            
                            const messageContainer = contactForm.querySelector('.form-message');
                            if (messageContainer) {
                                messageContainer.appendChild(errorList);
                            }
                        }
                    }
                })
                .catch(error => {
                    // AJAX request error
                    console.error('Error:', error);
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    showFormMessage(contactForm, false, 'Hubo un problema técnico al enviar tu consulta. Por favor verifica tu conexión e intenta más tarde, o contáctanos directamente por teléfono.');
                });
            }
        });
        
        // Remove error messages when user starts typing
        const formFields = contactForm.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                
                // Remove error message if exists
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.nextElementSibling.remove();
                }
                
                // Remove general form error message
                const formMessage = contactForm.querySelector('.form-message.error-message');
                if (formMessage) {
                    formMessage.remove();
                }
            });
        });
    }
}

/**
 * Add pharmaceutical-specific validation rules
 */
function addPharmaceuticalValidation(form) {
    const messageField = form.querySelector('#message');
    if (messageField) {
        // Add placeholder with pharmaceutical context
        messageField.placeholder = '¿Qué productos farmacéuticos necesitas? ¿Tienes alguna consulta sobre medicamentos, cosméticos o material médico? Describe tus necesidades...';
        
        // Add validation for pharmaceutical terms
        messageField.addEventListener('blur', function() {
            const message = this.value.toLowerCase();
            const pharmaceuticalTerms = ['medicamento', 'farmaco', 'medicina', 'cosmético', 'material médico', 'salud', 'tratamiento'];
            const containsPharmTerms = pharmaceuticalTerms.some(term => message.includes(term));
            
            if (message.length > 20 && !containsPharmTerms) {
                // Add subtle suggestion
                const suggestion = document.createElement('div');
                suggestion.className = 'form-suggestion';
                suggestion.innerHTML = '<i class="fas fa-lightbulb"></i> Sugerencia: Incluye información sobre qué tipo de productos farmacéuticos te interesan para una mejor atención.';
                
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('form-suggestion')) {
                    this.parentNode.insertBefore(suggestion, this.nextSibling);
                }
            }
        });
    }
}

/**
 * Enhanced form validation for pharmaceutical context
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Remove previous error messages
    const previousMessages = form.querySelectorAll('.error-message');
    previousMessages.forEach(message => message.remove());
    
    // Validate required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = getFieldErrorMessage(field);
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
        }
    });
    
    // Enhanced email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = emailField.value.trim();
        
        if (!emailRegex.test(email)) {
            isValid = false;
            emailField.classList.add('error');
            
            if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'Por favor ingrese un email válido para recibir nuestra respuesta';
                emailField.parentNode.insertBefore(errorMessage, emailField.nextSibling);
            }
        }
    }
    
    // Phone number validation (Dominican Republic format)
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value.trim()) {
        const phone = phoneField.value.replace(/\D/g, ''); // Remove non-digits
        const dominicanPhoneRegex = /^(1?809|1?829|1?849)\d{7}$/; // Dominican Republic phone formats
        
        if (phone.length > 0 && !dominicanPhoneRegex.test(phone)) {
            isValid = false;
            phoneField.classList.add('error');
            
            if (!phoneField.nextElementSibling || !phoneField.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'Formato de teléfono inválido. Ej: 809-555-1234';
                phoneField.parentNode.insertBefore(errorMessage, phoneField.nextSibling);
            }
        }
    }
    
    // Message length validation
    const messageField = form.querySelector('#message');
    if (messageField && messageField.value.trim().length < 10) {
        isValid = false;
        messageField.classList.add('error');
        
        if (!messageField.nextElementSibling || !messageField.nextElementSibling.classList.contains('error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'Por favor proporciona más detalles sobre tu consulta (mínimo 10 caracteres)';
            messageField.parentNode.insertBefore(errorMessage, messageField.nextSibling);
        }
    }
    
    return isValid;
}

/**
 * Get appropriate error message for different field types
 */
function getFieldErrorMessage(field) {
    const fieldName = field.getAttribute('name');
    const fieldType = field.getAttribute('type');
    
    switch(fieldName) {
        case 'name':
            return 'Tu nombre es necesario para personalizar nuestra atención';
        case 'email':
            return 'Tu email es requerido para enviarte información sobre nuestros productos';
        case 'message':
            return 'Por favor describe tu consulta farmacéutica';
        default:
            return 'Este campo es obligatorio';
    }
}

/**
 * Show message after form submission
 * @param {HTMLFormElement} form - The form
 * @param {boolean} success - Whether it was successful or not
 * @param {string} message - The message to show
 */
function showFormMessage(form, success, message) {
    // Remove previous message if exists
    const previousMessage = form.querySelector('.form-message');
    if (previousMessage) {
        previousMessage.remove();
    }
    
    const formContainer = form.parentElement;
    const messageEl = document.createElement('div');
    messageEl.classList.add('form-message');
    
    if (success) {
        messageEl.classList.add('success-message');
        messageEl.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        // Hide form on success
        form.style.display = 'none';
        
        // Add pharmaceutical-specific success elements
        const successExtras = document.createElement('div');
        successExtras.className = 'success-extras';
        successExtras.innerHTML = `
            <p><strong>¿Qué sigue?</strong></p>
            <ul>
                <li><i class="fas fa-clock"></i> Revisaremos tu consulta dentro de las próximas 4 horas</li>
                <li><i class="fas fa-phone"></i> Te contactaremos para confirmar tus necesidades</li>
                <li><i class="fas fa-pills"></i> Te proporcionaremos información detallada sobre nuestros productos</li>
            </ul>
        `;
        messageEl.appendChild(successExtras);
        
    } else {
        messageEl.classList.add('error-message');
        messageEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Add contact alternatives on error
        const alternatives = document.createElement('div');
        alternatives.className = 'contact-alternatives';
        alternatives.innerHTML = `
            <p><strong>Alternativas de contacto:</strong></p>
            <ul>
                <li><i class="fas fa-phone"></i> Llámanos al <a href="tel:+18095551234">809-555-1234</a></li>
                <li><i class="fas fa-envelope"></i> Escríbenos a <a href="mailto:info@ameriline.com.do">info@ameriline.com.do</a></li>
                <li><i class="fas fa-map-marker-alt"></i> Visítanos en Calle Las Orquídeas 12, Cristo Rey</li>
            </ul>
        `;
        messageEl.appendChild(alternatives);
    }
    
    formContainer.appendChild(messageEl);
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Format phone number as user types (Dominican Republic format)
 */
function formatPhoneNumber(phoneField) {
    phoneField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
        let formattedValue = '';
        
        if (value.length > 0) {
            if (value.length <= 3) {
                formattedValue = value;
            } else if (value.length <= 6) {
                formattedValue = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                formattedValue = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
            }
        }
        
        e.target.value = formattedValue;
    });
}

// Initialize phone formatting when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const phoneField = document.querySelector('input[type="tel"]');
    if (phoneField) {
        formatPhoneNumber(phoneField);
    }
});

/**
 * Add pharmaceutical-specific autocomplete suggestions
 */
function addPharmaceuticalAutocomplete() {
    const messageField = document.querySelector('#message');
    if (messageField) {
        const suggestions = [
            'Necesito información sobre antibióticos',
            'Busco productos cosméticos para farmacia',
            'Requiero material médico gastable',
            'Consulta sobre medicamentos genéricos',
            'Información sobre productos para cuidado capilar',
            'Necesito suplementos alimenticios',
            'Consulta sobre disponibilidad de productos',
            'Información sobre precios y distribución'
        ];
        
        // Create datalist for suggestions
        const datalist = document.createElement('datalist');
        datalist.id = 'pharmaceutical-suggestions';
        
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            datalist.appendChild(option);
        });
        
        document.body.appendChild(datalist);
        messageField.setAttribute('list', 'pharmaceutical-suggestions');
    }
}

// Initialize autocomplete
document.addEventListener('DOMContentLoaded', addPharmaceuticalAutocomplete);