export const validatePasswordComplexity = (
  password: string | undefined,
  passwordComplexity: number
) => {
  if (!password) return true;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialCharacters = /\W/.test(password);
  const hasNumbers = /\d/.test(password);
  const passwordValidation = [
    hasUpperCase,
    hasLowerCase,
    hasSpecialCharacters,
    hasNumbers,
  ];
  if (passwordValidation.filter(Boolean).length >= passwordComplexity)
    return true;
  return false;
};
