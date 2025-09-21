import Image from 'next/image';

export const Card = ({ variant, title, description, imageUrl, name, role, company, quote }: any) => {
    switch (variant) {
      case 'project':
        return (
          <div className="bg-surface rounded-xl overflow-hidden border border-muted transition-all duration-300 hover:shadow-lg hover:border-accent">
            <Image src={imageUrl} alt={title} width={400} height={225} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary-text mb-2">{title}</h3>
              <p className="text-secondary-text">{description}</p>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="text-center">
            <Image src={imageUrl} alt={name} width={150} height={150} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="text-lg font-semibold text-primary-text">{name}</h3>
            <p className="text-accent">{role}</p>
            <p className="text-xs text-secondary-text">{quote}</p>
          </div>
        );
      case 'testimonial':
        return (
          <div className="bg-surface rounded-xl p-6 border border-muted">
            <p className="text-secondary-text mb-4">"{quote}"</p>
            <p className="text-primary-text font-semibold">{name}</p>
            <p className="text-accent">{company}</p>
          </div>
        );
      default:
        return null;
    }
  };