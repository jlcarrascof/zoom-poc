import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const {
  ZOOM_ACCOUNT_ID,
  ZOOM_CLIENT_ID,
  ZOOM_CLIENT_SECRET,
  ZOOM_USER_ID
} = process.env;

// 1. Obtener token de acceso
async function getAccessToken() {
  const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
    null,
    {
      headers: { Authorization: `Basic ${credentials}` }
    }
  );
  return response.data.access_token;
}

// 2. Instancia de cliente Zoom API
async function getZoomApiClient() {
  const accessToken = await getAccessToken();
  return axios.create({
    baseURL: 'https://api.zoom.us/v2',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
}

// 3. Crear una reunión y devolver join_url general
export async function createMeeting(groupName) {
  const zoomApi = await getZoomApiClient();

  const response = await zoomApi.post(`/users/${ZOOM_USER_ID}/meetings`, {
    topic: `Reunión Grupo ${groupName}`,
    type: 2, // reunión programada
    start_time: new Date(Date.now() + 3600000).toISOString(), // en 1 hora
    duration: 30,
    timezone: 'UTC',
    settings: {
      host_video: true,
      participant_video: true,
      approval_type: 0, // auto-aprobación (sin registrants)
      registration_type: 1,
      registrants_email_notification: false
    }
  });

  // Solo nos interesa el link general
  return {
    join_url: response.data.join_url,
    meeting_id: response.data.id,
    start_time: response.data.start_time
  };
}

// 4. Cambiar host alternativo
export async function updateMeetingWithHost(meetingId, altHostEmail) {
  const zoomApi = await getZoomApiClient();

  const response = await zoomApi.patch(`/meetings/${meetingId}`, {
    settings: {
      alternative_hosts: altHostEmail
    }
  });

  return response.data;
}

// 5. Reasignar el host de la reunión
export async function changeMeetingHost(meetingId, newHostId) {
  const zoomApi = await getZoomApiClient();

  const response = await zoomApi.patch(`/meetings/${meetingId}`, {
    schedule_for: newHostId
  });

  return response.data;
}
