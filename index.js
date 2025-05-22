import { createMeeting, addGroupRegistrants } from './zoomService.js';

async function run() {
  const group = 'grupoA';

  try {
    const meeting = await createMeeting(group);
    console.log('📅 Meeting Created:', meeting.join_url);

    const registrants = await addGroupRegistrants(meeting.id, group);
    console.log('✅ Registrants added:', registrants.map(r => ({
      name: r.first_name,
      join_url: r.join_url
    })));

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

run();
