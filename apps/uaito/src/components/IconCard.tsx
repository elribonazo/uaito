export const IconCard = ({ icon: Icon, title, description, name, isFeature = true }: any) => (
    isFeature ? (
      <div className="bg-gray-900/80 rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 transform hover:scale-105 border border-purple-500/30">
        <Icon className="w-12 h-12 text-purple-400 mb-4" />
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    ) : (
      <div className="flex flex-col items-center group">
        <div className="relative">
          <Icon className="w-12 h-12 text-purple-400 mb-2 transition-all duration-300 group-hover:text-purple-300" />
          <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        </div>
        <span className="text-sm text-white font-semibold">{name}</span>
      </div>
    )
  );