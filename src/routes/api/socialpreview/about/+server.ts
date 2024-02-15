import sharp from 'sharp';

async function convertSvgToPngBuffer(svgContent, width, height, overlayBuffer) {
	let image = sharp(Buffer.from(svgContent), { density: 300 }).resize(width, height);
	if (overlayBuffer) {
		const scaledOverlayBuffer = await sharp(overlayBuffer)
			.resize({ width: 300, height: 300 })
			.toBuffer();
		image.composite([{ input: scaledOverlayBuffer, top: 280, left: 270 }]);
	}
	return await image.toBuffer();
}

export async function GET({ request, fetch }) {
	const response = await fetch('/generic.svg');
	const genericFile = await response.text();

	const about = genericFile.replace(/Top Text/, 'Pokécompanion').replace(/Bottom Text/, 'About');
	const pngBuffer = await convertSvgToPngBuffer(about, 1200, 630);
	return new Response(pngBuffer, {
		headers: {
			'Content-Type': 'image/png'
		}
	});
}
