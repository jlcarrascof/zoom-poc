import { createMeeting, addHardcodedRegistrants } from './zoomService.js';

async function run() {
  try {
    const meeting = await createMeeting();
    console.log(meeting);
    console.log('✅ Meeting Created:', meeting.join_url);

    const registrants = await addHardcodedRegistrants(meeting.id);
    console.log('✅ Registrants added:', registrants.map(r => ({
      name: r.first_name,
      join_url: r.join_url
    })));

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

run();
