import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const message = data.get('message')?.toString().trim();

    if (!message) {
      return fail(400, { error: 'Message cannot be empty' });
    }

    const webhookUrl = env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return fail(500, { error: 'Webhook not configured' });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: message,
        username: 'PokeCompanion Feedback'
      })
    });

    if (!response.ok) {
      return fail(502, { error: 'Failed to send feedback' });
    }

    return { success: true };
  }
};
