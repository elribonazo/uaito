'use client'
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]';
import SpaceBackground from '@/components/SpaceBackground';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';
import { AnimatedText } from '@/components/AnimatedText';
import { TokenCounter } from '@/components/TokenCounter';
import { useMountedApp } from '@/redux/store';
import { signOut } from 'next-auth/react';
import { ArrowRightEndOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ModelSelector } from '@/components/ModelSelector';
import { LLMProvider } from '@uaito/sdk';
import { initializeProvider, setProvider, setSelectedModel } from '@/redux/userSlice';
import { useDispatch } from 'react-redux';

const InputComponent = dynamic(() => import('@/components/InputComponent'), {
  ssr: false,
});

const Provider = dynamic(() => import('@/components/Provider'), {
  ssr: false,
});

const Chat: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const dispatch = useDispatch();
  const agent = 'orquestrator';
  const [selectedModel, setSelectedModelState] = useState<string>('');
  const { user: { provider, downloadProgress, usage }} = useMountedApp()
  const webGPU = provider === LLMProvider.Local || provider === LLMProvider.LocalImage;
  const isDownloading = webGPU && downloadProgress !== null && downloadProgress < 100;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch(initializeProvider());
  }, [dispatch]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleProviderSelect = (selectedProvider: LLMProvider) => {
    dispatch(setProvider(selectedProvider));
  };

  const handleModelSelect = (model: string) => {
    setSelectedModelState(model);
    dispatch(setSelectedModel(model));
  };

  return <div className={`bg-gray-900 transition-colors duration-300`}>
    <SpaceBackground />
   
      {
        loaded && <>
        <header className="shadow-sm flex h-[48px] sticky z-50 items-center justify-between">
        <h1 className="ml-5 text-2xl  font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          <Link href="/"><AnimatedText /></Link>
        </h1>
        <div className="flex-grow"></div>
        <div className='flex items-center space-x-3 mr-4'>
        {isDownloading && (
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">Downloading Model:</span>
              <div className="w-32 bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${downloadProgress}%` }}></div>
              </div>
              <span className="text-white text-sm">{downloadProgress}%</span>
            </div>
          )}
          <TokenCounter input={usage.input} output={usage.output} />
          {provider && <Provider value={provider} onSelected={handleProviderSelect} />}
          <ModelSelector onSelected={handleModelSelect} />
          <div className="pt-3 ">
            <Link
              href={"/dashboard"}
              className="bg-opacity-90 bg-gray-300 hover:bg-gray-700 text-white font-bold p-2 rounded transition duration-300 flex items-center justify-center"
            >
              <UserIcon className="text-gray-900 h-5 w-5" />
            </Link>
          </div>
          <div className="pt-3 ">
            <button
              onClick={() => signOut()}
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white  p-2 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
  
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {provider && <InputComponent agent={agent} provider={provider} model={selectedModel} />}
        <ToastContainer
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
        />
      </main>
        </>
      }
    
      
  
  </div>
};



export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  return {
    props: {
    }
  }
}

export default Chat