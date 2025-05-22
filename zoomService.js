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
async function getZoomApi() {
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
  const zoomApi = await getZoomApi();

  const response = await zoomApi.post(`/users/${ZOOM_USER_ID}/meetings`, {
    topic: 'Test Meeting',
    type: 2,
    start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    duration: 30,
    timezone: 'UTC',
    settings: {
      host_video: true,
      participant_video: true
    }
  });

  return response.data;
}

// 4. Update meeting with alternative host
export async function updateMeetingWithHost(meetingId, altHostEmail) {
  const zoomApi = await getZoomApi();

  const response = await zoomApi.patch(`/meetings/${meetingId}`, {
    settings: {
      alternative_hosts: altHostEmail
    }
  });

  return response.data;
}
