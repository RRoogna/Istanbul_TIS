import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecommendations } from '../../utils';
import { loadStatuses } from '../../utils/constants';
import RecommendationsResults from '../Recommendations/RecommendationsResults';
import Loader from '../Loader';

function HomeRecommendationsPod({ podId, title }) {
  const [loaded, setLoaded] = useState(loadStatuses.STALE);
  const [recommendations, setRecommendations] = useState([]);
  const [podData, setPodData] = useState();
  const [resultId, setResultId] = useState();
  const [numResults, setNumResults] = useState();

  useEffect(() => {
    const fetchRecommendationsFromAPI = async () => {
      setLoaded(loadStatuses.LOADING);
      try {
        const response = await fetchRecommendations(podId);

        setRecommendations(response?.response?.results || []);
        setNumResults(response?.response?.total_num_results);
        setResultId(response?.result_id);
        setPodData({
          podName: response?.response?.pod?.display_name || title,
          podId: response?.response?.pod?.id,
        });
        setLoaded(loadStatuses.SUCCESS);
      } catch (e) {
        setLoaded(loadStatuses.FAILED);
      }
    };
    fetchRecommendationsFromAPI();
  }, [podId, title]);

  if (loaded === loadStatuses.LOADING) {
    return (
      <div className="py-8">
        <Loader />
      </div>
    );
  }

  if (loaded === loadStatuses.FAILED || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {podData?.podName || title}
      </h2>
      <RecommendationsResults
        items={ recommendations }
        dataAttributes={ {
          dataCnstrcPodId: podData?.podId,
          dataCnstrcNumResults: numResults,
          dataCnstrcResultId: resultId,
        } }
      />
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative px-8 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Tiku&apos;s Threads
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover the latest trends in fashion with Tiku.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={ () => navigate('/browse') }
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-colors"
            >
              Shop Now
            </button>
            <button
              type="button"
              onClick={ () => navigate('/browse/Sale') }
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-700 transition-colors"
            >
              Explore Sales
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Clothing', groupId: 'Clothing', color: 'from-pink-500 to-rose-500' },
            { name: 'Golf', groupId: 'Golf', color: 'from-purple-500 to-indigo-500' },
            { name: 'Suits & Blazers', groupId: 'Suits & Blazers', color: 'from-cyan-500 to-blue-500' },
            { name: 'Accessories', groupId: 'Accessories', color: 'from-amber-500 to-orange-500' },
          ].map((category) => (
            <button
              key={ category.groupId }
              type="button"
              onClick={ () => navigate(`/browse/${category.groupId}`) }
              className={ `relative bg-gradient-to-br ${category.color} rounded-xl p-6 md:p-8 text-white font-semibold text-lg hover:scale-105 transition-transform cursor-pointer` }
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Recommendations Sections */}
      <section className="recommendations-section">
        <HomeRecommendationsPod
          podId="hp-bestsellers"
          title="Trending Now"
        />
      </section>

      {/* Promo Banner */}
      <section className="bg-gray-100 rounded-2xl p-8 md:p-12 text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Free Shipping on Orders Over $50
        </h2>
        <p className="text-gray-600 mb-6">
          Plus easy returns within 30 days. Shop with confidence!
        </p>
        <button
          type="button"
          onClick={ () => navigate('/browse') }
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </button>
      </section>
    </div>
  );
}

export default Home;
