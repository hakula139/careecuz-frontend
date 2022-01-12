export const getUsername = (id: string): string => id.substring(0, 7).toUpperCase() || 'N/A';
