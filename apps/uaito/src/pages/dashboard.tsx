import React, { useState, useEffect, useCallback, FC } from 'react';
import { ComputerDesktopIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth/next"
import { useSession, signOut } from "next-auth/react";
import { AnimatedText } from '../components/AnimatedText';
import SpaceBackground from '../components/SpaceBackground';
import Authenticate from '@/components/Authenticate';
import { authOptions } from './api/auth/[...nextauth]';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { type IUsage, UsageModel } from '../db/models/Usage';
import { UserModel } from '../db/models/User';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment-timezone';
import { type TooltipProps } from 'recharts';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header: FC = () => (
  <header className="w-full text-center mb-6">
    <h1 className="text-3xl md:text-4xl font-bold">
      <AnimatedText />
    </h1>
  </header>
);

const WelcomeSection: FC<{ email: string }> = ({ email }) => (
  <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
    <h2 className="text-xl font-semibold text-primary-text">Welcome back, {email}!</h2>
    <button
      type="button"
      onClick={async () => {
        // Sign out from NextAuth first, then redirect to Keycloak logout
        await signOut({ redirect: false });
        // Redirect to a logout endpoint that will handle Keycloak logout
        window.location.href = '/api/auth/logout-keycloak';
      }}
      className="bg-surface hover:bg-red-500/10 text-secondary-text hover:text-red-400 border border-border hover:border-red-500/30 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
    >
      Sign Out
    </button>
  </div>
);

const processHourlyData = (usage: IUsage[]) => {
  const userTimezone = moment.tz.guess();
  const today = moment().tz(userTimezone).startOf('day');
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    input: 0,
    output: 0
  }));

  usage.forEach(entry => {
    const entryDate = moment(entry.createdAt).tz(userTimezone);
    if (entryDate.isSameOrAfter(today)) {
      const hour = entryDate.hour();
      hourlyData[hour].input += entry.input;
      hourlyData[hour].output += entry.output;
    }
  });

  return hourlyData;
};

const processDailyData = (usage: IUsage[]) => {
  const userTimezone = moment.tz.guess();
  const dailyData = usage.reduce((acc, entry) => {
    const date = moment(entry.createdAt).tz(userTimezone).format('YYYY-MM-DD');
    const existingEntry = acc.find(item => item.date === date);
    if (existingEntry) {
      existingEntry.input += entry.input;
      existingEntry.output += entry.output;
    } else {
      acc.push({ date, input: entry.input, output: entry.output });
    }
    return acc;
  }, [] as { date: string; input: number; output: number }[]);

  return dailyData.sort((a, b) => moment(a.date).diff(moment(b.date)));
};

const hasMultipleDaysData = (usage: IUsage[]): boolean => {
  if (usage.length === 0) return false;
  const uniqueDays = new Set(usage.map(entry => new Date(entry.createdAt).toDateString()));
  ;
  return uniqueDays.size > 1;
};

