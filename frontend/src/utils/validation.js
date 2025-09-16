/**
 * Form validation utility functions
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - at least 6 characters
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Phone number validation - 10 digits
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Pincode validation - 6 digits
export const isValidPincode = (pincode) => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

// Required field validation
export const isRequired = (value) => {
  return value && value.trim().length > 0;
};

// Min length validation
export const minLength = (value, min) => {
  return value && value.length >= min;
};

// Max length validation
export const maxLength = (value, max) => {
  return value && value.length <= max;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    // Check required
    if (rules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }
    
    // Check min length
    if (rules.minLength && !minLength(value, rules.minLength)) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      return;
    }
    
    // Check max length
    if (rules.maxLength && !maxLength(value, rules.maxLength)) {
      errors[field] = `${field} must be less than ${rules.maxLength} characters`;
      return;
    }
    
    // Check email format
    if (rules.isEmail && !isValidEmail(value)) {
      errors[field] = `Please enter a valid email address`;
      return;
    }
    
    // Check phone format
    if (rules.isPhone && !isValidPhone(value)) {
      errors[field] = `Please enter a valid 10-digit phone number`;
      return;
    }
    
    // Check pincode format
    if (rules.isPincode && !isValidPincode(value)) {
      errors[field] = `Please enter a valid 6-digit pincode`;
      return;
    }
    
    // Check password match
    if (rules.shouldMatch && formData[field] !== formData[rules.shouldMatch]) {
      errors[field] = `${field} does not match ${rules.shouldMatch}`;
      return;
    }
    
    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, formData);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Example usage:
/*
const validationRules = {
  email: { required: true, isEmail: true },
  password: { required: true, minLength: 6 },
  confirmPassword: { required: true, shouldMatch: 'password' },
  phone: { required: true, isPhone: true },
  pincode: { required: true, isPincode: true }
};

const { isValid, errors } = validateForm(formData, validationRules);
*/