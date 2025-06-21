import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calculator, 
  Shield, 
  TrendingUp, 
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  IndianRupee,
  Percent,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Download,
  Upload,
  Banknote,
  Wallet,
  PieChart,
  BarChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

// Interfaces
interface LoanEligibility {
  isEligible: boolean;
  maxAmount: number;
  interestRate: number;
  tenure: number;
  monthlyEMI: number;
  requirements: string[];
  documents: string[];
  score: number;
}

interface InsuranceClaim {
  id: string;
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  description: string;
}

interface BNPLOption {
  provider: string;
  maxLimit: number;
  interestRate: number;
  tenure: number;
  processingFee: number;
  features: string[];
}

// Mock data for dashboard
const mockCashFlow = [
  { month: 'Jan', inflow: 50000, outflow: 30000 },
  { month: 'Feb', inflow: 40000, outflow: 35000 },
  { month: 'Mar', inflow: 60000, outflow: 25000 },
];
const mockExpenses = [
  { label: 'Seeds', value: 20000 },
  { label: 'Fertilizers', value: 15000 },
  { label: 'Equipment', value: 10000 },
  { label: 'Labor', value: 8000 },
];
const mockRevenue = [
  { label: 'Wheat', value: 40000 },
  { label: 'Cotton', value: 25000 },
  { label: 'Vegetables', value: 12000 },
];

