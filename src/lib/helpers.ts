// Admin helper functions

// Add autocomplete property to form elements
export const getAutoCompleteProps = (type: string) => {
  switch (type) {
    case 'email':
      return { autoComplete: 'username' };
    case 'password':
      return { autoComplete: 'current-password' };
    case 'new-password':
      return { autoComplete: 'new-password' };
    case 'name':
      return { autoComplete: 'name' };
    case 'tel':
      return { autoComplete: 'tel' };
    default:
      return {};
  }
};

// Format date for display
export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Count unread notifications
export const countUnreadNotifications = async (supabase: any) => {
  try {
    const { count, error } = await supabase
      .from('contact_inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('viewed', false);
      
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};

// Generate safe initials from email or name
export const generateInitials = (input: string) => {
  if (!input) return '?';
  
  // For email addresses, use first letter
  if (input.includes('@')) {
    return input.charAt(0).toUpperCase();
  }
  
  // For names, use first letter of first and last name
  const nameParts = input.split(' ');
  if (nameParts.length > 1) {
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  }
  
  // Fallback to first letter
  return input.charAt(0).toUpperCase();
}; 