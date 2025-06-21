import React, { useState, useMemo } from 'react';
import { Download, Bell, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

// Sample market data
const sampleData = [
  {
    commodity: 'Rice (Fine)',
    market: 'Hyderabad',
    current_price: 3200,
    previous_price: 3150,
    price_trend: 'up',
    unit: 'Quintal',
    quality_grade: 'A-Grade',
    arrival_quantity: 450,
    price_change: 50,
    date: new Date().toISOString(),
    history: [3100, 3120, 3150, 3180, 3200]
  },
  {
    commodity: 'Cotton',
    market: 'Warangal',
    current_price: 6800,
    previous_price: 6850,
    price_trend: 'down',
    unit: 'Quintal',
    quality_grade: 'B-Grade',
    arrival_quantity: 180,
    price_change: -50,
    date: new Date().toISOString(),
    history: [7000, 6900, 6850, 6820, 6800]
  },
  {
    commodity: 'Maize',
    market: 'Karimnagar',
    current_price: 2100,
    previous_price: 2100,
    price_trend: 'stable',
    unit: 'Quintal',
    quality_grade: 'A-Grade',
    arrival_quantity: 300,
    price_change: 0,
    date: new Date().toISOString(),
    history: [2100, 2100, 2100, 2100, 2100]
  },
  {
    commodity: 'Red Chilli',
    market: 'Khammam',
    current_price: 12000,
    previous_price: 11900,
    price_trend: 'up',
    unit: 'Quintal',
    quality_grade: 'Premium',
    arrival_quantity: 100,
    price_change: 100,
    date: new Date().toISOString(),
    history: [11500, 11700, 11800, 11900, 12000]
  }
];

// Mock market locations for demonstration (for map integration)
const marketLocations = {
  Hyderabad: [17.385, 78.4867],
  Warangal: [17.9784, 79.5941],
  Karimnagar: [18.4386, 79.1288],
  Khammam: [17.2473, 80.1514],
};

export default function Markets() {
  // Contexts (replace with your actual context hooks)
  const language = 'en'; // or 'te'

  const [search, setSearch] = useState('');
  const [marketFilter, setMarketFilter] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [report, setReport] = useState({ commodity: '', market: '', price: '' });

  // Filtered data based on search and market filter
  const filteredData = useMemo(() => {
    return sampleData.filter(item =>
      (!marketFilter || item.market === marketFilter) &&
      (item.commodity.toLowerCase().includes(search.toLowerCase()) ||
        item.market.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, marketFilter]);

  // Download CSV
  const downloadCSV = () => {
    const headers = ['Commodity', 'Market', 'Current Price', 'Previous Price', 'Trend', 'Unit', 'Quality', 'Arrivals', 'Change', 'Date'];
    const rows = filteredData.map(item => [
      item.commodity, item.market, item.current_price, item.previous_price, item.price_trend,
      item.unit, item.quality_grade, item.arrival_quantity, item.price_change, item.date
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'market_prices.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle subscription
  const toggleSubscription = (commodity) => {
    setSubscriptions(subs =>
      subs.includes(commodity)
        ? subs.filter(c => c !== commodity)
        : [...subs, commodity]
    );
  };

  // User price reporting
  const submitReport = () => {
    if (!report.commodity || !report.market || !report.price) return;
    setUserReports([...userReports, { ...report, date: new Date().toISOString() }]);
    setReport({ commodity: '', market: '', price: '' });
  };

  // Trend icon
  const trendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="inline h-4 w-4 text-green-600" aria-label="Up" />;
    if (trend === 'down') return <TrendingDown className="inline h-4 w-4 text-red-600" aria-label="Down" />;
    return <Minus className="inline h-4 w-4 text-gray-400" aria-label="Stable" />;
  };

  // Responsive table: horizontal scroll on mobile
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {language === 'te' ? 'వ్యవసాయ మార్కెట్ ధరలు' : 'Agricultural Market Prices'}
          </h1>
          <p className="text-gray-600">
            {language === 'te'
              ? 'తెలంగాణ మార్కెట్లలో తాజా ధరలు'
              : 'Latest prices from Telangana markets'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            aria-label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'te' ? 'కామోడిటీ లేదా మార్కెట్...' : 'Commodity or market...'}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select
            aria-label="Filter by Market"
            value={marketFilter}
            onChange={e => setMarketFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">{language === 'te' ? 'అన్ని మార్కెట్లు' : 'All Markets'}</option>
            {[...new Set(sampleData.map(item => item.market))].map(market => (
              <option key={market} value={market}>{market}</option>
            ))}
          </select>
          <button
            onClick={downloadCSV}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {language === 'te' ? 'డౌన్లోడ్ CSV' : 'Download CSV'}
          </button>
        </div>
      </div>

      {/* User-contributed price reporting */}
      <form onSubmit={e => { e.preventDefault(); submitReport(); }} className="mb-4 flex flex-wrap gap-2">
        <input
          aria-label="Commodity"
          value={report.commodity}
          onChange={e => setReport({ ...report, commodity: e.target.value })}
          placeholder={language === 'te' ? 'కామోడిటీ' : 'Commodity'}
          className="border px-2 py-1 rounded text-sm"
        />
        <input
          aria-label="Market"
          value={report.market}
          onChange={e => setReport({ ...report, market: e.target.value })}
          placeholder={language === 'te' ? 'మార్కెట్' : 'Market'}
          className="border px-2 py-1 rounded text-sm"
        />
        <input
          aria-label="Price"
          value={report.price}
          onChange={e => setReport({ ...report, price: e.target.value })}
          placeholder={language === 'te' ? 'ధర' : 'Price'}
          type="number"
          className="border px-2 py-1 rounded text-sm"
        />
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded text-sm">
          {language === 'te' ? 'రిపోర్ట్' : 'Report'}
        </button>
      </form>
      {userReports.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-sm">{language === 'te' ? 'వినియోగదారు రిపోర్టులు' : 'User Reports'}</h3>
          <ul className="text-xs bg-gray-50 rounded p-2">
            {userReports.map((r, i) => (
              <li key={i}>{r.commodity} at {r.market}: ₹{r.price} ({new Date(r.date).toLocaleString()})</li>
            ))}
          </ul>
        </div>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-xs font-semibold">{language === 'te' ? 'కామోడిటీ' : 'Commodity'}</th>
              <th className="p-3 text-left text-xs font-semibold">{language === 'te' ? 'మార్కెట్' : 'Market'}</th>
              <th className="p-3 text-right text-xs font-semibold">{language === 'te' ? 'ధర' : 'Price'}</th>
              <th className="p-3 text-right text-xs font-semibold">{language === 'te' ? 'మునుపటి ధర' : 'Prev. Price'}</th>
              <th className="p-3 text-center text-xs font-semibold">{language === 'te' ? 'ట్రెండ్' : 'Trend'}</th>
              <th className="p-3 text-center text-xs font-semibold">{language === 'te' ? 'చార్ట్' : 'Chart'}</th>
              <th className="p-3 text-center text-xs font-semibold">{language === 'te' ? 'అలర్ట్' : 'Alert'}</th>
              <th className="p-3 text-center text-xs font-semibold">{language === 'te' ? 'వివరాలు' : 'Details'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.commodity + item.market} className="hover:bg-blue-50 transition">
                <td className="p-3 text-sm">{item.commodity}</td>
                <td className="p-3 text-sm">{item.market}</td>
                <td className="p-3 text-sm text-right font-medium">₹{item.current_price}</td>
                <td className="p-3 text-sm text-right text-gray-500">₹{item.previous_price}</td>
                <td className="p-3 text-center">{trendIcon(item.price_trend)}</td>
                <td className="p-3 text-center">
                  <Sparklines data={item.history} width={60} height={20}>
                    <SparklinesLine color={
                      item.price_trend === 'up' ? "green" :
                      item.price_trend === 'down' ? "red" : "gray"
                    } />
                  </Sparklines>
                </td>
                <td className="p-3 text-center">
                  <button
                    aria-label={
                      subscriptions.includes(item.commodity)
                        ? 'Unsubscribe to price alert'
                        : 'Subscribe to price alert'
                    }
                    onClick={() => toggleSubscription(item.commodity)}
                    className={`px-2 py-1 rounded text-xs flex items-center mx-auto ${
                      subscriptions.includes(item.commodity)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    {subscriptions.includes(item.commodity)
                      ? (language === 'te' ? 'సబ్‌స్క్రైబ్ అయింది' : 'Subscribed')
                      : (language === 'te' ? 'అలర్ట్' : 'Alert')}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    aria-label="Show details"
                    onClick={() => setSelectedCommodity(item)}
                    className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    {language === 'te' ? 'వివరాలు' : 'Details'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Commodity Detail Modal */}
      {selectedCommodity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setSelectedCommodity(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-2">
              {selectedCommodity.commodity} - {selectedCommodity.market}
            </h3>
            <div className="mb-4">
              <Sparklines data={selectedCommodity.history} width={100} height={30}>
                <SparklinesLine color="blue" />
              </Sparklines>
            </div>
            <p><strong>{language === 'te' ? 'ధర' : 'Current Price'}:</strong> ₹{selectedCommodity.current_price}</p>
            <p><strong>{language === 'te' ? 'క్వాలిటీ' : 'Quality'}:</strong> {selectedCommodity.quality_grade}</p>
            <p><strong>{language === 'te' ? 'అరైవల్స్' : 'Arrivals'}:</strong> {selectedCommodity.arrival_quantity} {selectedCommodity.unit}</p>
            <p><strong>{language === 'te' ? 'తేదీ' : 'Date'}:</strong> {new Date(selectedCommodity.date).toLocaleDateString()}</p>
            <button
              onClick={() => setSelectedCommodity(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              {language === 'te' ? 'క్లోజ్' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
