import { createMeeting } from './zoomService.js';

test('createMeeting should create a meeting and return meeting data', async () => {
  const meeting = await createMeeting();

  expect(meeting).toHaveProperty('id');
  expect(meeting).toHaveProperty('join_url');
});
