

export const Testimonial = ({ quote, author, company }) => (
    <div className="bg-surface border border-muted p-8 rounded-xl shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:border-accent">
        <p className="text-xl italic mb-6 text-secondary-text">"{quote}"</p>
        <p className="font-bold text-primary-text">{author}</p>
        <p className="text-accent">{company}</p>
    </div>
);


export const TestimonialSection = () => (
    <div id="testimonials" className="py-24 bg-background">
        <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold mb-16 text-center text-primary-text">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Testimonial
                    quote="I'm already using UAITO almost on a daily basis for simple tasks or things I don't want to remember or do anymore myself. Results really exceeded my own expectations!"
                    author="JR"
                    company="Founder of UAITO"
                />
                <Testimonial
                    quote="The level of automation and intelligence in UAITO's tools is unmatched. It's like having an entire team of experts at your fingertips."
                    author="Tony"
                    company="InnovateNow"
                />
                <Testimonial
                    quote="UAITO has been a game-changer for our projects. The AI-assisted coding and debugging features have significantly reduced our time-to-market."
                    author="Lisa Garcia"
                    company="FutureTech Solutions"
                />
            </div>
        </div>
    </div>
);