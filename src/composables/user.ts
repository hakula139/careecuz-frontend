export const getUsername = (userId: string): string => userId.split('-')[0].toUpperCase() || 'N/A';
