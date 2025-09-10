

export const Testimonial = ({ quote, author, company }) => (
    <div className="testimonial-card bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-opacity-20">
        <p className="text-xl italic mb-6 text-gray-200">{quote}</p>
        <p className="font-bold text-white">{author}</p>
        <p className="text-gray-300">{company}</p>
    </div>
);


export const TestimonialSection = () => (
    <div id="testimonials" className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 transform translate-y-0 will-change-transform">
        <div className="container mx-auto px-8">
            <h2 className="text-5xl font-bold mb-16 text-center text-white">What Our Users Say</h2>
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