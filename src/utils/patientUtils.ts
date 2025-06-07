export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const validateIdNumber = (idNumber: string): { isValid: boolean; error?: string } => {
  if (!idNumber.trim()) {
    return { isValid: false, error: 'El número de identificación es obligatorio' };
  }

  if (idNumber.trim().length < 6) {
    return { isValid: false, error: 'El número de identificación debe tener al menos 6 caracteres' };
  }

  const idRegex = /^[0-9]+$/;
  if (!idRegex.test(idNumber)) {
    return { isValid: false, error: 'El número de identificación solo puede contener números' };
  }

  return { isValid: true };
};

export const formatGender = (gender: 'M' | 'F' | 'O'): string => {
  const genderMap = {
    'M': 'Masculino',
    'F': 'Femenino',
    'O': 'Otro'
  };
  return genderMap[gender] || gender;
};

export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('es-ES', options || defaultOptions);
};

export const generateInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export const validateBirthDate = (birthDate: string): { isValid: boolean; error?: string } => {
  if (!birthDate) {
    return { isValid: false, error: 'La fecha de nacimiento es obligatoria' };
  }

  const birth = new Date(birthDate);
  const today = new Date();
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(today.getFullYear() - 100);

  if (birth > today) {
    return { isValid: false, error: 'La fecha de nacimiento no puede ser futura' };
  }

  if (birth < hundredYearsAgo) {
    return { isValid: false, error: 'La fecha de nacimiento no puede ser mayor a 100 años' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'El email es obligatorio' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'El formato del email no es válido' };
  }

  return { isValid: true };
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'El teléfono es obligatorio' };
  }

  // Formats: +57 300 123 4567, 300 123 4567, 3001234567
  const phoneRegex = /^(\+57\s?)?[0-9]{3}\s?[0-9]{3}\s?[0-9]{4}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  
  if (!phoneRegex.test(phone) && !/^(\+57)?[0-9]{10}$/.test(cleanPhone)) {
    return { isValid: false, error: 'El formato del teléfono no es válido' };
  }

  return { isValid: true };
};

export const validateFullName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'El nombre es obligatorio' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: 'El nombre no puede exceder 100 caracteres' };
  }

  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'El nombre solo puede contener letras y espacios' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'La contraseña es obligatoria' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
  }

  if (password.length > 50) {
    return { isValid: false, error: 'La contraseña no puede exceder 50 caracteres' };
  }

  return { isValid: true };
};

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username.trim()) {
    return { isValid: false, error: 'El nombre de usuario es obligatorio' };
  }

  if (username.trim().length < 3) {
    return { isValid: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }

  if (username.trim().length > 30) {
    return { isValid: false, error: 'El nombre de usuario no puede exceder 30 caracteres' };
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'El nombre de usuario solo puede contener letras, números y guiones bajos' };
  }

  return { isValid: true };
};