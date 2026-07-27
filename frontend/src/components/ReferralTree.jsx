import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { FiUsers, FiUser } from 'react-icons/fi';

const TreeNode = ({ node, level = 0 }) => {
  const isYou = level === 0;

  return (
    <div className="relative">
      <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all my-2 ${isYou ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-black/20 border-white/10 hover:bg-black/30'}`}>
        <div className={`p-2 rounded-lg ${isYou ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300'}`}>
          {isYou ? <FiUsers size={18} /> : <FiUser size={18} />}
        </div>
        <div>
          <p className="font-bold text-white">{isYou ? 'You' : node.fullName}</p>
          {!isYou && <p className="text-xs text-slate-400">Level {level} • Ref: {node.referralCode}</p>}
        </div>
      </div>
      
      {node.children && node.children.length > 0 && (
        <div className="ml-6 pl-4 border-l-2 border-white/10 relative">
          {node.children.map(child => (
            <div key={child._id} className="relative">
              {/* Connector line */}
              <div className="absolute top-8 -left-4 w-4 h-0.5 bg-white/10"></div>
              <TreeNode node={child} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralTree = () => {
  const { data: treeData, isLoading } = useQuery({
    queryKey: ['referralTree'],
    queryFn: async () => {
      const res = await api.get('/referrals/tree');
      return res.data.data;
    }
  });

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Referral Tree</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"/></div>
      ) : treeData ? (
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-[300px]">
            <TreeNode node={treeData} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <div className="p-4 rounded-full bg-white/5 mb-4">
            <FiUsers size={32} className="opacity-50" />
          </div>
          <p className="font-medium">No referrals yet. Share your code to build your tree.</p>
        </div>
      )}
    </div>
  );
};

export default ReferralTree;
