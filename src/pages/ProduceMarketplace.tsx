import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  MessageCircle, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Trash2, 
  Camera, 
  Upload,
  Phone,
  Mail,
  IndianRupee,
  Calendar,
  User,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  produceName: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  pricePerKg: number;
  quality: 'premium' | 'standard' | 'economy';
  images: string[];
  harvestDate: string;
  availableUntil: string;
  deliveryOptions: {
    selfPickup: boolean;
    delivery: boolean;
    deliveryRadius: number;
    deliveryCharge: number;
  };
  isActive: boolean;
  createdAt: string;
  views: number;
  rating: number;
  totalRatings: number;
}

interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  quantity: number;
  totalAmount: number;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  notes?: string;
}

export default function ProduceMarketplace() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-listings' | 'orders'>('browse');
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [showAddListing, setShowAddListing] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);
  const [newListing, setNewListing] = useState<Partial<ProduceListing>>({
    produceName: '',
    category: 'vegetables',
    description: '',
    quantity: 0,
    unit: 'kg',
    pricePerKg: 0,
    quality: 'standard',
    images: [],
    harvestDate: new Date().toISOString().split('T')[0],
    availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveryOptions: {
      selfPickup: true,
      delivery: false,
      deliveryRadius: 10,
      deliveryCharge: 0
    }
  });

  useEffect(() => {
    loadListings();
    loadOrders();
  }, [user]);

  const loadListings = () => {
    // Sample listings for demonstration
    const sampleListings: ProduceListing[] = [
      {
        id: '1',
        farmerId: 'farmer1',
        farmerName: language === 'te' ? 'రాము రైతు' : 'Ramu Farmer',
        farmerPhone: '+91 9876543210',
        farmerLocation: 'Warangal, Telangana',
        produceName: language === 'te' ? 'టమాటో' : 'Tomato',
        category: 'vegetables',
        description: language === 'te' 
          ? 'తాజా, సేంద్రీయ టమాటోలు. రసాయనాలు లేకుండా పెంచబడినవి.'
          : 'Fresh, organic tomatoes. Grown without chemicals.',
        quantity: 100,
        unit: 'kg',
        pricePerKg: 25,
        quality: 'premium',
        images: ['🍅'],
        harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availableUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deliveryOptions: {
          selfPickup: true,
          delivery: true,
          deliveryRadius: 15,
          deliveryCharge: 50
        },
        isActive: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        views: 45,
        rating: 4.5,
        totalRatings: 12
      },
      {
        id: '2',
        farmerId: 'farmer2',
        farmerName: language === 'te' ? 'సీతా రైతు' : 'Sita Farmer',
        farmerPhone: '+91 9876543211',
        farmerLocation: 'Karimnagar, Telangana',
        produceName: language === 'te' ? 'ఉల్లిపాయ' : 'Onion',
        category: 'vegetables',
        description: language === 'te'
          ? 'మంచి నాణ్యత గల ఉల్లిపాయలు. దీర్ఘకాలం నిల్వ ఉంచవచ్చు.'
          : 'Good quality onions. Can be stored for long periods.',
        quantity: 200,
        unit: 'kg',
        pricePerKg: 18,
        quality: 'standard',
        images: ['🧅'],
        harvestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deliveryOptions: {
          selfPickup: true,
          delivery: false,
          deliveryRadius: 0,
          deliveryCharge: 0
        },
        isActive: true,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        views: 23,
        rating: 4.2,
        totalRatings: 8
      }
    ];
    setListings(sampleListings);
  };

  const loadOrders = () => {
    if (!user) return;
    
    // Sample orders for demonstration
    const sampleOrders: Order[] = [
      {
        id: '1',
        listingId: '1',
        buyerId: user.id,
        buyerName: user.name,
        buyerPhone: user.phone || '',
        quantity: 10,
        totalAmount: 250,
        deliveryType: 'delivery',
        deliveryAddress: `${user.location.village}, ${user.location.district}`,
        status: 'confirmed',
        orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        notes: language === 'te' ? 'ఉదయం 9 గంటలకు డెలివరీ చేయండి' : 'Please deliver at 9 AM'
      }
    ];
    setOrders(sampleOrders);
  };

  const addListing = () => {
    if (!user || !newListing.produceName || !newListing.quantity || !newListing.pricePerKg) return;

    const listing: ProduceListing = {
      id: Date.now().toString(),
      farmerId: user.id,
      farmerName: user.name,
      farmerPhone: user.phone || '',
      farmerLocation: `${user.location.village}, ${user.location.district}`,
      produceName: newListing.produceName,
      category: newListing.category || 'vegetables',
      description: newListing.description || '',
      quantity: newListing.quantity,
      unit: newListing.unit || 'kg',
      pricePerKg: newListing.pricePerKg,
      quality: newListing.quality || 'standard',
      images: newListing.images || [],
      harvestDate: newListing.harvestDate || new Date().toISOString().split('T')[0],
      availableUntil: newListing.availableUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryOptions: newListing.deliveryOptions || {
        selfPickup: true,
        delivery: false,
        deliveryRadius: 10,
        deliveryCharge: 0
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      views: 0,
      rating: 0,
      totalRatings: 0
    };

    setListings([listing, ...listings]);
    setNewListing({
      produceName: '',
      category: 'vegetables',
      description: '',
      quantity: 0,
      unit: 'kg',
      pricePerKg: 0,
      quality: 'standard',
      images: [],
      harvestDate: new Date().toISOString().split('T')[0],
      availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryOptions: {
        selfPickup: true,
        delivery: false,
        deliveryRadius: 10,
        deliveryCharge: 0
      }
    });
    setShowAddListing(false);
  };

  const deleteListing = (listingId: string) => {
    setListings(listings.filter(listing => listing.id !== listingId));
  };

  const placeOrder = (listing: ProduceListing, quantity: number, deliveryType: 'pickup' | 'delivery') => {
    if (!user) return;

    const totalAmount = quantity * listing.pricePerKg + 
      (deliveryType === 'delivery' ? listing.deliveryOptions.deliveryCharge : 0);

    const order: Order = {
      id: Date.now().toString(),
      listingId: listing.id,
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: user.phone || '',
      quantity,
      totalAmount,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? `${user.location.village}, ${user.location.district}` : undefined,
      status: 'pending',
      orderDate: new Date().toISOString(),
    };

    setOrders([order, ...orders]);
    setSelectedListing(null);

    // Trigger notification
    const event = new CustomEvent('forumNotification', {
      detail: {
        type: 'marketplace',
        title: language === 'te' ? 'కొత్త ఆర్డర్' : 'New Order',
        message: language === 'te' 
          ? `${listing.produceName} కోసం కొత్త ఆర్డర్ వచ్చింది`
          : `New order received for ${listing.produceName}`,
        priority: 'medium',
        icon: '📦'
      }
    });
    window.dispatchEvent(event);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const categories = [
    { key: 'all', label: language === 'te' ? 'అన్నీ' : 'All' },
    { key: 'vegetables', label: language === 'te' ? 'కూరగాయలు' : 'Vegetables' },
    { key: 'fruits', label: language === 'te' ? 'పండ్లు' : 'Fruits' },
    { key: 'grains', label: language === 'te' ? 'ధాన్యాలు' : 'Grains' },
    { key: 'spices', label: language === 'te' ? 'మసాలాలు' : 'Spices' },
    { key: 'herbs', label: language === 'te' ? 'మూలికలు' : 'Herbs' }
  ];

  const qualities = [
    { key: 'all', label: language === 'te' ? 'అన్ని నాణ్యతలు' : 'All Qualities' },
    { key: 'premium', label: language === 'te' ? 'ప్రీమియం' : 'Premium' },
    { key: 'standard', label: language === 'te' ? 'స్టాండర్డ్' : 'Standard' },
    { key: 'economy', label: language === 'te' ? 'ఎకానమీ' : 'Economy' }
  ];

  const units = [
    { key: 'kg', label: language === 'te' ? 'కిలోలు' : 'Kilograms' },
    { key: 'quintal', label: language === 'te' ? 'క్వింటల్' : 'Quintal' },
    { key: 'ton', label: language === 'te' ? 'టన్' : 'Ton' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'premium': return 'bg-gold-100 text-gold-800 border-gold-200';
      case 'standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'economy': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.produceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesQuality = selectedQuality === 'all' || listing.quality === selectedQuality;
    
    return matchesSearch && matchesCategory && matchesQuality && listing.isActive;
  });

  const myListings = listings.filter(listing => listing.farmerId === user?.id);
  const myOrders = orders.filter(order => order.buyerId === user?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'te' ? 'ఉత్పత్తుల మార్కెట్‌ప్లేస్' : 'Produce Marketplace'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'te' 
              ? 'మీ వ్యవసాయ ఉత్పత్తులను నేరుగా విక్రయించండి మరియు కొనుగోలు చేయండి'
              : 'Buy and sell agricultural produce directly'
            }
          </p>
        </div>
        
        {user?.userType === 'farmer' && (
          <button
            onClick={() => setShowAddListing(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === 'te' ? 'ఉత్పత్తి జోడించు' : 'List Produce'}
          </button>
        )}
      </motion.div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'browse', label: language === 'te' ? 'బ్రౌజ్' : 'Browse', icon: Search },
              ...(user?.userType === 'farmer' ? [
                { key: 'my-listings', label: language === 'te' ? 'నా లిస్టింగ్‌లు' : 'My Listings', icon: Package }
              ] : []),
              { key: 'orders', label: language === 'te' ? 'ఆర్డర్‌లు' : 'Orders', icon: Truck }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Browse Tab */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'te' ? 'ఉత్పత్తులను వెతకండి...' : 'Search produce...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {categories.map(category => (
                      <option key={category.key} value={category.key}>{category.label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {qualities.map(quality => (
                      <option key={quality.key} value={quality.key}>{quality.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedListing(listing)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-4xl">{listing.images[0] || '🌾'}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getQualityColor(listing.quality)}`}>
                          {qualities.find(q => q.key === listing.quality)?.label}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {listing.produceName}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {language === 'te' ? 'ధర:' : 'Price:'}
                          </span>
                          <span className="font-bold text-green-600 flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {listing.pricePerKg}/{listing.unit}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {language === 'te' ? 'అందుబాటు:' : 'Available:'}
                          </span>
                          <span className="font-medium text-gray-900">
                            {listing.quantity} {listing.unit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.farmerLocation.split(',')[0]}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {listing.views}
                        </div>
                      </div>
                      
                      {listing.rating > 0 && (
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{listing.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({listing.totalRatings})</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* My Listings Tab */}
          {activeTab === 'my-listings' && user?.userType === 'farmer' && (
            <div className="space-y-4">
              {myListings.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'te' ? 'లిస్టింగ్‌లు లేవు' : 'No listings found'}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'te' 
                      ? 'మీ మొదటి ఉత్పత్తిని జోడించండి'
                      : 'Add your first produce listing'
                    }
                  </p>
                </div>
              ) : (
                myListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{listing.images[0] || '🌾'}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {listing.produceName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>₹{listing.pricePerKg}/{listing.unit}</span>
                            <span>{listing.quantity} {listing.unit}</span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {listing.views}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => deleteListing(listing.id)}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {myOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'te' ? 'ఆర్డర్‌లు లేవు' : 'No orders found'}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'te' 
                      ? 'మీ ఆర్డర్‌లు ఇక్కడ కనిపిస్తాయి'
                      : 'Your orders will appear here'
                    }
                  </p>
                </div>
              ) : (
                myOrders.map((order, index) => {
                  const listing = listings.find(l => l.id === order.listingId);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {listing?.produceName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{order.quantity} {listing?.unit}</span>
                            <span>₹{order.totalAmount}</span>
                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>{language === 'te' ? 'రైతు:' : 'Farmer:'}</strong> {listing?.farmerName}</p>
                          <p><strong>{language === 'te' ? 'ఫోన్:' : 'Phone:'}</strong> {listing?.farmerPhone}</p>
                        </div>
                        <div>
                          <p><strong>{language === 'te' ? 'డెలివరీ:' : 'Delivery:'}</strong> {order.deliveryType}</p>
                          {order.deliveryAddress && (
                            <p><strong>{language === 'te' ? 'చిరునామా:' : 'Address:'}</strong> {order.deliveryAddress}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{selectedListing.images[0] || '🌾'}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedListing.produceName}
                    </h3>
                    <p className="text-gray-600">{selectedListing.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Farmer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'రైతు వివరాలు' : 'Farmer Details'}
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>{language === 'te' ? 'పేరు:' : 'Name:'}</strong> {selectedListing.farmerName}</p>
                  <p><strong>{language === 'te' ? 'ఫోన్:' : 'Phone:'}</strong> {selectedListing.farmerPhone}</p>
                  <p><strong>{language === 'te' ? 'స్థానం:' : 'Location:'}</strong> {selectedListing.farmerLocation}</p>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{language === 'te' ? 'ధర:' : 'Price:'}</span>
                    <span className="font-bold text-green-600 text-lg flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {selectedListing.pricePerKg} per {selectedListing.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{language === 'te' ? 'అందుబాటు:' : 'Available:'}</span>
                    <span className="font-medium">{selectedListing.quantity} {selectedListing.unit}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{language === 'te' ? 'నాణ్యత:' : 'Quality:'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getQualityColor(selectedListing.quality)}`}>
                      {qualities.find(q => q.key === selectedListing.quality)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{language === 'te' ? 'కోత తేదీ:' : 'Harvest Date:'}</span>
                    <span className="font-medium">{new Date(selectedListing.harvestDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{language === 'te' ? 'అందుబాటు వరకు:' : 'Available Until:'}</span>
                    <span className="font-medium">{new Date(selectedListing.availableUntil).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{language === 'te' ? 'వీక్షణలు:' : 'Views:'}</span>
                    <span className="font-medium">{selectedListing.views}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  {language === 'te' ? 'డెలివరీ ఎంపికలు' : 'Delivery Options'}
                </h4>
                <div className="space-y-2">
                  {selectedListing.deliveryOptions.selfPickup && (
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {language === 'te' ? 'స్వయంగా తీసుకెళ్లవచ్చు' : 'Self Pickup Available'}
                    </div>
                  )}
                  {selectedListing.deliveryOptions.delivery && (
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {language === 'te' 
                        ? `డెలివరీ అందుబాటులో (${selectedListing.deliveryOptions.deliveryRadius}km వరకు, ₹${selectedListing.deliveryOptions.deliveryCharge} ఛార్జ్)`
                        : `Delivery Available (up to ${selectedListing.deliveryOptions.deliveryRadius}km, ₹${selectedListing.deliveryOptions.deliveryCharge} charge)`
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Order Form */}
              {user?.id !== selectedListing.farmerId && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {language === 'te' ? 'ఆర్డర్ చేయండి' : 'Place Order'}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'te' ? 'పరిమాణం' : 'Quantity'} ({selectedListing.unit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedListing.quantity}
                        defaultValue="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        id="orderQuantity"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      {selectedListing.deliveryOptions.selfPickup && (
                        <button
                          onClick={() => {
                            const quantity = parseInt((document.getElementById('orderQuantity') as HTMLInputElement).value);
                            placeOrder(selectedListing, quantity, 'pickup');
                          }}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
                        >
                          {language === 'te' ? 'పికప్ ఆర్డర్' : 'Order for Pickup'}
                        </button>
                      )}
                      
                      {selectedListing.deliveryOptions.delivery && (
                        <button
                          onClick={() => {
                            const quantity = parseInt((document.getElementById('orderQuantity') as HTMLInputElement).value);
                            placeOrder(selectedListing, quantity, 'delivery');
                          }}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                        >
                          {language === 'te' ? 'డెలివరీ ఆర్డర్' : 'Order for Delivery'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'te' ? 'కొత్త ఉత్పత్తి జోడించు' : 'Add New Produce Listing'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'ఉత్పత్తి పేరు' : 'Produce Name'}
                  </label>
                  <input
                    type="text"
                    value={newListing.produceName}
                    onChange={(e) => setNewListing(prev => ({ ...prev, produceName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={language === 'te' ? 'ఉదా: టమాటో' : 'e.g. Tomato'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'వర్గం' : 'Category'}
                  </label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.key} value={category.key}>{category.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'వివరణ' : 'Description'}
                </label>
                <textarea
                  value={newListing.description}
                  onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={language === 'te' ? 'ఉత్పత్తి గురించి వివరించండి...' : 'Describe your produce...'}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'పరిమాణం' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newListing.quantity}
                    onChange={(e) => setNewListing(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'యూనిట్' : 'Unit'}
                  </label>
                  <select
                    value={newListing.unit}
                    onChange={(e) => setNewListing(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {units.map(unit => (
                      <option key={unit.key} value={unit.key}>{unit.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'ధర' : 'Price'} (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newListing.pricePerKg}
                    onChange={(e) => setNewListing(prev => ({ ...prev, pricePerKg: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'నాణ్యత' : 'Quality'}
                  </label>
                  <select
                    value={newListing.quality}
                    onChange={(e) => setNewListing(prev => ({ ...prev, quality: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {qualities.slice(1).map(quality => (
                      <option key={quality.key} value={quality.key}>{quality.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'te' ? 'కోత తేదీ' : 'Harvest Date'}
                  </label>
                  <input
                    type="date"
                    value={newListing.harvestDate}
                    onChange={(e) => setNewListing(prev => ({ ...prev, harvestDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'te' ? 'డెలివరీ ఎంపికలు' : 'Delivery Options'}
                </label>
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="selfPickup"
                      checked={newListing.deliveryOptions?.selfPickup}
                      onChange={(e) => setNewListing(prev => ({
                        ...prev,
                        deliveryOptions: {
                          ...prev.deliveryOptions!,
                          selfPickup: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="selfPickup" className="ml-2 text-sm text-gray-700">
                      {language === 'te' ? 'స్వయంగా తీసుకెళ్లవచ్చు' : 'Self Pickup Available'}
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="delivery"
                      checked={newListing.deliveryOptions?.delivery}
                      onChange={(e) => setNewListing(prev => ({
                        ...prev,
                        deliveryOptions: {
                          ...prev.deliveryOptions!,
                          delivery: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="delivery" className="ml-2 text-sm text-gray-700">
                      {language === 'te' ? 'డెలివరీ అందుబాటులో' : 'Delivery Available'}
                    </label>
                  </div>
                  
                  {newListing.deliveryOptions?.delivery && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          {language === 'te' ? 'డెలివరీ రేడియస్ (km)' : 'Delivery Radius (km)'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newListing.deliveryOptions?.deliveryRadius}
                          onChange={(e) => setNewListing(prev => ({
                            ...prev,
                            deliveryOptions: {
                              ...prev.deliveryOptions!,
                              deliveryRadius: parseInt(e.target.value)
                            }
                          }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          {language === 'te' ? 'డెలివరీ ఛార్జ్ (₹)' : 'Delivery Charge (₹)'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newListing.deliveryOptions?.deliveryCharge}
                          onChange={(e) => setNewListing(prev => ({
                            ...prev,
                            deliveryOptions: {
                              ...prev.deliveryOptions!,
                              deliveryCharge: parseInt(e.target.value)
                            }
                          }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddListing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {language === 'te' ? 'రద్దు' : 'Cancel'}
              </button>
              <button
                onClick={addListing}
                disabled={!newListing.produceName || !newListing.quantity || !newListing.pricePerKg}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {language === 'te' ? 'లిస్టింగ్ జోడించు' : 'Add Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}