const CustomLegend: FC<{ payload?: any[], todayTotals: {input: number, output: number} | null, type: 'today' | '30d' }> = ({ payload, todayTotals, type }) => {
    if (type !== 'today' || !todayTotals) return <Legend />;
    
    return (
      <ul className="recharts-default-legend" style={{ padding: 0, margin: 0, textAlign: 'center' }}>
        {payload?.map((entry: any) => (
          <li key={entry.value} style={{ display: 'inline-block', marginRight: 10 }}>
            <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} aria-hidden="true">
              <path fill="none" stroke={entry.color} strokeWidth="4" d="M0,16h32" />
            </svg>
            <span style={{ color: entry.color }}>
              {entry.value} ({entry.dataKey === 'input' ? todayTotals.input : todayTotals.output})
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const CustomTooltip: FC<TooltipProps<number, string>> = ({ active, payload, label }:any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-surface p-2 rounded shadow-lg border border-muted">
          <p className="label text-sm text-primary-text">{`Time: ${label}`}</p>
          {payload.map((pld) => (
            <p key={pld.dataKey} style={{ color: pld.color }} className="text-sm">
              {`${pld.name}: ${pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ActiveDot: FC<{cx?: number, cy?: number, stroke?: string}> = (props) => {
    const { cx, cy, stroke } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={stroke} />
        <circle cx={cx} cy={cy} r={8} fill={stroke} fillOpacity={0.2} />
      </g>
    );
  };

const UsageGraph: React.FC<{ usage: IUsage[]; type: 'today' | '30d' }> = ({ usage, type }) => {
  const data = type === 'today' ? processHourlyData(usage) : processDailyData(usage);

  // Calculate totals for today
  const todayTotals = type === 'today' ? data.reduce(
    (acc, hour) => ({
      input: acc.input + hour.input,
      output: acc.output + hour.output
    }),
    { input: 0, output: 0 }
  ) : null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey={type === 'today' ? 'hour' : 'date'}
          tickFormatter={type === 'today' 
            ? (hour: number) => hour === 23 ? '24:00' : hour.toString().padStart(2, '0') + ':00'
            : (date) => moment(date).format('MM/DD')}
          stroke="#888"
          axisLine={{ stroke: '#888' }}
          tickLine={{ stroke: '#888' }}
        />
        <YAxis 
          stroke="#888"
          axisLine={{ stroke: '#888' }}
          tickLine={{ stroke: '#888' }}
        />
        <Tooltip 
          content={<CustomTooltip />}
          labelFormatter={type === 'today'
            ? (hour: number) => {
                const start = hour.toString().padStart(2, '0') + ':00';
                const end = hour === 23 ? '23:59' : (hour + 1).toString().padStart(2, '0') + ':00';
                return `${start} - ${end}`;
              }
            : (date) => moment(date).format('YYYY-MM-DD')}
        />
        <Legend content={<CustomLegend todayTotals={todayTotals} type={type} />} />
        <Line 
          type="monotone" 
          dataKey="input" 
          stroke="#8884d8" 
          name="Input" 
          strokeWidth={2}
          dot={false}
          activeDot={<ActiveDot />}
        />
        <Line 
          type="monotone" 
          dataKey="output" 
          stroke="#82ca9d" 
          name="Output" 
          strokeWidth={2}
          dot={false}
          activeDot={<ActiveDot />}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const RevealableApiKey: FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const toggleReveal = useCallback(() => {
    fetch(`/api/key`).then((r) => r.json()).then((response) => {
      setApiKey(response.apiKey ?? '')
      setIsRevealed(!isRevealed);
    })
  }, [isRevealed]);

  const showTemporaryNotification = useCallback(() => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 800); // Hide after 1.5 seconds
  }, []);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(apiKey).then(() => {
      setIsRevealed(false); // Hide the input after copying
      showTemporaryNotification();
    });
  }, [apiKey, showTemporaryNotification]);

  const maskedApiKey = apiKey.replace(/./g, '•');

  return (
    <div className="relative w-full">
      <div className="flex w-full">
        <input
          type="text"
          placeholder='Click the eye icon to reveal your API key'
          readOnly
          disabled
          value={isRevealed ? apiKey : maskedApiKey}
          className="flex-grow bg-background border border-border text-primary-text px-3 py-2 rounded-l-lg text-sm"
        />
        <div className="flex">
          {isRevealed && (
            <button
              type="button"
              onClick={copyToClipboard}
              className="bg-surface hover:bg-surface-hover text-secondary-text hover:text-primary-text px-3 py-2 text-xs border-t border-b border-border transition-all duration-200"
            >
              Copy
            </button>
          )}
          <button
            type="button"
            onClick={toggleReveal}
            className={`flex items-center px-3 py-2 text-secondary-text hover:text-primary-text bg-surface hover:bg-surface-hover border border-border transition-all duration-200 ${!isRevealed ? 'rounded-r-lg' : ''}`}
          >
            {isRevealed ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {showNotification && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-accent text-white text-xs rounded-lg shadow-lg transition-opacity duration-300 ease-in-out opacity-100">
          API key copied to clipboard!
        </div>
      )}
    </div>
  );
};

const Dashboard: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (props:any) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (status === 'loading') return;
    setLoading(false);
    if (props?.error) {
      setError(props.error);
    }
    if (props.userTimezone) {
      moment.tz.setDefault(props.userTimezone);
    }
  }, [status, props, props.userTimezone]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary-text">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary-text">
      <div className="bg-red-600 p-4 rounded-lg">
        <p className="text-xl font-bold">Error: {error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    </div>;
  }

  ;

  return (
    <div className="min-h-screen flex flex-col relative bg-background text-primary-text">
      <SpaceBackground />
      <main className="flex-grow z-10 px-4 py-6">
        <Header />
        {session ? (
          <section className="max-w-5xl mx-auto">
            <WelcomeSection email={session.user?.email || ''} />
            <div className="space-y-4">
               <>
                <div className="bg-surface p-5 rounded-xl border border-border">
                    <div className="bg-background p-5 rounded-lg border border-border/50">
                      <h4 className="text-lg font-semibold mb-2 text-primary-text">Start Chatting</h4>
                      <p className="text-secondary-text text-sm mb-4">
                        Begin an AI-powered conversation right in your browser.
                      </p>
                      <Link href="/chat" className="block w-full text-center bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-all duration-200">
                        <ComputerDesktopIcon className="inline-block w-4 h-4 mr-2" />
                        Launch Web Chat
                      </Link>
                    </div>
                </div>
                <div className="bg-surface p-5 rounded-xl border border-border">
                  <h3 className="text-lg font-semibold mb-3 text-primary-text">Your API Key</h3>
                  <p className="text-secondary-text text-sm mb-3">Use this to integrate UAITO API into your projects.</p>
                  <RevealableApiKey />
                </div>
                <div className="bg-surface p-5 rounded-xl border border-border">
                  <h3 className="text-lg font-semibold mb-3 text-primary-text">Theme Preference</h3>
                  <p className="text-secondary-text text-sm mb-3">Choose your preferred color theme or use your system settings.</p>
                  <ThemeToggle />
                </div>
                <div className="bg-surface p-5 rounded-xl border border-border">
                  <h3 className="text-lg font-semibold mb-3 text-primary-text">Your Usage</h3>
                
                  {hasMultipleDaysData(props.usage) && (
                    <>
                      <h4 className="text-base font-medium mb-2 text-secondary-text">Past 30 Days</h4>
                      <UsageGraph usage={props.usage} type="30d" />
                      <div className="mt-2">
                        <p className="text-xs text-tertiary-text">Graph shows input and output usage grouped by day for the past 30 days.</p>
                      </div>
                    </>
                  )}
                </div>
               </>
            </div>
          </section>
        ) : <Authenticate />}
      </main>
      <Footer />
    </div>
  );
};

type UserSession = {
  user?: {
    email: string
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getServerSession<any, UserSession>(context.req, context.res, authOptions)
    if (!session) {
      return  {
        props:{
          usage: [],
          userTimezone: 'UTC'
        }
      }
    }

    const user = await UserModel.findOne({email: session.user?.email})
    if (!user) {
      throw new Error("User not found")
    }

    const userTimezone = context.req.headers['x-timezone'] as string || 'UTC';
    
    const thirtyDaysAgo = moment().tz(userTimezone).subtract(30, 'days').toDate();

    const usage = await UsageModel.find({
      userId: user.id,
      createdAt: { $gte: thirtyDaysAgo }
    })
    .sort({ createdAt: 1 });

    const parsedUsage: IUsage[] = JSON.parse(
      JSON.stringify( 
        usage.map((u) => ({...u.toObject(), id: u.id, createdAt: moment(u.createdAt).tz(userTimezone).format()}))
      )
    );

    return {
      props: {
        usage: parsedUsage,
        userTimezone: userTimezone
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return  {
      props:{
        usage: [],
        error: 'Failed to fetch dashboard data',
        userTimezone: 'UTC'
      }
    }
  }
}

export default Dashboard