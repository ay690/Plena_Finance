import type { Token } from "../store/slices/portfolioSlice";

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: {
    small: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    sparkline_7d?: {
      price: number[];
    };
  };
  sparkline_in_7d?: {
    price: number[];
  };
}

interface CoinMarketItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const searchTokens = async (query: string): Promise<Array<{ id: string; name: string; symbol: string; thumb: string }>> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch token search results');
    }
    
    const data = await response.json();
    
    return data.coins.map((coin: CoinSearchResult) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      thumb: coin.thumb
    }));
  } catch (error) {
    console.error('Error searching tokens:', error);
    throw error;
  }
};

export const getTrendingTokens = async (): Promise<Array<{ id: string; name: string; symbol: string; thumb: string }>> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending tokens');
    }
    
    const data = await response.json();
    
    return data.map((coin: CoinMarketItem) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      thumb: coin.image
    }));
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    throw error;
  }
};

export const getTokenDetails = async (id: string): Promise<Token> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details for token ${id}`);
    }
    
    const data: CoinMarketData = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      icon: data.image.small,
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h,
      sparklineData: data.market_data.sparkline_7d?.price || [],
      holdings: 0, // Default to 0, user will set this
      coingeckoId: data.id
    };
  } catch (error) {
    console.error(`Error fetching details for token ${id}:`, error);
    throw error;
  }
};
