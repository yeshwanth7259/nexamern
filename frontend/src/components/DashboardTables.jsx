import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { FiActivity, FiTrendingUp, FiUsers } from 'react-icons/fi';

const TableSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-14 bg-white/5 rounded-xl"></div>
    ))}
  </div>
);

const EmptyState = ({ message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
    <div className="p-4 rounded-full bg-white/5 mb-4">
      <Icon size={32} className="opacity-50" />
    </div>
    <p className="font-medium">{message}</p>
  </div>
);

export const InvestmentHistoryTable = () => {
  const { data: investments, isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const res = await api.get('/investments');
      return res.data.data;
    }
  });

  return (
    <div className="glass-panel rounded-2xl p-6 overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold text-white mb-6">Investment History</h2>
      {isLoading ? <TableSkeleton /> : investments?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-2 font-semibold">Plan</th>
                <th className="pb-3 px-2 font-semibold">Amount</th>
                <th className="pb-3 px-2 font-semibold">Daily ROI</th>
                <th className="pb-3 px-2 font-semibold">Status</th>
                <th className="pb-3 px-2 font-semibold">End Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {investments.map(inv => (
                <tr key={inv._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-bold text-white">{inv.planId?.name || 'Plan'}</td>
                  <td className="py-3 px-2 font-medium text-slate-200">₹{inv.amount}</td>
                  <td className="py-3 px-2 font-medium text-emerald-400">{inv.dailyROI}%</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${inv.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-300'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-400">{new Date(inv.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No investments yet. Start your first investment to begin earning ROI." icon={FiActivity} />
      )}
    </div>
  );
};

export const ROIHistoryTable = () => {
  const { data: roiHistory, isLoading } = useQuery({
    queryKey: ['roiHistory'],
    queryFn: async () => {
      const res = await api.get('/dashboard/roi-history');
      return res.data.data;
    }
  });

  return (
    <div className="glass-panel rounded-2xl p-6 overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold text-white mb-6">ROI History</h2>
      {isLoading ? <TableSkeleton /> : roiHistory?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-2 font-semibold">Date</th>
                <th className="pb-3 px-2 font-semibold">Amount</th>
                <th className="pb-3 px-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {roiHistory.map(roi => (
                <tr key={roi._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-medium text-slate-200">{roi.date}</td>
                  <td className="py-3 px-2 font-bold text-emerald-400">+₹{roi.amount.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400">
                      {roi.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No ROI earned yet. ROI is calculated daily for active investments." icon={FiTrendingUp} />
      )}
    </div>
  );
};

export const ReferralIncomeTable = () => {
  const { data: incomeTx, isLoading } = useQuery({
    queryKey: ['referralIncome'],
    queryFn: async () => {
      const res = await api.get('/referrals/income');
      return res.data.data;
    }
  });

  return (
    <div className="glass-panel rounded-2xl p-6 overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold text-white mb-6">Referral Income</h2>
      {isLoading ? <TableSkeleton /> : incomeTx?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-2 font-semibold">Date</th>
                <th className="pb-3 px-2 font-semibold">Amount</th>
                <th className="pb-3 px-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {incomeTx.map(tx => (
                <tr key={tx._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-medium text-slate-200">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-2 font-bold text-emerald-400">+₹{tx.amount.toFixed(2)}</td>
                  <td className="py-3 px-2 text-slate-300">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No referral income yet. Invite friends to start earning." icon={FiUsers} />
      )}
    </div>
  );
};
