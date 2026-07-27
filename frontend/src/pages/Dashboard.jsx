import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiTrendingUp, FiUsers, FiDollarSign, FiActivity, FiPlus, FiCpu } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

import InvestNowModal from '../components/InvestNowModal';
import { InvestmentHistoryTable, ROIHistoryTable, ReferralIncomeTable } from '../components/DashboardTables';
import ReferralTree from '../components/ReferralTree';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  // Queries
  const { data: summary, isLoading: sumLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: async () => (await api.get('/dashboard/summary')).data.data
  });

  const { data: recentTx, isLoading: txLoading } = useQuery({
    queryKey: ['recentTx'],
    queryFn: async () => (await api.get('/dashboard/recent')).data.data
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['chartData'],
    queryFn: async () => (await api.get('/dashboard/chart')).data.data
  });

  const { data: walletChart, isLoading: walletLoading } = useQuery({
    queryKey: ['walletChart'],
    queryFn: async () => (await api.get('/dashboard/wallet-chart')).data.data
  });

  // Admin Run ROI Mutation (Testing)
  const { mutate: runROI, isPending: runningROI } = useMutation({
    mutationFn: async () => await api.post('/dashboard/admin/run-roi'),
    onSuccess: () => {
      toast.success('Midnight ROI Process Simulated!');
      queryClient.invalidateQueries(); // Refresh everything
    },
    onError: (err) => {
      toast.error('Failed to run ROI: ' + (err.response?.data?.message || err.message));
    }
  });

  // Admin Add Funds Mutation (Testing)
  const { mutate: addFunds, isPending: addingFunds } = useMutation({
    mutationFn: async () => await api.post('/dashboard/admin/add-funds'),
    onSuccess: () => {
      toast.success('₹10,000 added to your wallet for testing!');
      queryClient.invalidateQueries(); // Refresh everything
    },
    onError: (err) => {
      toast.error('Failed to add funds: ' + (err.response?.data?.message || err.message));
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen animated-bg text-slate-200 relative overflow-hidden pb-12">
      {/* Ambient Orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <InvestNowModal isOpen={isInvestModalOpen} onClose={() => setIsInvestModalOpen(false)} />

      {/* Navbar */}
      <nav className="border-b border-white/10 glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-white drop-shadow-md">NexaInvest</span>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => setIsInvestModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full font-bold shadow-lg shadow-emerald-500/20 transition-all"
              >
                <FiPlus /> Invest Now
              </button>
              <span className="hidden sm:inline-block text-sm text-slate-300 font-medium bg-black/20 px-4 py-1.5 rounded-full border border-white/10">
                Ref Code: <span className="text-white font-mono ml-1">{user.referralCode}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-300 hover:text-white transition-all rounded-full hover:bg-white/10"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Welcome back, {user.fullName}</h1>
            <p className="text-slate-300 font-medium">Here is what's happening with your investments today.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => addFunds()}
              disabled={addingFunds}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 rounded-xl font-bold transition-all"
              title="Add funds to wallet"
            >
              {addingFunds ? <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"/> : <FiDollarSign />}
              Deposit Funds
            </button>
            <button
              onClick={() => runROI()}
              disabled={runningROI}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all"
              title="Development: Simulates the midnight cron job"
            >
              {runningROI ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <FiCpu />}
              Run ROI (Dev)
            </button>
            <button
              onClick={() => setIsInvestModalOpen(true)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl font-bold shadow-lg"
            >
              <FiPlus /> Invest
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Wallet Balance" amount={summary?.walletBalance} icon={<FiDollarSign size={24} />} color="from-emerald-400 to-teal-500" loading={sumLoading} />
          <StatCard title="Total Investments" amount={summary?.totalInvestments} icon={<FiActivity size={24} />} color="from-purple-400 to-indigo-500" loading={sumLoading} />
          <StatCard title="Total ROI Earned" amount={summary?.totalROIEarned} icon={<FiTrendingUp size={24} />} color="from-blue-400 to-cyan-500" loading={sumLoading} />
          <StatCard title="Total Level Income" amount={summary?.totalLevelIncome} icon={<FiUsers size={24} />} color="from-pink-400 to-rose-500" loading={sumLoading} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Wallet Balance Growth" data={walletChart} loading={walletLoading} dataKey="balance" strokeColor="#10b981" />
          <ChartCard title="ROI Growth History" data={chartData} loading={chartLoading} dataKey="amount" strokeColor="#8b5cf6" />
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InvestmentHistoryTable />
          <ROIHistoryTable />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReferralIncomeTable />
          <ReferralTree />
        </div>

        {/* Recent Transactions */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>
          {txLoading ? (
            <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"/></div>
          ) : recentTx?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentTx.map((tx) => {
                    let badgeColor = 'bg-slate-500/20 text-slate-300';
                    if (tx.type === 'Deposit') badgeColor = 'bg-blue-500/20 text-blue-300';
                    if (tx.type === 'Investment') badgeColor = 'bg-purple-500/20 text-purple-300';
                    if (tx.type === 'ROI Credit') badgeColor = 'bg-emerald-500/20 text-emerald-300';
                    if (tx.type === 'Referral Credit') badgeColor = 'bg-pink-500/20 text-pink-300';
                    if (tx.type === 'Withdrawal') badgeColor = 'bg-rose-500/20 text-rose-300';

                    return (
                      <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'} shadow-inner`}>
                            {tx.amount > 0 ? <FiTrendingUp size={18} /> : <FiActivity size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white">{tx.type}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${badgeColor}`}>{tx.type}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(tx.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                          {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 font-medium">No recent transactions</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-8">
          <p className="text-xs text-slate-400">
            Last ROI Process: <span className="font-bold text-white">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 12:00 AM</span>
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Status: Success</span>
          </div>
        </div>

      </main>
    </div>
  );
};

const StatCard = ({ title, amount, icon, color, loading }) => (
  <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
    <div className="flex justify-between items-start mb-6 relative z-10">
      <p className="text-sm font-bold text-slate-300 uppercase tracking-wider">{title}</p>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        {icon}
      </div>
    </div>
    <h3 className="text-3xl font-extrabold text-white relative z-10 drop-shadow-sm">
      {loading ? (
        <div className="h-9 w-24 bg-white/20 rounded animate-pulse" />
      ) : (
        `₹${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      )}
    </h3>
  </div>
);

const ChartCard = ({ title, data, loading, dataKey, strokeColor }) => (
  <div className="glass-panel rounded-2xl p-6">
    <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
    <div className="h-72">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"/></div>
      ) : data?.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.5}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(10px)' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={3} fillOpacity={1} fill={`url(#color-${dataKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No chart data available yet</div>
      )}
    </div>
  </div>
);

export default Dashboard;
