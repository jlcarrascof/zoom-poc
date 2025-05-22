// accessControl.js
import { groups } from './groups.js';

export function isEmailAllowedForGroup(email, groupName) {
  const allowedEmails = groups[groupName] || [];
  return allowedEmails.includes(email);
}
