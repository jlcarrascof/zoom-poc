import axios from 'axios';
import dotenv from 'dotenv';
import { filterAllowedRegistrants } from './accessControl.js';
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
      headers: { Authorization: `Basic ${credentials}` }
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
export async function createMeeting(groupName) {
  const zoomApi = await getZoomApiClient();

  const response = await zoomApi.post(`/users/${ZOOM_USER_ID}/meetings`, {
    topic: `Reunión Grupo ${groupName}`,
    type: 2,
    start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hora después
    duration: 30,
    timezone: 'UTC',
    settings: {
      host_video: true,
      participant_video: true,
      approval_type: 0,
      registration_type: 1,
      registrants_email_notification: true
    }
  });

  return response.data;
}

// 4. Add only allowed registrants
export async function addGroupRegistrants(meetingId, groupName) {
  const zoomApi = await getZoomApiClient();

  // Hardcoded example list (can be dynamic later)
  const allPotentialRegistrants = [
    { email: 'ana@example.com', first_name: 'Ana' },
    { email: 'benito@example.com', first_name: 'Benito' },
    { email: 'carla@example.com', first_name: 'Carla' },
    { email: 'malito@example.com', first_name: 'Malito' } // no permitido
  ];

  const allowed = filterAllowedRegistrants(groupName, allPotentialRegistrants);
  const results = [];

  for (const registrant of allowed) {
    try {
      const res = await zoomApi.post(`/meetings/${meetingId}/registrants`, registrant);
      results.push(res.data);
    } catch (error) {
      console.error(`❌ Error adding ${registrant.email}:`, error.response?.data || error.message);
    }
  }

  return results;
}

// 5. Update meeting with alternative host
export async function updateMeetingWithHost(meetingId, altHostEmail) {
  const zoomApi = await getZoomApiClient();

  const response = await zoomApi.patch(`/meetings/${meetingId}`, {
    settings: {
      alternative_hosts: altHostEmail
    }
  });

  return response.data;
}

// 6. Change the host of the meeting
export async function changeMeetingHost(meetingId, newHostId) {
  const zoomApi = await getZoomApiClientClient();

  const response = await zoomApi.patch(`/meetings/${meetingId}`, {
    schedule_for: newHostId
  });

  return response.data;
}
