import { ParallaxProvider } from 'react-scroll-parallax';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { FeatureSection } from '@/components/FeaturedSection';
import { FadeInSection } from '@/components/ClientSideComponents';
import { Card } from '@/components/Card';
import Footer from '@/components/Footer';
import { KeyFeatures } from '@/components/KeyFeatures';
import { TestimonialSection } from '@/components/Testimonial';
import { ParallaxBanner } from '@/components/ParallaxBanner';
import { Header } from '@/components/Header';



const Home: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({pageProps:{ features, chats }}) => {
    return (
        <ParallaxProvider>
            <Header />
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
                <section className="py-24 px-4 z-10">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-primary-text mb-16">Some preview</h2>
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
                                title="Precise usage tracking"
                                description="Track your usage and stay within your limits."
                                imageUrl="/input.png"
                            />
                        </div>
                    </div>
                </section>
            </FadeInSection>


            <FadeInSection>
                <section id="faqs" className="py-24 px-4 z-10">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-primary-text mb-16">Frequently Asked Questions</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-semibold text-primary-text mb-2">What is UAITO and how it works?</h3>
                                <p className="text-secondary-text">UAITO combines AI and machine learning to offer you a feature complete AI Orquestrator.</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-primary-text mb-2">What is an AI Orquestrator?</h3>
                                <p className="text-secondary-text">
                                    An AI Orchestrator is a system or framework responsible for coordinating, managing, and integrating various AI tools, models, and components within an organization or a complex AI ecosystem. It acts as a central control mechanism that ensures different AI elements work together effectively and efficiently.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-primary-text mb-2">What can I build with UAITO?</h3>
                                <p className="text-secondary-text">UAITO is designed to seamlessly integrate with your existing workflows. We provide plugins and APIs to ensure UAITO fits smoothly into your existing processes bringing AI and automated decision making into the pipe.</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-primary-text mb-2">How do I download the desktop app?</h3>
                                <p className="text-secondary-text">We offer a fully capable desktop application which u can download once you login into your account, u will find more details in /dashboard page.</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-primary-text mb-2">Where Do I get my own UAITO API Key?</h3>
                                <p className="text-secondary-text">Once you are logged into your account, u can click in the eye icon to disclose the APIKey. Then you can use that key inside your custom project or inside the Desktop application.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            <FadeInSection>
                <div className="flex items-center justify-center h-screen bg-surface">
                    <h1 className="font-sans font-thin text-5xl text-primary-text text-center px-4">
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
