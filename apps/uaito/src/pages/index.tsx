import React, { useEffect, useState, useCallback } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { AnimatedText } from '@/components/AnimatedText';
import { FeatureSection } from '@/components/FeaturedSection';
import { FadeInSection } from '@/components/ClientSideComponents';
import { Card } from '@/components/Card';
import Footer from '@/components/Footer';
import { KeyFeatures } from '@/components/KeyFeatures';
import { MobileMenu } from '@/components/MobileMenu';
import { TestimonialSection } from '@/components/Testimonial';
import { ParallaxBanner } from '@/components/ParallaxBanner';
import { useThrottle } from '@/hooks/useThrottle';



const Home: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({pageProps:{ features, chats }}) => {
    const [isDesktop, setIsDesktop] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const acceptedTerms = true;
    const handleResize = useThrottle(() => {
        setIsDesktop(window.innerWidth >= 1024);
    }, 200);
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    return (
        <ParallaxProvider>
            <style jsx>{`
                .testimonial-card {
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                }
                .testimonial-card:hover {
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.6);
                }
            `}</style>
            <nav className="fixed z-40 top-4 flex h-20 w-full">
                <div className="relative flex items-center justify-between m-auto rounded-full p-2 transition bg-gray-900 w-11/12 lg:w-auto">
                    <Link href="/" className="pl-4">
                        <div className="flex gap-3 items-center">
                            <Image
                                src="/UAITO.png"
                                alt="UAITO Logo"
                                width={25}
                                height={0}
                                style={{ height: 'auto', width: '25px' }}
                                className="animate-subtle-bounce"
                                priority
                            />
                            {isDesktop && <span className="uppercase font-bold text-black tracking-wider text-[20px] -mb-[4px]">
                                <AnimatedText />
                            </span>}
                        </div>
                    </Link>
                    {isDesktop ? (
                        <>
                            <div className="hidden lg:flex px-12 gap-12">
                                <Link href="#features" className="text-neutral-200 hover:underline hover:text-neutral-600">Features</Link>
                                <Link href="#testimonials" className="text-neutral-200 hover:underline hover:text-neutral-600">Testimonials</Link>
                                <Link href="#ourteam" className="text-neutral-200 hover:underline hover:text-neutral-600">Our team</Link>
                                <Link href="#faqs" className="text-neutral-200 hover:underline hover:text-neutral-600">Faqs</Link>

                            </div>
                            <div className="hidden grow basis-0 justify-end lg:flex">
                                <Link href={"/dashboard"} className={`ml-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-green-500/50 ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => !acceptedTerms && e.preventDefault()}>
                                    Beta access
                                </Link>
                            </div>
                        </>
                    ) : (
                        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-neutral-200 hover:text-neutral-600">
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </nav>
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} acceptedTerms={acceptedTerms} />
            <ParallaxBanner />

            <div id="features">
                <KeyFeatures features={features} />
            </div>
            <FeatureSection
                title="Examples"
                chats={chats}
            />

            <FadeInSection>
                <TestimonialSection />
            </FadeInSection>

            <FadeInSection>
                <section className="py-24 px-4 z-10 transform translate3d(0, 0, 0) fade-in">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-5xl font-bold text-center text-white mb-16 font-orbitron">Some preview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <Card
                                variant="project"
                                title="Beautifull code editor"
                                description="With support for almost all the languages, easy to read, copy and has an advanced search functionality."
                                imageUrl="/search.png"
                            />
                            <Card
                                variant="project"
                                title="Completely customizable"
                                description="Advanced and enterprise users can use their own AI tools + models."
                                imageUrl="/config.png"
                            />
                            <Card
                                variant="project"
                                title="Precise subscription invoicing"
                                description="Get through with your subscription limits or purchase higher limits to run tasks that are more complex, or longer."
                                imageUrl="/input.png"
                            />
                        </div>
                    </div>
                </section>
            </FadeInSection>

            <FadeInSection>
                <section id="ourteam" className="py-24 px-4 bg-gray-800/80 z-10 transform translate3d(0, 0, 0) fade-in">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-5xl font-bold text-center text-white mb-16 font-orbitron">Our Team</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 justify-center">
                            <Card
                                variant="team"
                                name="JR"
                                role="Founder"
                                imageUrl="https://picsum.photos/seed/team1/150/150"
                            />

                            <Card
                                variant="team"
                                name="RM"
                                role="Founder"
                                imageUrl="https://picsum.photos/seed/team2/150/150"
                            />

                            <div className="flex flex-col items-center justify-center bg-gray-900/80 rounded-lg p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 transform hover:scale-105 border border-purple-500/30">
                                <span className="text-6xl mb-4">?</span>
                                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                                    Join Us
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeInSection>


            <FadeInSection>
                <section id="faqs" className="py-24 px-4 z-10 transform translate3d(0, 0, 0) fade-in">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-5xl font-bold text-center text-white mb-16 font-orbitron">Frequently Asked Questions</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2">What is UAITO and how it works?</h3>
                                <p className="text-gray-300">UAITO combines AI and machine learning to offer you a feature complete AI Orquestrator through a subscription based service.</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2">What is an AI Orquestrator?</h3>
                                <p className="text-gray-300">
                                    An AI Orchestrator is a system or framework responsible for coordinating, managing, and integrating various AI tools, models, and components within an organization or a complex AI ecosystem. It acts as a central control mechanism that ensures different AI elements work together effectively and efficiently.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2">What can I build with UAITO?</h3>
                                <p className="text-gray-300">UAITO is designed to seamlessly integrate with your existing workflows. We provide plugins and APIs to ensure UAITO fits smoothly into your existing processes bringing AI and automated decision making into the pipe.</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2">How do I download the desktop app?</h3>
                                <p className="text-gray-300">We offer a fully capable desktop application which u can download once you login into your account, u will find more details in /dashboard page.</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2">Where Do I get my own UAITO API Key?</h3>
                                <p className="text-gray-300">Once you are logged into your account, u can click in the eye icon to disclose the APIKey. Then you can use that key inside your custom project or inside the Desktop application.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            <FadeInSection>

                <div className="flex items-center justify-center h-screen bg-gray-900">
                    <h1 className="font-sans font-thin text-[6vw] text-white text-center px-4">
                        Unlimited posibilities, contact us to build you a custom solution for your needs!
                    </h1>
                </div>
            </FadeInSection>

            <Footer />
        </ParallaxProvider>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const features = [
    { title: "AI-powered Chat", description: "Engage in intelligent conversations with our advanced AI interface", icon: "💬" },
    { title: "Automated Tasks", description: "Streamline complex engineering processes with AI assistance", icon: "🤖" },
    { title: "Desktop App", description: "Access powerful tools through our Electron-based application", icon: "💻" },
    { title: "Built-in Code Editor", description: "With easy copy-paste and advanced search functionality", icon: "📝" }
  ];

  const chats = [
    {
      visibleContent: [],
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Search for the weather broadcast for 25th of August of 2024 till the 28th in Barcelona, Spain"
        }
      ]
    },
    {
      visibleContent: [],
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "Certainly! I'll use the Tavily search tool to find the weather forecast for Barcelona, Spain from August 25th to August 28th, 2024. Since this is a future date, we'll need to rely on long-term forecasts or climate averages, which may not be as accurate as short-term predictions."
        }
      ]
    },
    {
      visibleContent: [],
      "role": "user",
      "content": [
        {
          "name": "tavilySearch",
          "type": "tool_result",
          "tool_use_id": "toolu_01W5MUAs41L1gfsFF5v5Vz6V",
          "content": [
            {
              "type": "text",
              "text": `The weather forecast for Barcelona, Spain from August 25-28, 2024, indicates partly cloudy conditions with temperatures around 26-27°C during the day and 22-23°C at night. There is no significant precipitation expected during this period. The wind speed will be around 3.6-7.7 km/h. The average sea temperature in Barcelona in August is around 25.3°C.${(new Array(10).fill(' ').join(" "))}`
            },
            {
              "type": "text",
              "text": "Image https://www.barcelonayellow.com/images/stories/barcelona_weather/barcelona_weather_average_temperatures.gif\r\n"
            },
            {
              "type": "text",
              "text": "Image https://www.vickiviaja.com/wp-content/uploads/2021/04/temperatures-bcn-fahrenheit.jpg\r\n"
            },
            {
              "type": "text",
              "text": "Image https://www.wetter2.com/images/month/Barcelona-in-August.jpeg\r\n"
            },
            {
              "type": "text",
              "text": "Image https://cdn.hikb.at/charts/meteo-average-weather-weekly/barcelona-meteo-average-weather-weekly.png\r\n"
            },
            {
              "type": "text",
              "text": "Image https://www.yourweather.co.uk/wimages/foto5e472ce72bdbfed0238acb95e9f6020a.png\r\n"
            }
          ]
        }
      ]
    },
    {
      visibleContent: [],
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "\r\nBased on the search results, I can provide you with the following weather forecast for Barcelona, Spain from August 25th to August 28th, 2024:\r\n1. Temperature:\n   - Daytime highs: Around 26-27°C (79-81°F)\n   - Nighttime lows: Around 22-23°C (72-73°F)\r\n2. Sky conditions: Partly cloudy\r\n3. Precipitation: No significant rainfall is expected during this period.\r\n4. Wind: Light breeze with speeds around 3.6-7.7 km/h (2.2-4.8 mph)\r\n5. Sea temperature: The average sea temperature in Barcelona in August is typically around 25.3°C (77.5°F)\r\nPlease note that this forecast is based on long-term climate data and averages, as it's for a date more than a year in the future. Actual weather conditions may vary as the date approaches. It's always a good idea to check for updated forecasts closer to your travel date for more accurate information.\r\nGenerally, late August in Barcelona tends to be warm and pleasant, perfect for enjoying the city and its beaches. The weather is typically stable during this time of year, with low chances of rain and comfortable temperatures for outdoor activities."
        }
      ]
    },
    {
      visibleContent: [],
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "I want you to create a table with the data on each day individually and then store the results in a file called tiempo.txt"
        }
      ]
    },
    {
      visibleContent: [],
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "Certainly! I'll create a table with the weather data for each day individually from August 25th to August 28th, 2024, for Barcelona, Spain. Then, I'll store this information in a file called \"tiempo.txt\". \r\nFirst, let's create the content for the file:"
        }
      ]
    },
    {
      visibleContent: [],
      "role": "user",
      "content": [
        {
          "name": "createFile",
          "type": "tool_result",
          "isError": false,
          "tool_use_id": "toolu_011zh62X6XTxePsB8vJgQhth",
          "content": [
            {
              "type": "text",
              "text": `File created successfully!${(new Array(10).fill(' ').join(" "))}`
            }
          ]
        }
      ]
    },
    {
      visibleContent: [],
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "\r\nI've created a file named \"tiempo.txt\" with a table containing the weather forecast for Barcelona, Spain from August 25th to August 28th, 2024. The file has been successfully created with the following content:\r\n1. A table showing the daily forecast for each day, including:\n   - Date\n   - Day High temperature (in both Celsius and Fahrenheit)\n   - Night Low temperature (in both Celsius and Fahrenheit)\n   - Sky Conditions\n   - Wind Speed\n   - Sea Temperature (average for August)\r\n2. A note explaining that the forecast is based on long-term climate data and averages, and actual conditions may vary.\r\n3. Additional information about the expected weather conditions during this period.\r\nThe file has been saved in the current working directory. You can now access this information by opening the \"tiempo.txt\" file. If you need to make any changes or if you'd like to view the contents of the file, please let me know, and I'll be happy to help."
        }
      ]
    }
  ];

  return {
    props: {
      features,
      chats,
    },
  };
};

export default Home;
