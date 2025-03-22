import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

interface RedditSubreddit {
	id: string;
	name: string;
	subscribers: number;
	description: string;
	icon: string;
}

export async function fetchSubreddits(token: string): Promise<RedditSubreddit[]> {
	let allSubreddits: RedditSubreddit[] = [];
	let after: string | null = null;

	do {
		const url = new URL('https://oauth.reddit.com/subreddits/mine/subscriber');
		url.searchParams.set('limit', '100');
		if (after) {
			url.searchParams.set('after', after);
		}

		const response = await fetch('/api/reddit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				url: url.toString(),
				token
			})
		});

		if (!response.ok) {
			throw new Error('Failed to fetch subreddits');
		}

		const data = await response.json();
		const subreddits = data.data.children.map((child: any) => ({
			id: child.data.name,
			name: child.data.display_name,
			subscribers: child.data.subscribers,
			description: child.data.public_description,
			icon: child.data.icon_img || child.data.community_icon
		}));

		allSubreddits = [...allSubreddits, ...subreddits];
		after = data.data.after;
	} while (after);

	return allSubreddits;
}

export async function unsubscribeFromSubreddit(token: string, subredditName: string) {
	const response = await fetch('/api/reddit', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			url: 'https://oauth.reddit.com/api/subscribe',
			token,
			method: 'POST',
			body: `action=unsub&sr_name=${subredditName}`
		})
	});

	if (!response.ok) {
		throw new Error(`Failed to unsubscribe from ${subredditName}`);
	}

	return true;
}

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type ProgressCallback = (current: number, total: number) => void;

export async function batchUnsubscribe(
	token: string,
	subreddits: string[],
	onProgress: ProgressCallback
) {
	const batchSize = 5;
	const delayMs = 1000; // 1 second delay between batches
	const total = subreddits.length;
	let processed = 0;

	for (let i = 0; i < total; i += batchSize) {
		const batch = subreddits.slice(i, i + batchSize);
		await Promise.all(batch.map((subreddit) => unsubscribeFromSubreddit(token, subreddit)));
		processed += batch.length;
		onProgress(processed, total);
		if (i + batchSize < total) {
			await delay(delayMs);
		}
	}
}
