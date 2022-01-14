export const getUsername = (id: string): string => id.substring(id.length - 6).toUpperCase() || 'N/A';
