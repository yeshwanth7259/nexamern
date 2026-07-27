import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const InvestNowModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');

  // Fetch available investment plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const res = await api.get('/investments/plans');
      return res.data.data;
    },
    enabled: isOpen
  });

  // Create investment mutation
  const { mutate: createInvestment, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/investments', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Investment successfully created!');
      // Invalidate queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['recentTx'] });
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['chartData'] });
      queryClient.invalidateQueries({ queryKey: ['walletChart'] });
      onClose();
      setSelectedPlan(null);
      setAmount('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create investment');
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlan || !amount) {
      toast.error('Please select a plan and enter an amount');
      return;
    }
    createInvestment({ planId: selectedPlan._id, amount: Number(amount) });
  };

  const estimatedDaily = selectedPlan && amount ? (Number(amount) * selectedPlan.dailyROIPercentage) / 100 : 0;
  const estimatedTotal = selectedPlan && amount ? estimatedDaily * selectedPlan.durationDays : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative z-10 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold text-white mb-6">Invest Now</h2>
        
        {plansLoading ? (
          <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"/></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Select Plan</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans?.map(plan => (
                  <div 
                    key={plan._id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedPlan?._id === plan._id ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-white/10 bg-black/20 hover:border-white/30'}`}
                  >
                    <div className="font-bold text-white">{plan.name}</div>
                    <div className="text-xs text-slate-300 mt-1">{plan.dailyROIPercentage}% Daily for {plan.durationDays} days</div>
                    <div className="text-[10px] text-slate-400 mt-1">Min: ₹{plan.minAmount} | Max: ₹{plan.maxAmount}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPlan && (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Investment Amount (₹)</label>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={selectedPlan.minAmount}
                  max={selectedPlan.maxAmount}
                  className="w-full px-4 py-3 input-glass rounded-xl transition-all font-bold text-lg"
                  placeholder={`Min ₹${selectedPlan.minAmount}`}
                />
                
                {amount && Number(amount) >= selectedPlan.minAmount && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm text-emerald-200 font-medium">Estimated Returns Preview</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-slate-300">Daily Return:</span>
                      <span className="font-bold text-emerald-400">+₹{estimatedDaily.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-slate-300">Total Return ({selectedPlan.durationDays} days):</span>
                      <span className="font-bold text-emerald-400">+₹{estimatedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!selectedPlan || !amount || isPending || Number(amount) < selectedPlan.minAmount || Number(amount) > selectedPlan.maxAmount}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InvestNowModal;
