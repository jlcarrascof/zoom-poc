import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const {
  ZOOM_ACCOUNT_ID,
  ZOOM_CLIENT_ID,
  ZOOM_CLIENT_SECRET,
  ZOOM_USER_ID
} = process.env;

// 1. Get access token
async function getAccessToken() {
  const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
    null,
    {
      headers: {
        Authorization: `Basic ${credentials}`
      }
    }
  );

  return response.data.access_token;
}

// 2. Create Zoom API instance
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

// 3. Create a meeting
export async function createMeeting() {
  const zoomApi = await getZoomApiClient();

  const response = await zoomApi.post(`/users/${ZOOM_USER_ID}/meetings`, {
    topic: 'Test Meeting',
    type: 2, // Scheduled meeting
    start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    duration: 30,
    timezone: 'UTC',
    settings: {
      host_video: true,
      participant_video: true,
      approval_type: 0,        // 0 = auto-aprueba, 1 = manual, 2 = ninguno
      registration_type: 1,    // 1 = solo un registro por usuario
      registrants_email_notification: true
    }
  });

  return response.data;
}

export async function addHardcodedRegistrants(meetingId) {
  const zoomApi = await getZoomApiClient();

  const registrants = [
    { email: 'ana@example.com', first_name: 'Ana' },
    { email: 'benito@example.com', first_name: 'Benito' },
    { email: 'carla@example.com', first_name: 'Carla' }
  ];

  const results = [];

  for (const registrant of registrants) {
    try {
      const res = await zoomApi.post(`/meetings/${meetingId}/registrants`, registrant);
      results.push(res.data); // contains join_url and registrant_id
    } catch (error) {
      console.error(`❌ Error adding ${registrant.email}:`, error.response?.data || error.message);
    }
  }

  return results;
}

// 4. Update meeting with alternative host
export async function updateMeetingWithHost(meetingId, altHostEmail) {
  const zoomApi = await getZoomApiClient();

  const response = await zoomApi.patch(`/meetings/${meetingId}`, {
    settings: {
      alternative_hosts: altHostEmail
    }
  });

  return response.data;
}

// 5. Change the host of the meeting
export async function changeMeetingHost(meetingId, newHostId) {
  const zoomApi = await getZoomApiClientClient();

  const response = await zoomApi.patch(`/meetings/${meetingId}`, {
    schedule_for: newHostId
  });

  return response.data;
}
