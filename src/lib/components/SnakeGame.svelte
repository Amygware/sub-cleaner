<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';

	interface Point {
		x: number;
		y: number;
	}

	interface Food {
		position: Point;
		text: string;
		size: number;
		opacity: number;
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let snake: Point[] = [];
	let food: Food[] = [];
	let direction: 'up' | 'down' | 'left' | 'right' = 'right';
	let cellSize = 20;
	let gameLoop: number;
	let score = 0;
	let highScore = 0;
	let isGameOver = false;
	let gameSpeed = 100;
	let lastInteraction = Date.now();
	let isInactive = false;
	let circleCenter: Point = { x: 0, y: 0 };
	let circleRadius = 5;
	let circleAngle = 0;
	let isPlaying = false;

	const subreddits = [
		'r/aww',
		'r/gaming',
		'r/memes',
		'r/pics',
		'r/funny',
		'r/AskReddit',
		'r/worldnews',
		'r/science',
		'r/technology',
		'r/art',
		'r/gifs',
		'r/videos',
		'r/Showerthoughts',
		'r/todayilearned',
		'r/Jokes',
		'r/books',
		'r/music',
		'r/food',
		'r/photography',
		'r/DIY',
		'r/space',
		'r/explainlikeimfive',
		'r/relationships',
		'r/GetMotivated',
		'r/creepy',
		'r/woahdude',
		'r/oddlysatisfying',
		'r/wholesomememes',
		'r/AmItheAsshole',
		'r/NoStupidQuestions',
		'r/OutOfTheLoop'
	];

	function initGame() {
		if (!canvas || !ctx) return;

		// Set canvas size to container size
		const container = canvas.parentElement;
		if (!container) return;

		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight;

		// Initialize snake
		snake = [
			{ x: 5, y: 5 },
			{ x: 4, y: 5 },
			{ x: 3, y: 5 }
		];

		// Initialize food
		spawnFood();
		isGameOver = false;
		gameSpeed = 100;
		score = 0;
		isInactive = false;
		lastInteraction = Date.now();
		circleAngle = 0;
	}

	function startGame() {
		isPlaying = true;
		initGame();
		gameLoop = setInterval(gameStep, gameSpeed);
	}

	function updateCircleCenter() {
		const maxX = Math.floor(canvas.width / cellSize) - circleRadius * 2;
		const maxY = Math.floor(canvas.height / cellSize) - circleRadius * 2;
		circleCenter = {
			x: Math.floor(maxX / 2),
			y: Math.floor(maxY / 2)
		};
	}

	function spawnFood() {
		const maxX = Math.floor(canvas.width / cellSize);
		const maxY = Math.floor(canvas.height / cellSize);

		// Spawn 8 food items
		while (food.length < 8) {
			const position = {
				x: Math.floor(Math.random() * maxX),
				y: Math.floor(Math.random() * maxY)
			};

			// Check if position is not on snake
			if (!snake.some((segment) => segment.x === position.x && segment.y === position.y)) {
				food.push({
					position,
					text: subreddits[Math.floor(Math.random() * subreddits.length)],
					size: 10,
					opacity: 1
				});
			}
		}
	}

	function update() {
		if (isGameOver) return;

		// Check for inactivity
		const now = Date.now();
		if (now - lastInteraction > 3000 && !isInactive) {
			isInactive = true;
			updateCircleCenter();
		}

		// Move snake
		const head = { ...snake[0] };
		if (isInactive) {
			// Circular movement
			circleAngle += 0.1;
			head.x = Math.floor(circleCenter.x + Math.cos(circleAngle) * circleRadius);
			head.y = Math.floor(circleCenter.y + Math.sin(circleAngle) * circleRadius);
		} else {
			// Normal movement
			switch (direction) {
				case 'up':
					head.y--;
					break;
				case 'down':
					head.y++;
					break;
				case 'left':
					head.x--;
					break;
				case 'right':
					head.x++;
					break;
			}
		}

		// Check for collisions with walls
		const maxX = Math.floor(canvas.width / cellSize);
		const maxY = Math.floor(canvas.height / cellSize);
		if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
			gameOver();
			return;
		}

		// Check for collisions with self
		if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
			gameOver();
			return;
		}

		snake.unshift(head);

		// Check for food collision
		const foodIndex = food.findIndex((f) => f.position.x === head.x && f.position.y === head.y);

		if (foodIndex !== -1) {
			score++;
			if (score > highScore) highScore = score;

			// Animate food being eaten
			const eatenFood = food[foodIndex];
			food.splice(foodIndex, 1);

			// Increase game speed
			gameSpeed = Math.max(50, 100 - score * 2);
			clearInterval(gameLoop);
			gameLoop = setInterval(gameStep, gameSpeed);

			spawnFood();
		} else {
			snake.pop();
		}
	}

	function gameOver() {
		isGameOver = true;
		isPlaying = false;
		clearInterval(gameLoop);
	}

	function restartGame() {
		startGame();
	}

	function draw() {
		if (!ctx || !canvas) return;

		// Clear canvas with fade effect
		ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw grid
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.lineWidth = 1;
		for (let x = 0; x < canvas.width; x += cellSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
			ctx.stroke();
		}
		for (let y = 0; y < canvas.height; y += cellSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
			ctx.stroke();
		}

		// Draw snake with gradient
		snake.forEach((segment, index) => {
			const gradient = ctx.createLinearGradient(
				segment.x * cellSize,
				segment.y * cellSize,
				(segment.x + 1) * cellSize,
				(segment.y + 1) * cellSize
			);
			gradient.addColorStop(0, index === 0 ? '#60A5FA' : '#3B82F6');
			gradient.addColorStop(1, index === 0 ? '#3B82F6' : '#2563EB');

			ctx.fillStyle = gradient;
			ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 2, cellSize - 2);
		});

		// Draw food with animation
		food.forEach((f) => {
			ctx.fillStyle = `rgba(239, 68, 68, ${f.opacity})`;
			ctx.font = `${f.size}px monospace`;
			ctx.fillText(f.text, f.position.x * cellSize + 4, f.position.y * cellSize + 16);
		});

		// Draw score
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.font = '16px monospace';
		ctx.fillText(`Score: ${score}`, 20, 30);
		ctx.fillText(`High Score: ${highScore}`, 20, 50);

		if (isGameOver) {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'white';
			ctx.font = '24px monospace';
			ctx.textAlign = 'center';
			ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
			ctx.font = '16px monospace';
			ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
		}
	}

	function gameStep() {
		update();
		draw();
	}

	function handleKeydown(event: KeyboardEvent) {
		lastInteraction = Date.now();
		isInactive = false;

		if (event.key === ' ' && isGameOver) {
			restartGame();
			return;
		}

		switch (event.key) {
			case 'ArrowUp':
				if (direction !== 'down') direction = 'up';
				break;
			case 'ArrowDown':
				if (direction !== 'up') direction = 'down';
				break;
			case 'ArrowLeft':
				if (direction !== 'right') direction = 'left';
				break;
			case 'ArrowRight':
				if (direction !== 'left') direction = 'right';
				break;
		}
	}

	onMount(() => {
		if (!browser) return;

		ctx = canvas.getContext('2d')!;
		initGame();
		draw(); // Draw initial state
		window.addEventListener('keydown', handleKeydown);

		return () => {
			clearInterval(gameLoop);
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="relative h-full w-full">
	<canvas bind:this={canvas} class="h-full w-full" style="background: transparent;"></canvas>
	{#if !isPlaying && !isGameOver}
		<div class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
			<Button on:click={startGame} class="bg-orange-500 hover:bg-orange-600">Play Game</Button>
		</div>
	{:else if isGameOver}
		<div class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
			<Button on:click={restartGame} class="bg-orange-500 hover:bg-orange-600">Restart Game</Button>
		</div>
	{/if}
</div>
