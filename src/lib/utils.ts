import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format bytes to human readable format
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format date to readable format
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }
  
  // Check if date is today
  const today = new Date();
  const isToday = date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();
  
  if (isToday) {
    return `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Check if date is yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() &&
                      date.getMonth() === yesterday.getMonth() &&
                      date.getFullYear() === yesterday.getFullYear();
  
  if (isYesterday) {
    return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Check if date is this year
  const isThisYear = date.getFullYear() === today.getFullYear();
  
  if (isThisYear) {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  
  // Otherwise, use full date
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Generate avatar initials from name
export function getInitials(name: string) {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Capitalize first letter of each word
export function capitalize(text: string) {
  if (!text) return '';
  return text.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Get file extension from file name
export function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

// Check if file is an image
export function isImageFile(fileType: string) {
  return fileType.startsWith('image/');
}

// Check if file is a PDF
export function isPdfFile(fileType: string) {
  return fileType === 'application/pdf';
}

// Generate a random hex color based on a string
export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
