
export const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    // Allows +, spaces, dashes, and digits. Minimum 10 characters.
    const re = /^[0-9\+\-\s]{10,}$/;
    return re.test(phone);
};

export const hasTwoWords = (name: string): boolean => {
    return name.trim().split(' ').length >= 2;
};
