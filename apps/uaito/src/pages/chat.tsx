'use client'
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]';
import SpaceBackground from '@/components/SpaceBackground';
import dynamic from 'next/dynamic';
import { UserSession } from '@/redux/userSlice';
import { ToastContainer } from 'react-toastify';
import Stripe from 'stripe';
import { AnimatedText } from '@/components/AnimatedText';
import { TokenCounter } from '@/components/TokenCounter';
import { useMountedApp } from '@/redux/store';
import { signOut } from 'next-auth/react';
import { ArrowRightEndOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { AgentSelector } from '@/components/AgentSelector';
import Provider from '@/components/Provider';
import { LLMProvider } from '@uaito/sdk';

const InputComponent = dynamic(() => import('@/components/InputComponent'), {
  ssr: false,
});

const Chat: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const app = useMountedApp();
  const [agent, setAgent] = useState<string>('orquestrator')
  const [provider, setProvider] = useState<LLMProvider>(LLMProvider.HuggingFaceONNX)
  return <div className={`bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
    <SpaceBackground />
   
      <header className="shadow-sm flex h-[48px] sticky z-50 items-center justify-between">
        <h1 className="ml-5 text-2xl  font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          <AnimatedText />
        </h1>
        <div className="flex-grow"></div>
        <div className='flex items-center space-x-3 mr-4'>
          <TokenCounter input={app.user.usage.input} output={app.user.usage.output} />
          <Provider onSelected={(p) => setProvider(p)} />
          <AgentSelector onSelected={(agent) => {
            setAgent(agent.toLowerCase())
          }}/>
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
              className="bg-red-600 hover:bg-red-700 text-white  p-2 rounded transition duration-300 flex items-center justify-center"
            >
              <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
  
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InputComponent agent={agent} provider={provider} />
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
    
      
  
  </div>
};



export async function getServerSideProps(context: GetServerSidePropsContext) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
  })
  const session = await getServerSession<any, UserSession>(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }
  const customers = await stripe.customers.list({
    email: session.user?.email,
    limit: 1
  })

  if (customers.data.length > 0) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length > 0) {
      return {
        props: {
          subscription: subscriptions.data[0]
        }
      }
    }
  }

  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  }
}

export default Chat