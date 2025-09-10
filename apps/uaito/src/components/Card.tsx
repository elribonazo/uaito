import Image from 'next/image';

export const Card = ({ variant, title, description, imageUrl, name, role, company, quote }: any) => {
    switch (variant) {
      case 'project':
        return (
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <Image src={imageUrl} alt={title} width={400} height={225} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-300">{description}</p>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="text-center">
            <Image src={imageUrl} alt={name} width={150} height={150} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <p className="text-purple-300">{role}</p>
            <p className="text-xs text-purple-300">{quote}</p>
          </div>
        );
      case 'testimonial':
        return (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <p className="text-gray-300 mb-4">"{quote}"</p>
            <p className="text-white font-semibold">{name}</p>
            <p className="text-purple-300">{company}</p>
          </div>
        );
      default:
        return null;
    }
  };