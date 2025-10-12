export function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const moods = {
    happy: [
        "a joyful and cheerful atmosphere with bright, uplifting colors",
        "a scene filled with happiness and light, creating a warm and inviting mood",
        "an atmosphere of pure joy, with vibrant visuals and a sense of celebration"
    ],
    adventurous: [
        "an exciting and dynamic scene, full of action, energy, and a sense of discovery",
        "a thrilling atmosphere, capturing a moment of bold adventure and exploration",
        "a high-energy mood, with dramatic lighting and a feeling of epic journey"
    ],
    magical: [
        "an enchanting and mystical atmosphere, with a dreamlike quality and glowing magical elements",
        "a whimsical scene, filled with wonder, sparkles, and a touch of otherworldly charm",
        "an ethereal mood, with iridescent colors and a sense of magical realism"
    ],
    peaceful: [
        "a calm and serene atmosphere, with a tranquil and soothing ambiance",
        "a gentle scene, filled with soft light and a sense of quiet harmony",
        "a quiet, contemplative mood, with gentle visuals and a peaceful feeling"
    ],
    heroic: [
        "a brave and strong atmosphere, with an epic and inspiring mood",
        "a scene of courage and determination, with dramatic composition and powerful imagery",
        "a triumphant mood, capturing a moment of heroism and strength"
    ],
    mysterious: [
        "an intriguing and enigmatic atmosphere, with secrets to discover and a sense of suspense",
        "a scene shrouded in mystery, with deep shadows and a feeling of the unknown",
        "a suspenseful mood, with hidden details and an air of intrigue"
    ],
    playful: [
        "a fun and lighthearted atmosphere, with a whimsical and entertaining mood",
        "a scene of joyful play, with bright colors and a sense of carefree fun",
        "a lively and cheerful mood, full of energy and playful interactions"
    ]
};

export const colorSchemes = {
    vibrant: [
        "a palette of bright, saturated colors with high contrast to create a lively and energetic feel",
        "a vivid color scheme, using bold primary and secondary colors to make the scene pop",
        "a rich and vibrant array of colors, with deep hues and striking highlights"
    ],
    pastel: [
        "a soft, muted pastel color palette with gentle, soothing tones",
        "a dreamy scheme of light and airy pastel colors, creating a soft and delicate look",
        "a gentle array of pastel shades, with a focus on subtlety and elegance"
    ],
    warm: [
        "a warm color palette dominated by reds, oranges, and yellows, creating a cozy and inviting feel",
        "a sun-kissed color scheme, with golden light and rich, warm tones",
        "a palette of earthy and fiery colors, evoking a sense of comfort and warmth"
    ],
    cool: [
        "a cool color palette featuring blues, greens, and purples, for a calm and refreshing atmosphere",
        "a serene color scheme, with shades of twilight and deep water, creating a tranquil mood",
        "a palette of crisp and cool colors, evoking a sense of freshness and clarity"
    ],
    monochrome: [
        "a monochrome palette, using shades of a single color to create a sophisticated and unified look",
        "a classic black and white scheme, with a focus on light, shadow, and texture",
        "a grayscale composition, with a wide range of tones from pure white to deep black"
    ],
    neon: [
        "a vibrant neon color palette with glowing effects and electric hues",
        "a futuristic scheme of bright, fluorescent colors against a dark background",
        "an electrifying array of neon lights, creating a high-energy, cyberpunk feel"
    ],
    natural: [
        "a natural, earthy color palette with organic tones found in forests, deserts, or mountains",
        "a scheme of grounded and calming earth tones, inspired by the natural world",
        "a palette of rich, natural colors, from deep greens to warm browns, for an organic feel"
    ]
};

export const promptTemplates = {
    cartoon: [
        "a playful cartoon style with bold, clean outlines and a vibrant, flat color palette",
        "a classic animated cartoon look, with expressive characters and exaggerated features",
        "a modern, stylized cartoon illustration with dynamic shapes and a cheerful feel"
    ],
    sketch: [
        "a detailed pencil sketch with realistic shading, intricate cross-hatching, and fine artistic line work",
        "a loose and expressive charcoal sketch, with a focus on gesture and emotion",
        "a refined ink pen sketch, with clean lines and a minimalist aesthetic"
    ],
    watercolor: [
        "a beautiful watercolor painting with soft, blended colors, and transparent layers",
        "a vibrant and expressive watercolor illustration, with loose brush strokes and fluid textures",
        "a delicate and detailed watercolor piece, with precise linework and a gentle color wash"
    ],
    comic: [
        "a dynamic comic book style with dramatic shading, bold inks, and a high-energy color palette",
        "a classic silver-age comic art style, with Ben-Day dots and a retro feel",
        "a modern graphic novel illustration, with cinematic angles and a sophisticated color scheme"
    ],
    anime: [
        "a vibrant anime style with large, expressive eyes, dynamic hair, and stylized features",
        "a classic 90s anime aesthetic, with soft colors and a slightly grainy film look",
        "a modern, high-definition anime art style, with sharp lines and detailed backgrounds"
    ],
    line_art: [
        "a clean and elegant line art style, with minimal details and a focus on form",
        "a delicate fine-line illustration, with intricate details and a single-color palette",
        "a bold and graphic line art look, with thick, confident strokes and a strong visual impact"
    ],
    pop_art: [
        "a striking pop art style with bold, graphic colors, high contrast, and halftone patterns",
        "a retro Andy Warhol-inspired illustration, with repeated motifs and a silkscreen look",
        "a modern take on pop art, with a vibrant, street art-influenced aesthetic"
    ],
    disney: [
        "a charming animation style, with expressive, rounded characters and a magical atmosphere",
        "a classic 2D Disney animation look, reminiscent of the golden age of animation",
        "a modern 3D-rendered style, with detailed textures and cinematic lighting, inspired by Pixar"
    ],
    chibi: [
        "an adorable chibi style with oversized heads, tiny bodies, and cute, simplified features",
        "a super-deformed (SD) anime style, with a focus on humor and charm",
        "a playful and cute chibi illustration, with sparkling eyes and a fun, lighthearted feel"
    ],
    vintage: [
        "a nostalgic vintage illustration style with retro colors and classic, mid-century artistic elements",
        "a storybook illustration from the 1950s, with a charming, hand-drawn feel",
        "a retro poster art style, with bold typography and a limited, screen-printed color palette"
    ]
};
