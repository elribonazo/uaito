/**
 * ColorPaletteDemo Component
 * 
 * This component displays all theme colors for testing and verification.
 * It's useful for:
 * - Testing theme switching
 * - Verifying color contrast
 * - Simulating color blindness
 * - Design reference
 * 
 * To use: Import and add to any page temporarily for testing
 */

export const ColorPaletteDemo: React.FC = () => {
  const colors = [
    { name: 'Background', className: 'bg-background', textClassName: 'text-primary-text' },
    { name: 'Surface', className: 'bg-surface', textClassName: 'text-primary-text' },
    { name: 'Surface Hover', className: 'bg-surface-hover', textClassName: 'text-primary-text' },
    { name: 'Primary', className: 'bg-primary', textClassName: 'text-white' },
    { name: 'Primary Hover', className: 'bg-primary-hover', textClassName: 'text-white' },
    { name: 'Accent', className: 'bg-accent', textClassName: 'text-white' },
    { name: 'Accent Hover', className: 'bg-accent-hover', textClassName: 'text-white' },
    { name: 'Success', className: 'bg-success', textClassName: 'text-white' },
    { name: 'Warning', className: 'bg-warning', textClassName: 'text-white' },
    { name: 'Error', className: 'bg-error', textClassName: 'text-white' },
    { name: 'Muted', className: 'bg-muted', textClassName: 'text-primary-text' },
  ];

  const textColors = [
    { name: 'Primary Text', className: 'text-primary-text' },
    { name: 'Secondary Text', className: 'text-secondary-text' },
    { name: 'Tertiary Text', className: 'text-tertiary-text' },
  ];

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-primary-text mb-2">Theme Color Palette</h1>
        <p className="text-secondary-text mb-6">
          Switch between light and dark modes to see all color variations
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-primary-text mb-4">Background Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="space-y-2">
              <div
                className={`${color.className} ${color.textClassName} p-6 rounded-lg border border-border flex items-center justify-center h-24 transition-all`}
              >
                <span className="font-medium text-sm">{color.name}</span>
              </div>
              <code className="text-xs text-tertiary-text block text-center">
                {color.className}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text mb-4">Text Colors</h2>
        <div className="bg-surface p-6 rounded-lg border border-border space-y-3">
          {textColors.map((color) => (
            <div key={color.name} className="flex items-center gap-4">
              <code className="text-xs text-tertiary-text w-40">{color.className}</code>
              <p className={color.className}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text mb-4">Interactive Elements</h2>
        <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
          <div className="flex flex-wrap gap-3">
            <button type="button" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors">
              Primary Button
            </button>
            <button type="button" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors">
              Accent Button
            </button>
            <button type="button" className="bg-surface hover:bg-surface-hover text-primary-text border border-border px-4 py-2 rounded-lg transition-colors">
              Secondary Button
            </button>
          </div>

          <div className="space-y-2">
            <div className="bg-success/10 border border-success/20 text-success p-3 rounded-lg">
              ✓ Success message - Operation completed successfully
            </div>
            <div className="bg-warning/10 border border-warning/20 text-warning p-3 rounded-lg">
              ⚠ Warning message - Please review this action
            </div>
            <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg">
              ✕ Error message - Something went wrong
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text mb-4">Borders</h2>
        <div className="space-y-3">
          <div className="p-4 border border-border rounded-lg bg-surface">
            <p className="text-primary-text">Default border</p>
          </div>
          <div className="p-4 border border-border-light rounded-lg bg-surface">
            <p className="text-primary-text">Light border</p>
          </div>
          <div className="p-4 border-2 border-primary rounded-lg bg-surface">
            <p className="text-primary-text">Primary border (focus state)</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary-text mb-4">Color Blindness Simulation</h2>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <p className="text-secondary-text mb-4">
            To test color-blind accessibility, use browser DevTools:
          </p>
          <ol className="list-decimal list-inside text-secondary-text space-y-2 ml-4">
            <li>Open Chrome/Edge DevTools (F12)</li>
            <li>Press Cmd/Ctrl + Shift + P</li>
            <li>Type "Rendering" and select "Show Rendering"</li>
            <li>Scroll to "Emulate vision deficiencies"</li>
            <li>Test: Protanopia, Deuteranopia, Tritanopia, Achromatopsia</li>
          </ol>
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-primary font-medium">
              ✓ Blue and orange remain distinguishable in all color-blind simulations
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

