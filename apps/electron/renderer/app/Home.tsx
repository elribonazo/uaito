import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedText } from './components/AnimatedText';
import SpaceBackground from './components/SpaceBackground';
import yourkey from './assets/yourkey.png'

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
            <SpaceBackground />

      <main className="z-30 flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
        Quick start <AnimatedText />

        </h1>
        <p className="mt-3 text-2xl">
          Follow this 3 steps and all setup!
        </p>
        <ol className='mt-8 text-left'>
          <li className='my-3'>1. First, copy your account api key by logging into your dashboard.<br />
            <img src={yourkey} alt="" />
          </li>
            <li className='my-3'>2. Access this application top menu, click "Configuration" -> "View"</li>
            <li className='my-3'>3. Paste your APIKEY</li>
        </ol>
        <p className="mt-4 text-xl">
          Our premium service harnesses the power of AI to revolutionize your development process.
          Simply select a folder, and let our intelligent system do the rest!
        </p>
      

            <Link to="/config" className="m-5 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
              Configuration
            </Link> 

            <Link to="/chat" className="m-5 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
              Chat now
            </Link> 
      </main>
    </div>
  );
};

export default Home;