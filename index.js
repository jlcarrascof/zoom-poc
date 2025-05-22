import { createMeeting, updateMeetingWithHost } from './zoomService.js';

async function run() {
  try {
    const meeting = await createMeeting();
    console.log('✅ Meeting Created:', meeting.join_url);
    console.log(`📧 Send this URL to participant: ${meeting.join_url}`);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

run();
