import { moods, colorSchemes, promptTemplates } from "@/ai/agents/storybook/constants";

interface StoryFormProps {
    kidName: string;
    setKidName: (name: string) => void;
    kidGender: string;
    setKidGender: (gender: string) => void;
    kidLikes: string;
    setKidLikes: (likes: string) => void;
    mood: string;
    setMood: (mood: string) => void;
    colorScheme: string;
    setColorScheme: (scheme: string) => void;
    promptTemplate: string;
    setPromptTemplate: (template: string) => void;
    customPrompt: string;
    setCustomPrompt: (prompt: string) => void;
    printSize: string;
    setPrintSize: (size: string) => void;
    numChapters: number;
    setNumChapters: (chapters: number) => void;
    age: number;
    setAge: (age: number) => void;
}

export const StoryForm: React.FC<StoryFormProps> = ({
    kidName, setKidName, kidGender, setKidGender, kidLikes, setKidLikes,
    mood, setMood, colorScheme, setColorScheme, promptTemplate, setPromptTemplate,
    customPrompt, setCustomPrompt, printSize, setPrintSize, numChapters, setNumChapters,
    age, setAge
}) => {
    return (
        <div className="space-y-6 border-t border-muted pt-6">
            <div className="flex items-center gap-2">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    📖 Customize Your Story
                </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
                Fill in the character's details, and we'll generate a unique story for them!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label
                        htmlFor="kid-name"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>👤</span> Character's Name
                    </label>
                    <input
                        id="kid-name"
                        type="text"
                        value={kidName}
                        onChange={(e) => setKidName(e.target.value)}
                        placeholder="e.g., Alex, Lily, Sam"
                        className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm md:text-base"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="kid-gender"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>🚻</span> Character's Gender
                    </label>
                    <select
                        id="kid-gender"
                        value={kidGender}
                        onChange={(e) => setKidGender(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm md:text-base"
                    >
                        <option value="boy">Boy</option>
                        <option value="girl">Girl</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="kid-likes"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>❤️</span> Character's Interests
                        <span className="text-xs md:text-sm font-normal text-muted-foreground">
                            (comma-separated)
                        </span>
                    </label>
                    <input
                        id="kid-likes"
                        type="text"
                        value={kidLikes}
                        onChange={(e) => setKidLikes(e.target.value)}
                        placeholder="e.g., dinosaurs, space, drawing"
                        className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm md:text-base"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="mood"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>😊</span> Story Mood
                    </label>
                    <select
                        id="mood"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm md:text-base"
                    >
                        {Object.keys(moods).map((moodKey) => (
                            <option key={moodKey} value={moodKey}>
                                {moodKey.charAt(0).toUpperCase() + moodKey.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="style-template"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>🎨</span> Art Style
                    </label>
                    <select
                        id="style-template"
                        value={promptTemplate}
                        onChange={(e) => setPromptTemplate(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm md:text-base"
                    >
                        {Object.keys(promptTemplates).map((templateKey) => (
                            <option key={templateKey} value={templateKey}>
                                {templateKey.replace(/_/g, ' ').charAt(0).toUpperCase() +
                                    templateKey.replace(/_/g, ' ').slice(1)}
                            </option>
                        ))}
                        <option value="custom">Custom Prompt</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="color-scheme"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>🎨</span> Color Scheme
                    </label>
                    <select
                        id="color-scheme"
                        value={colorScheme}
                        onChange={(e) => setColorScheme(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm md:text-base"
                    >
                        {Object.keys(colorSchemes).map((schemeKey) => (
                            <option key={schemeKey} value={schemeKey}>
                                {schemeKey.charAt(0).toUpperCase() + schemeKey.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            
                <div className="space-y-2">
                    <label
                        htmlFor="num-chapters"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>#️⃣</span> Number of Chapters
                    </label>
                    <input
                        id="num-chapters"
                        type="number"
                        value={numChapters}
                        onChange={(e) =>
                            setNumChapters(parseInt(e.target.value, 10))
                        }
                        min="1"
                       
                        className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm md:text-base"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        htmlFor="age-range"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>🧒</span> Target Age: {age} years old
                    </label>
                    <input
                        id="age-range"
                        type="range"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value, 10))}
                        min="6"
                        max="50"
                        step="1"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>
            {promptTemplate === "custom" && (
                <div className="space-y-2 border-t border-muted pt-4">
                    <label
                        htmlFor="custom-prompt"
                        className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2"
                    >
                        <span>⚙️</span> Custom Prompt
                        <span className="text-xs md:text-sm font-normal text-muted-foreground">
                            (Override all settings above)
                        </span>
                    </label>
                    <textarea
                        id="custom-prompt"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Enter your complete custom prompt here..."
                        rows={4}
                        className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none text-sm md:text-base"
                    />
                </div>
            )}
        </div>
    );
};
