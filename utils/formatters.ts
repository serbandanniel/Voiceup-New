
export const formatCurrency = (amount: number): string => {
    return `${amount} RON`;
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatDateFull = (dateString: string): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
