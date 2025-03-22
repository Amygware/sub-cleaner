import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = await request.json();
		const { url, token, method = 'GET', body } = payload;

		if (!url || !token) {
			return new Response(
				JSON.stringify({ error: 'Missing required fields: url and token are required' }),
				{ status: 400 }
			);
		}

		console.log('Making request to Reddit API:', {
			url,
			method,
			hasToken: !!token,
			body: body ? '(present)' : '(none)'
		});

		const response = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				'User-Agent': 'RedditCleaner/1.0.0',
				'Content-Type': method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
			},
			...(body && { body })
		});

		if (!response.ok) {
			console.error('Reddit API error:', {
				status: response.status,
				statusText: response.statusText
			});
			const errorText = await response.text();
			console.error('Error response:', errorText);
			throw new Error(`Reddit API error: ${response.status} - ${errorText}`);
		}

		const data = await response.json();
		return json(data);
	} catch (error: unknown) {
		console.error('Server error:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
