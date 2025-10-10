import React, { useState, useEffect } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  EyeOff,
  Plus,
  Download,
  Filter,
  Menu,
  X
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'conversion';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  from?: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

export default function Payouts() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'withdraw' | 'settings'>('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar-payouts');
      const menuButton = document.getElementById('mobile-menu-button-payouts');
      if (showMobileSidebar && sidebar && !sidebar.contains(event.target as Node) && !menuButton?.contains(event.target as Node)) {
        setShowMobileSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  // Mock wallet data
  const walletData = {
    totalBalance: 245750.50, // NGN
    availableBalance: 240250.50, // NGN (after pending withdrawals)
    pendingBalance: 5500.00, // NGN
    totalEarnings: 1250000.00, // NGN
    thisMonthEarnings: 85750.50, // NGN
    lastWithdrawal: 50000.00, // NGN
    withdrawalDate: '2024-01-15'
  };

  // Mock transactions
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'earning',
      amount: 2500.00,
      currency: 'NGN',
      description: 'Subscription payment from Emma Thompson',
      date: '2024-01-20 14:30',
      status: 'completed'
    },
    {
      id: '2',
      type: 'earning',
      amount: 15.99,
      currency: 'USD',
      description: 'International subscription (converted to ₦12,750)',
      date: '2024-01-20 10:15',
      status: 'completed'
    },
    {
      id: '3',
      type: 'withdrawal',
      amount: 50000.00,
      currency: 'NGN',
      description: 'Withdrawal to GTBank ***1234',
      date: '2024-01-19 16:45',
      status: 'completed'
    },
    {
      id: '4',
      type: 'earning',
      amount: 5000.00,
      currency: 'NGN',
      description: 'Premium content purchase',
      date: '2024-01-19 12:20',
      status: 'completed'
    },
    {
      id: '5',
      type: 'conversion',
      amount: 25.00,
      currency: 'USD',
      description: 'Auto-converted to ₦19,950 (Rate: ₦798/$)',
      date: '2024-01-18 09:30',
      status: 'completed'
    }
  ];

  // Mock bank accounts
  const bankAccounts: BankAccount[] = [
    {
      id: '1',
      bankName: 'GTBank',
      accountNumber: '0123456789',
      accountName: 'John Creator Doe',
      isDefault: true
    },
    {
      id: '2',
      bankName: 'Access Bank',
      accountNumber: '9876543210',
      accountName: 'John Creator Doe',
      isDefault: false
    }
  ];

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning': return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-blue-400" />;
      case 'conversion': return <DollarSign className="w-4 h-4 text-purple-400" />;
      default: return <Wallet className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleWithdraw = () => {
    if (withdrawAmount && selectedBank) {
      // In a real app, this would process the withdrawal
      console.log('Processing withdrawal:', { amount: withdrawAmount, bank: selectedBank });
      alert(`Withdrawal of ₦${parseFloat(withdrawAmount).toLocaleString()} initiated successfully!`);
      setWithdrawAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button id="mobile-menu-button-payouts" onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold">Payouts</h1>
        <div className="w-8" />
      </div>
      {showMobileSidebar && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />}
      <div className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out`} id="mobile-sidebar-payouts">
        <UnifiedSidebar showMobileSidebar={showMobileSidebar} setShowMobileSidebar={setShowMobileSidebar} />
      </div>
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header - Hidden on mobile since it's in the fixed header */}
          <div className="mb-8 hidden lg:block">
            <h1 className="text-3xl font-bold mb-2">Payouts & Wallet</h1>
            <p className="text-gray-400">Manage your earnings, withdrawals, and payment settings</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: Wallet },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
              { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
              { id: 'settings', label: 'Settings', icon: DollarSign }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-6 py-2 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-white text-black' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Wallet Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Total Balance</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {showBalance ? formatCurrency(walletData.totalBalance) : '₦***,***.**'}
                  </div>
                
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Available</h3>
                    <Wallet className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {showBalance ? formatCurrency(walletData.availableBalance) : '₦***,***.**'}
                  </div>
                  <div className="text-sm text-gray-400">Ready for withdrawal</div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Pending Withdrawals</h3>
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {showBalance ? formatCurrency(walletData.thisMonthEarnings) : '₦***,***.**'}
                  </div>
                  <div className="text-sm text-gray-400">January earnings</div>
                </div>
              </div>

            
              {/* Recent Transactions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Recent Transactions</h3>
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveTab('transactions')}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-400">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                        <div className={`text-sm ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-4">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-400">{transaction.date}</div>
                          <div className="text-xs text-gray-500 capitalize">{transaction.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                        <div className={`text-sm ${getStatusColor(transaction.status)} capitalize`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Available Balance</h3>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {formatCurrency(walletData.availableBalance)}
                    </div>
                    <p className="text-sm text-gray-400 mb-6">
                      Minimum withdrawal: ₦1,000 • Maximum: ₦500,000 per day
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Withdrawal Amount</label>
                        <Input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="Enter amount in NGN"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Bank Account</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                          <option value="">Select bank account</option>
                          {bankAccounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.bankName} - {account.accountNumber} {account.isDefault && '(Default)'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Button 
                        onClick={handleWithdraw}
                        disabled={!withdrawAmount || !selectedBank}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Withdraw {withdrawAmount && formatCurrency(parseFloat(withdrawAmount))}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Withdrawal Information</h3>
                    <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Time:</span>
                        <span>1-3 business days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction Fee:</span>
                        <span>₦50 (Paystack)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Limit:</span>
                        <span>₦500,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Available Today:</span>
                        <span>₦500,000</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <h4 className="font-medium text-blue-400 mb-2">Payment Gateways</h4>
                      <p className="text-sm text-gray-300">
                        We use Paystack and Flutterwave for secure Nigerian bank transfers. 
                        International payments are auto-converted to NGN at current rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Settings</h2>

                <div className="space-y-8">
                  {/* Bank Accounts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Bank Accounts</h3>
                    <div className="space-y-4">
                      {bankAccounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium">{account.bankName}</div>
                            <div className="text-sm text-gray-400">{account.accountNumber} - {account.accountName}</div>
                            {account.isDefault && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded mt-1 inline-block">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-gray-400">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400">
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Bank Account
                      </Button>
                    </div>
                  </div>

                  {/* Currency Settings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Currency Settings</h3>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-medium">Primary Currency</div>
                          <div className="text-sm text-gray-400">Nigerian Naira (NGN)</div>
                        </div>
                        <div className="text-2xl">₦</div>
                      </div>
                      <div className="text-sm text-gray-300">
                        All international payments are automatically converted to NGN using real-time exchange rates.
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Payment Notifications</div>
                          <div className="text-sm text-gray-400">Get notified when you receive payments</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Withdrawal Updates</div>
                          <div className="text-sm text-gray-400">Get updates on withdrawal status</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Weekly Summary</div>
                          <div className="text-sm text-gray-400">Receive weekly earnings summary</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
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
