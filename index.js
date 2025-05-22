import { createMeeting } from './zoomService.js';
import { groups } from './groups.js';

async function run() {
  const group = 'grupoA';
  const authorizedEmails = groups[group] || [];

  try {
    const meeting = await createMeeting(group);
    console.log('📅 Meeting created for group: ', group);
    console.log('🔗 Join URL:', meeting.join_url);

    // Simulás enviar el enlace solo a usuarios autorizados
    console.log('\n📤 Link sended only to these authorized users:');
    authorizedEmails.forEach(email => {
      console.log(`✅ ${email}: ${meeting.join_url}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

run();