export default function Finance() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'loans' | 'insurance' | 'bnpl'>('dashboard');
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanTenure, setLoanTenure] = useState<number>(12);
  const [loanPurpose, setLoanPurpose] = useState<string>('crop');
  const [eligibility, setEligibility] = useState<LoanEligibility | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [newClaim, setNewClaim] = useState({
    type: '',
    amount: 0,
    description: ''
  });
  const [bnplOptions, setBnplOptions] = useState<BNPLOption[]>([]);

  useEffect(() => {
    loadInsuranceClaims();
    loadBNPLOptions();
  }, []);

  const loadInsuranceClaims = () => {
    // Sample insurance claims data
    const sampleClaims: InsuranceClaim[] = [
      {
        id: '1',
        type: 'Crop Loss',
        amount: 25000,
        status: 'approved',
        submittedDate: '2024-01-15',
        description: 'Cotton crop damaged due to heavy rainfall'
      },
      {
        id: '2',
        type: 'Equipment Damage',
        amount: 15000,
        status: 'pending',
        submittedDate: '2024-01-20',
        description: 'Tractor engine repair due to mechanical failure'
      }
    ];
    setClaims(sampleClaims);
  };

  const loadBNPLOptions = () => {
    const options: BNPLOption[] = [
      {
        provider: 'AgriPay',
        maxLimit: 50000,
        interestRate: 0,
        tenure: 3,
        processingFee: 0,
        features: ['Zero interest for 3 months', 'Instant approval', 'Digital KYC']
      },
      {
        provider: 'FarmCredit',
        maxLimit: 100000,
        interestRate: 12,
        tenure: 6,
        processingFee: 500,
        features: ['Flexible repayment', 'Seasonal adjustments', 'Crop insurance included']
      },
      {
        provider: 'KisanFinance',
        maxLimit: 75000,
        interestRate: 8,
        tenure: 4,
        processingFee: 250,
        features: ['Low interest rates', 'Quick disbursement', 'Mobile app support']
      }
    ];
    setBnplOptions(options);
  };

  const calculateLoanEligibility = async () => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const baseScore = 650;
    let score = baseScore;
    if (user?.userType === 'farmer') score += 50;
    if (user?.location.state === 'Telangana') score += 30;
    const purposeMultiplier = {
      'crop': 1.2,
      'equipment': 1.0,
      'land': 0.8,
      'livestock': 1.1,
      'irrigation': 1.3
    };
    const multiplier = purposeMultiplier[loanPurpose as keyof typeof purposeMultiplier] || 1.0;
    const maxAmount = Math.floor(loanAmount * multiplier);
    let interestRate = 12;
    if (score > 750) interestRate = 8;
    else if (score > 700) interestRate = 10;
    else if (score > 650) interestRate = 12;
    else interestRate = 15;
    const monthlyRate = interestRate / 100 / 12;
    const emi = Math.floor((maxAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) / 
                          (Math.pow(1 + monthlyRate, loanTenure) - 1));
    const eligibilityResult: LoanEligibility = {
      isEligible: score >= 600,
      maxAmount,
      interestRate,
      tenure: loanTenure,
      monthlyEMI: emi,
      score,
      requirements: [
        language === 'te' ? 'ఆధార్ కార్డ్' : 'Aadhaar Card',
        language === 'te' ? 'పాన్ కార్డ్' : 'PAN Card',
        language === 'te' ? 'భూమి పత్రాలు' : 'Land Documents',
        language === 'te' ? 'ఆదాయ ప్రమాణం' : 'Income Proof',
        language === 'te' ? 'బ్యాంక్ స్టేట్‌మెంట్' : 'Bank Statement'
      ],
      documents: [
        language === 'te' ? 'పంట వివరాలు' : 'Crop Details',
        language === 'te' ? 'భూమి రికార్డులు' : 'Land Records',
        language === 'te' ? 'ఆదాయ సర్టిఫికేట్' : 'Income Certificate'
      ]
    };
    setEligibility(eligibilityResult);
    setIsCalculating(false);
  };

  const submitInsuranceClaim = () => {
    if (!newClaim.type || !newClaim.amount || !newClaim.description) return;
    const claim: InsuranceClaim = {
      id: Date.now().toString(),
      type: newClaim.type,
      amount: newClaim.amount,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      description: newClaim.description
    };
    setClaims([claim, ...claims]);
    setNewClaim({ type: '', amount: 0, description: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return AlertCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  // Download loan eligibility report as text
  const downloadEligibilityReport = () => {
    if (!eligibility) return;
    const content = `
      Loan Eligibility Report
      -----------------------
      Eligible: ${eligibility.isEligible ? 'Yes' : 'No'}
      Max Amount: ₹${eligibility.maxAmount}
      Interest Rate: ${eligibility.interestRate}%
      Tenure: ${eligibility.tenure} months
      Monthly EMI: ₹${eligibility.monthlyEMI}
      Credit Score: ${eligibility.score}
      Required Documents: ${eligibility.requirements.join(', ')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan_eligibility_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'te' ? 'వ్యవసాయ ఫైనాన్స్' : 'Agricultural Finance'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'te' 
              ? 'రుణాలు, బీమా మరియు ఫైనాన్సింగ్ ఎంపికలు'
              : 'Loans, insurance, and financing options for farmers'
            }
          </p>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'dashboard', label: language === 'te' ? 'డాష్‌బోర్డ్' : 'Dashboard', icon: TrendingUp },
              { key: 'loans', label: language === 'te' ? 'రుణాలు' : 'Crop Loans', icon: Calculator },
              { key: 'insurance', label: language === 'te' ? 'బీమా క్లెయిమ్స్' : 'Insurance Claims', icon: Shield },
              { key: 'bnpl', label: language === 'te' ? 'BNPL' : 'Buy Now Pay Later', icon: CreditCard }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-green-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'te' ? 'నిధుల సమీక్ష' : 'Financial Overview'}
              </h3>
              {/* Cash Flow Widget */}
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="flex items-center mb-2">
                  <BarChart className="h-5 w-5 text-blue-500 mr-2" />
                  <h4 className="font-medium">{language === 'te' ? 'నగదు ప్రవాహం' : 'Cash Flow'}</h4>
                </div>
                <div className="flex space-x-4">
                  {mockCashFlow.map((item) => (
                    <div key={item.month} className="flex flex-col items-center">
                      <span className="text-sm text-gray-500">{item.month}</span>
                      <span className="text-green-700 font-bold">+₹{item.inflow}</span>
                      <span className="text-red-600 font-bold">-₹{item.outflow}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Expense Breakdown */}
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="flex items-center mb-2">
                  <PieChart className="h-5 w-5 text-purple-500 mr-2" />
                  <h4 className="font-medium">{language === 'te' ? 'ఖర్చుల విభజన' : 'Expense Breakdown'}</h4>
                </div>
                <ul>
                  {mockExpenses.map(item => (
                    <li key={item.label} className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-medium">₹{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Revenue Streams */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <h4 className="font-medium">{language === 'te' ? 'ఆదాయ మార్గాలు' : 'Revenue Streams'}</h4>
                </div>
                <ul>
                  {mockRevenue.map(item => (
                    <li key={item.label} className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-medium">₹{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* Crop Loans Tab */}
          {activeTab === 'loans' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Loan Calculator */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'te' ? 'రుణ అర్హత కాలిక్యులేటర్' : 'Loan Eligibility Calculator'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'te' ? 'రుణ మొత్తం' : 'Loan Amount'}
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="100000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'te' ? 'కాలవధి (నెలలు)' : 'Tenure (Months)'}
                      </label>
                      <select
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value={6}>6 {language === 'te' ? 'నెలలు' : 'Months'}</option>
                        <option value={12}>12 {language === 'te' ? 'నెలలు' : 'Months'}</option>
                        <option value={18}>18 {language === 'te' ? 'నెలలు' : 'Months'}</option>
                        <option value={24}>24 {language === 'te' ? 'నెలలు' : 'Months'}</option>
                        <option value={36}>36 {language === 'te' ? 'నెలలు' : 'Months'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'te' ? 'రుణ ప్రయోజనం' : 'Loan Purpose'}
                      </label>
                      <select
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="crop">{language === 'te' ? 'పంట రుణం' : 'Crop Loan'}</option>
                        <option value="equipment">{language === 'te' ? 'పరికరాలు' : 'Equipment'}</option>
                        <option value="land">{language === 'te' ? 'భూమి కొనుగోలు' : 'Land Purchase'}</option>
                        <option value="livestock">{language === 'te' ? 'పశువులు' : 'Livestock'}</option>
                        <option value="irrigation">{language === 'te' ? 'నీటిపారుదల' : 'Irrigation'}</option>
                      </select>
                    </div>
                    <button
                      onClick={calculateLoanEligibility}
                      disabled={isCalculating}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {isCalculating ? (
                        <div className="flex items-center justify-center">
                          <Calculator className="h-4 w-4 mr-2 animate-pulse" />
                          {language === 'te' ? 'లెక్కిస్తోంది...' : 'Calculating...'}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Calculator className="h-4 w-4 mr-2" />
                          {language === 'te' ? 'అర్హత తనిఖీ చేయండి' : 'Check Eligibility'}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                {/* Eligibility Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'te' ? 'అర్హత ఫలితాలు' : 'Eligibility Results'}
                  </h3>
                  {!eligibility ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {language === 'te' 
                          ? 'అర్హత తనిఖీ చేయడానికి కాలిక్యులేటర్ ఉపయోగించండి'
                          : 'Use the calculator to check your eligibility'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Eligibility Status */}
                      <div className={`p-4 rounded-lg border ${
                        eligibility.isEligible 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {eligibility.isEligible ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className={`font-medium ${
                            eligibility.isEligible ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {eligibility.isEligible 
                              ? (language === 'te' ? 'మీరు అర్హులు!' : 'You are eligible!')
                              : (language === 'te' ? 'అర్హత లేదు' : 'Not eligible')
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {language === 'te' ? 'క్రెడిట్ స్కోర్: ' : 'Credit Score: '}{eligibility.score}
                        </p>
                      </div>
                      {eligibility.isEligible && (
                        <>
                          {/* Loan Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <IndianRupee className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">
                                  {language === 'te' ? 'గరిష్ట మొత్తం' : 'Max Amount'}
                                </span>
                              </div>
                              <p className="text-lg font-bold text-blue-900">
                                ₹{eligibility.maxAmount.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Percent className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">
                                  {language === 'te' ? 'వడ్డీ రేటు' : 'Interest Rate'}
                                </span>
                              </div>
                              <p className="text-lg font-bold text-purple-900">
                                {eligibility.interestRate}% {language === 'te' ? 'వార్షిక' : 'per annum'}
                              </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Calendar className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  {language === 'te' ? 'నెలవారీ EMI' : 'Monthly EMI'}
                                </span>
                              </div>
                              <p className="text-lg font-bold text-green-900">
                                ₹{eligibility.monthlyEMI.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-800">
                                  {language === 'te' ? 'కాలవధి' : 'Tenure'}
                                </span>
                              </div>
                              <p className="text-lg font-bold text-orange-900">
                                {eligibility.tenure} {language === 'te' ? 'నెలలు' : 'months'}
                              </p>
                            </div>
                          </div>
                          {/* Required Documents */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {language === 'te' ? 'అవసరమైన పత్రాలు' : 'Required Documents'}
                            </h4>
                            <div className="space-y-2">
                              {eligibility.requirements.map((req, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                            onClick={downloadEligibilityReport}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {language === 'te' ? 'రిపోర్ట్ డౌన్లోడ్ చేయండి' : 'Download Report'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Insurance Claims Tab */}
          {activeTab === 'insurance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New Claim Form */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'te' ? 'కొత్త క్లెయిమ్ సమర్పించండి' : 'Submit New Claim'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'te' ? 'క్లెయిమ్ రకం' : 'Claim Type'}
                      </label>
                      <select
                        value={newClaim.type}
                        onChange={(e) => setNewClaim(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">{language === 'te' ? 'ఎంచుకోండి' : 'Select Type'}</option>
                        <option value="Crop Loss">{language === 'te' ? 'పంట నష్టం' : 'Crop Loss'}</option>
                        <option value="Equipment Damage">{language === 'te' ? 'పరికరాల నష్టం' : 'Equipment Damage'}</option>
                        <option value="Natural Disaster">{language === 'te' ? 'ప్రకృతి వైపరీత్యం' : 'Natural Disaster'}</option>
                        <option value="Livestock Loss">{language === 'te' ? 'పశువుల నష్టం' : 'Livestock Loss'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'te' ? 'క్లెయిమ్ మొత్తం' : 'Claim Amount'}
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          value={newClaim.amount}
                          onChange={(e) => setNewClaim(prev => ({ ...prev, amount: Number(e.target.value) }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="25000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'te' ? 'వివరణ' : 'Description'}
                      </label>
                      <textarea
                        value={newClaim.description}
                        onChange={(e) => setNewClaim(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={language === 'te' ? 'నష్టం గురించి వివరించండి...' : 'Describe the damage...'}
                      />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {language === 'te' ? 'సాక్ష్య ఫోటోలు అప్‌లోడ్ చేయండి' : 'Upload evidence photos'}
                      </p>
                    </div>
                    <button
                      onClick={submitInsuranceClaim}
                      disabled={!newClaim.type || !newClaim.amount || !newClaim.description}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {language === 'te' ? 'క్లెయిమ్ సమర్పించండి' : 'Submit Claim'}
                    </button>
                  </div>
                </div>
                {/* Claims History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'te' ? 'క్లెయిమ్స్ చరిత్ర' : 'Claims History'}
                  </h3>
                  <div className="space-y-3">
                    {claims.map((claim) => {
                      const StatusIcon = getStatusIcon(claim.status);
                      return (
                        <div key={claim.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{claim.type}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{claim.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900">
                              ₹{claim.amount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-gray-500">{claim.submittedDate}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* BNPL Tab */}
          {activeTab === 'bnpl' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'te' ? 'వ్యవసాయ ఇన్‌పుట్స్ కోసం BNPL' : 'Buy Now Pay Later for Agricultural Inputs'}
                </h3>
                <p className="text-gray-600">
                  {language === 'te' 
                    ? 'విత్తనాలు, ఎరువులు, పరికరాలను ఇప్పుడు కొనుగోలు చేసి తర్వాత చెల్లించండి'
                    : 'Purchase seeds, fertilizers, and equipment now and pay later'
                  }
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bnplOptions.map((option, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{option.provider}</h4>
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {language === 'te' ? 'గరిష్ట పరిమితి' : 'Max Limit'}
                        </span>
                        <span className="font-medium">₹{option.maxLimit.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {language === 'te' ? 'వడ్డీ రేటు' : 'Interest Rate'}
                        </span>
                        <span className="font-medium">{option.interestRate}% {language === 'te' ? 'వార్షిక' : 'p.a.'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {language === 'te' ? 'కాలవధి' : 'Tenure'}
                        </span>
                        <span className="font-medium">{option.tenure} {language === 'te' ? 'నెలలు' : 'months'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {language === 'te' ? 'ప్రాసెసింగ్ ఫీ' : 'Processing Fee'}
                        </span>
                        <span className="font-medium">₹{option.processingFee}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        {language === 'te' ? 'లక్షణాలు' : 'Features'}
                      </h5>
                      <ul className="space-y-1">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
                      {language === 'te' ? 'దరఖాస్తు చేసుకోండి' : 'Apply Now'}
                    </button>
                  </div>
                ))}
              </div>
              {/* BNPL Benefits */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'te' ? 'BNPL ప్రయోజనాలు' : 'BNPL Benefits'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {language === 'te' ? 'తక్షణ ఆమోదం' : 'Instant Approval'}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {language === 'te' 
                          ? 'కొన్ని నిమిషాల్లో ఆమోదం పొందండి'
                          : 'Get approved within minutes'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Banknote className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {language === 'te' ? 'సీజనల్ చెల్లింపులు' : 'Seasonal Payments'}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {language === 'te' 
                          ? 'పంట కోత తర్వాత చెల్లించండి'
                          : 'Pay after harvest season'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {language === 'te' ? 'క్రెడిట్ స్కోర్ మెరుగుదల' : 'Credit Score Improvement'}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {language === 'te' 
                          ? 'సమయానికి చెల్లించి క్రెడిట్ స్కోర్ పెంచుకోండి'
                          : 'Build credit score with timely payments'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {language === 'te' ? 'తక్కువ వడ్డీ రేట్లు' : 'Lower Interest Rates'}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {language === 'te' 
                          ? 'సాంప్రదాయ రుణాల కంటే తక్కువ వడ్డీ'
                          : 'Lower rates than traditional loans'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
