import { groups } from './groups.js';

export function filterAllowedRegistrants(groupName, registrants) {
  const allowedEmails = groups[groupName] || [];
  return registrants.filter(r => allowedEmails.includes(r.email));
}
