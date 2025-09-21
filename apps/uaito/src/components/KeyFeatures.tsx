






export const KeyFeatures: React.FC<{features:{title: string, description: string, icon: string}[]}> = ({features}) => (
    <div className="py-24 bg-background">
        <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold mb-16 text-center text-primary-text">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-surface border border-muted p-6 rounded-xl shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:border-accent">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-2xl font-bold mb-4 text-primary-text">{feature.title}</h3>
                        <p className="text-secondary-text">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);