export const IconCard = ({ icon: Icon, title, description, name, isFeature = true }: any) => (
    isFeature ? (
      <div className="bg-surface rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 transform hover:scale-105 border border-muted hover:border-accent">
        <Icon className="w-12 h-12 text-accent mb-4" />
        <h3 className="text-xl font-bold mb-2 text-primary-text">{title}</h3>
        <p className="text-secondary-text">{description}</p>
      </div>
    ) : (
      <div className="flex flex-col items-center group">
        <div className="relative">
          <Icon className="w-12 h-12 text-accent mb-2 transition-all duration-300 group-hover:text-teal-400" />
          <div className="absolute inset-0 bg-accent rounded-full filter blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        </div>
        <span className="text-sm text-primary-text font-semibold">{name}</span>
      </div>
    )
  );