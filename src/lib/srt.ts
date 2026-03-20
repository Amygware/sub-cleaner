export interface SrtBlock {
	index: number;
	timestamp: string;
	contentLines: string[];
	raw: string;
}

export interface AnnotatedBlock extends SrtBlock {
	removed: boolean;
}

export interface CleanResult {
	cleaned: string;
	blocks: AnnotatedBlock[];
	originalCount: number;
	removedCount: number;
}

const AD_PATTERNS: RegExp[] = [
	/https?:\/\//i,
	/www\./i,
	/\.\s*(com|net|org|io|info|co)\b/i,
	/subtitles?\s*by/i,
	/encoded\s*by/i,
	/downloaded\s*from/i,
	/opensubtitles/i,
	/addic7ed/i,
	/subscene/i,
	/sync(ed|hronized)?\s*by/i,
	/corrected\s*by/i,
	/visit\s*our/i,
	/support\s*us/i,
	/\bdonate\b/i,
	/\bpatreon\b/i,
	/ripped\s*by/i,
	/translated\s*by/i,
	/captioned\s*by/i
];

function lineMatchesAd(line: string): boolean {
	return AD_PATTERNS.some((pattern) => pattern.test(line));
}

export function parseSrt(text: string): SrtBlock[] {
	// Normalize line endings and strip BOM
	const normalized = text
		.replace(/^\uFEFF/, '')
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n');

	const rawBlocks = normalized.split(/\n\n+/).filter((b) => b.trim().length > 0);

	const blocks: SrtBlock[] = [];

	for (const raw of rawBlocks) {
		const lines = raw.trim().split('\n');
		if (lines.length < 2) continue;

		const indexLine = lines[0].trim();
		const index = parseInt(indexLine, 10);
		if (isNaN(index)) continue;

		const timestamp = lines[1].trim();
		if (!timestamp.includes('-->')) continue;

		const contentLines = lines.slice(2);

		blocks.push({ index, timestamp, contentLines, raw: raw.trim() });
	}

	return blocks;
}

export function isAdBlock(block: SrtBlock): boolean {
	const nonEmptyLines = block.contentLines.filter((line) => line.trim().length > 0);
	if (nonEmptyLines.length === 0) return false;
	return nonEmptyLines.every((line) => lineMatchesAd(line));
}

export function cleanSrt(text: string): CleanResult {
	const parsed = parseSrt(text);

	const annotated: AnnotatedBlock[] = parsed.map((block) => ({
		...block,
		removed: isAdBlock(block)
	}));

	let newIndex = 1;
	const cleanedBlocks: string[] = [];

	for (const block of annotated) {
		if (!block.removed) {
			const lines = [String(newIndex), block.timestamp, ...block.contentLines];
			cleanedBlocks.push(lines.join('\n'));
			newIndex++;
		}
	}

	return {
		cleaned: cleanedBlocks.join('\n\n') + '\n',
		blocks: annotated,
		originalCount: parsed.length,
		removedCount: annotated.filter((b) => b.removed).length
	};
}
