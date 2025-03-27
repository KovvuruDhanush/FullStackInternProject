const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 20 || name.length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return null;
};

const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters';
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password must contain at least one uppercase letter, one special character, and one number';
  }
  return null;
};

const validateAddress = (address) => {
  if (!address) return 'Address is required';
  if (address.length > 400) {
    return 'Address must not exceed 400 characters';
  }
  return null;
};

const validateRating = (rating) => {
  if (!rating) return 'Rating is required';
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return 'Rating must be a number between 1 and 5';
  }
  return null;
};

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  validateRating
};