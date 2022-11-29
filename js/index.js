const charData = [];

window.onresize = function() {
	document.body.height = window.innerHeight;

	charData.forEach(data => {
		const bounds = data.element.getBoundingClientRect();
		data.pageX = bounds.left + bounds.width / 2;
		data.pageY = bounds.top + bounds.height / 2;
		data.width = bounds.width;
		data.height = bounds.height;
	});
};

const init = () => {
	const chars = document.querySelectorAll('.char');
	const links = document.querySelectorAll('.link');
	const durationScalar = 1.25;
	const input = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
		lastX: window.innerWidth / 2,
		lastY: window.innerHeight / 2
	};
	const amplitude = 10;
	let delay = 0;
	let tl;

	const transitionIn = () => {
		chars.forEach((char, index) => {
			if (index < chars.length - 1) {
				tl = gsap.timeline();
			} else {
				tl = gsap.timeline({
					onComplete: () => {
						window.onresize();
						update();
					}
				});
			}

			const bounds = char.getBoundingClientRect();
			charData.push({
				element: char,
				x: 0,
				y: 0,
				targetX: 0,
				targetY: 0,
				pageX: bounds.left + bounds.width / 2,
				pageY: bounds.top + bounds.height / 2,
				width: bounds.width,
				height: bounds.height,
				vx: 0,
				vy: 0
			});

			const scalar = Math.random() < 0.5 ? -1 : 1;

			tl.fromTo(
				char,
				{
					y: -window.innerHeight / 2,
					opacity: 0,
					scale: 0.5,
					rotation: 360 * scalar
				},
				{
					y: window.innerHeight / 2,
					opacity: 1,
					scale: 1,
					rotation: 180 * scalar,
					duration: 1 * durationScalar,
					ease: 'power3.in',
					delay: delay
				}
			);

			tl.to(char, {
				y: 0,
				rotation: 0,
				duration: 2 * durationScalar,
				ease: 'elastic'
			});

			delay += 0.2;
		});

		gsap.to(links, {
			duration: 1.2,
			rotation: 0,
			y: 0,
			stagger: 0.1,
			ease: 'elastic',
			delay: delay + 0.4
		});
	};

	const distance = (x1, x2, y1, y2) => {
		const a = x1 - x2;
		const b = y1 - y2;
		return Math.sqrt(a * a + b * b);
	};

	const smoothstep = (min, max, value) => {
		const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
		return x * x * (3 - 2 * x);
	};

	const update = () => {
		requestAnimationFrame(update);

		const velX = (input.x - input.lastX) * amplitude;
		const velY = (input.y - input.lastY) * amplitude;
		const friction = 0.7;

		charData.forEach((data, index) => {
			const dist = distance(input.x, data.pageX, input.y, data.pageY);
			const scalar = smoothstep(data.width + data.height, 0, dist) * 0.1;

			data.targetX = velX * scalar;
			data.targetY = velY * scalar;

			const dx = data.targetX - data.x * 0.1;
			const dy = data.targetY - data.y * 0.1;
			data.vx += dx;
			data.vy += dy;
			data.vx *= friction;
			data.vy *= friction;

			data.x += data.vx;
			data.y += data.vy;

			const r = Math.max(Math.min(180 * (data.x + data.y) * 0.0025, 270), -270);

			data.element.style.transform = `translate(${data.x}px, ${data.y}px) rotate(${r}deg)`;
		});

		input.lastX = input.x;
		input.lastY = input.y;
	};

	const handleMouseMove = e => {
		input.x = e.clientX;
		input.y = e.clientY;
	};

	const handleTouchMove = e => {
		const touch = e.changedTouches[0];
		input.x = touch.clientX;
		input.y = touch.clientY;
	};

	window.addEventListener('mousemove', handleMouseMove, false);
	window.addEventListener('touchmove', handleTouchMove, false);

	transitionIn();
};

document.addEventListener('DOMContentLoaded', init);
