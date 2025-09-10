






export const KeyFeatures: React.FC<{features:{title: string, description: string, icon: string}[]}> = ({features}) => (
    <div className="py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 transform translate-y-0 will-change-transform">
        <div className="container mx-auto px-8">
            <h2 className="text-5xl font-bold mb-16 text-center text-white">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-opacity-20">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                        <p className="text-gray-300">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);