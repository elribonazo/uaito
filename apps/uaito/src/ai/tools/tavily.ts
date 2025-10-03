import axios, { AxiosError } from 'axios';

// Define the structure of a Tavily search result
 interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

// Define the structure of the Tavily API response
 interface TavilyApiResponse {
  results: TavilySearchResult[];
  query: string;
  answer?: string;
  images: string[]
}

/**
 * Run a Tavily search query and parse the results
 * @param query The search query string
 * @param apiKey Your Tavily API key
 * @param includeAnswer Optional: Include an AI-generated answer in the response
 * @param searchDepth Optional: Set the search depth to 'basic' or 'advanced'
 * @returns A promise that resolves to an array of TavilySearchResult objects
 */
async function runTavilySearch(
  query: string,
  searchDepth: 'basic' | 'advanced' = 'advanced'
): Promise<TavilyApiResponse> {
  try {
    if (!process.env.TAVILY_API_KEY) {
      throw new Error('TAVILY_API_KEY is not set');
    }
    const response = await axios.post<TavilyApiResponse>('https://api.tavily.com/search',{
      api_key: process.env.TAVILY_API_KEY,
      query: query,
      include_answer: true,
      search_depth: searchDepth,
      include_images: true
    });
    return response.data
  } catch (error) {
    console.error('Error running Tavily search:', JSON.stringify(error));
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Axios error details:', JSON.stringify(axiosError.response?.data));
    }
    throw error;
  }
}

export type { TavilySearchResult };
export { runTavilySearch};