# AI Story-Based Image Generation System

## Overview
A comprehensive system for generating personalized AI drawings from user photos with extensive story-based customization. Perfect for creating printable illustrations that match specific narratives.

## Features

### 1. Image Upload
- **Drag & Drop**: Drop images directly onto the upload zone
- **File Browser**: Choose files from your computer
- **Camera Capture**: Take photos directly from your device camera
- **Preview**: See your uploaded image before generation

### 2. Story Customization Fields

#### Core Story Elements
- **Story Title**: Give your story a name
- **Story Description**: Describe the main plot, theme, or adventure
- **Character Details**: Describe the protagonist's appearance, personality, and traits
- **Setting & Background**: Define where the story takes place (e.g., magical forest, space station)
- **Additional Elements**: Add props, companions, or special objects

#### Visual Style Options

**Art Styles**:
- Cartoon - Vibrant & Fun
- Pencil Sketch - Artistic detail
- Watercolor - Soft & beautiful
- Comic Book - Bold & dynamic
- Anime Style - Large expressive eyes
- Disney/Pixar - Magical animation style
- Chibi/Cute - Oversized head, tiny body
- Line Art - Clean & simple
- Pop Art - Bold colors
- Vintage - Retro classic style
- Custom Prompt - Complete control

**Mood/Atmosphere**:
- Happy & Joyful
- Adventurous
- Magical
- Peaceful
- Heroic
- Mysterious
- Playful

**Color Schemes**:
- Vibrant Colors - Bright, saturated, high contrast
- Pastel Tones - Soft, muted, gentle
- Warm Palette - Reds, oranges, yellows
- Cool Palette - Blues, greens, purples
- Black & White - Monochrome
- Neon Colors - Vibrant glowing effects
- Natural/Earthy - Organic tones

**Print Formats**:
- Poster (Large)
- Book Illustration
- Greeting Card
- Wall Frame
- Canvas Print

### 3. Smart Prompt Generation

The system automatically combines all your inputs into a comprehensive AI prompt:

```
Create a [art style]
for a story titled "[title]"
Story context: [description]
Character details: [character description]
Setting: [setting/background]
Mood: [mood atmosphere]
Color palette: [color scheme]
Additional elements: [props/companions]
Optimized for [print size] printing with high quality details
suitable for professional printing and framing.
```

### 4. Generated Image Display

- High-quality 1024x1024 image generation
- AI-revised prompt display (shows how DALL-E interpreted your request)
- Download button for saving the image
- Print-ready format
- Professional quality suitable for framing

## API Endpoint

### `/api/openai/image_edit`

**Method**: POST

**Request Body**:
```json
{
  "prompt": "Complete story-based prompt...",
  "size": "1024x1024"
}
```

**Response**:
```json
{
  "success": true,
  "images": [
    {
      "url": "https://...",
      "revised_prompt": "AI-enhanced prompt..."
    }
  ]
}
```

**Features**:
- Authentication required (uses session)
- CORS enabled
- 10MB body size limit
- Uses OpenAI's DALL-E 3 model
- Error handling with detailed messages

## Usage Examples

### Example 1: Children's Book Character
```
Title: "Luna's Moon Adventure"
Description: "A brave little girl travels to the moon to save her lost teddy bear"
Character: "Young girl with curly red hair, wearing a silver spacesuit with star patches"
Setting: "Colorful moon surface with cheese craters and starry sky"
Elements: "Floating teddy bear, rocket ship, moon cheese"
Style: Disney/Pixar
Mood: Adventurous
Colors: Vibrant
Format: Book Illustration
```

### Example 2: Fantasy Hero
```
Title: "The Dragon Keeper"
Description: "A young knight who befriends dragons instead of fighting them"
Character: "Teenage knight with kind eyes, blue armor with dragon emblems"
Setting: "Mystical mountain top with crystal caves and dragon nests"
Elements: "Baby dragons, magical sword, glowing gems"
Style: Anime
Mood: Magical
Colors: Cool Palette
Format: Poster
```

### Example 3: Educational Content
```
Title: "Tommy's Time Machine"
Description: "Learning about history through time travel adventures"
Character: "Curious boy with glasses and inventor's backpack"
Setting: "Ancient Egypt with pyramids and hieroglyphics"
Elements: "Time machine watch, scroll, friendly cat"
Style: Cartoon
Mood: Playful
Colors: Warm Palette
Format: Book Illustration
```

## Technical Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI DALL-E 3
- **Authentication**: NextAuth.js
- **Database**: MongoDB (for user sessions and usage tracking)

## File Structure

```
apps/uaito/src/
├── pages/
│   ├── test.tsx                        # Main UI with story customization
│   └── api/
│       └── openai/
│           └── image_edit.ts           # Image generation API endpoint
```

## Benefits

1. **Story-Driven**: Perfect for authors, educators, and content creators
2. **Highly Customizable**: Extensive options for personalization
3. **Print-Ready**: Optimized for professional printing
4. **User-Friendly**: Intuitive interface with real-time prompt preview
5. **Professional Quality**: Uses DALL-E 3 for high-quality output
6. **Flexible**: Works for children's books, educational materials, gifts, and more

## Future Enhancements

- [ ] Save and load story templates
- [ ] Multiple image generation (series/sequence)
- [ ] Direct editing of generated images
- [ ] Community gallery of generated stories
- [ ] Export to PDF with multiple pages
- [ ] Social media sharing
- [ ] Collaborative story building

## Getting Started

1. Navigate to `/test` page
2. Upload a photo or take one with your camera
3. Fill in the story details
4. Choose your visual preferences
5. Click "Generate AI Drawing"
6. Download your personalized illustration!

## Notes

- Requires OPENAI_API_KEY environment variable
- User must be authenticated
- Generation typically takes 10-30 seconds
- Images are temporary (not stored on server)
- Download immediately after generation

