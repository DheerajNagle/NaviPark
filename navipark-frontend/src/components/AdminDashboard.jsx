import { useState } from 'react';
import { Activity, ShieldCheck, Map, Settings2 } from 'lucide-react';

const mockReports = [
  { id: 101, item: 'Keys with blue lanyard', status: 'Pending Verification', user: '+15550001234' },
  { id: 102, item: 'Black Leather Wallet', status: 'New', user: 'guest@gmail.com' }
];

const AdminDashboard = () => {
  const [reports, setReports] = useState(mockReports);

  const resolveReport = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

  return (
    <div className="space-y-6">
      <div className="card bg-purple-500/10 border-purple-500/20">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-purple-600 dark:text-purple-400" size={24} />
          <h2 className="text-xl font-bold text-purple-700 dark:text-purple-400">Admin Control Center</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">You have elevated privileges. Actions taken here affect the live facility.</p>
      </div>

      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity size={20} className="text-primary-light dark:text-primary-dark" />
          System Health
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="card !p-4">
            <span className="block text-xs uppercase text-slate-500 mb-1">Active Users</span>
            <span className="text-2xl font-bold">342</span>
          </div>
          <div className="card !p-4">
            <span className="block text-xs uppercase text-slate-500 mb-1">Hardware Status</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> All Systems Operational
            </span>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Map size={20} className="text-primary-light dark:text-primary-dark" />
          Map Override Tool
        </h3>
        <p className="text-sm text-slate-500 mb-4">Manually mark slots as closed for maintenance or reserved.</p>
        <div className="flex gap-2">
          <input type="text" placeholder="Slot ID (e.g. B2-A12)" className="input-field flex-1" />
          <button className="btn bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 whitespace-nowrap">
            <Settings2 size={18} className="mr-2" /> Mark Closed
          </button>
        </div>
      </section>

      <section className="card border-red-500/20">
        <h3 className="text-lg font-semibold mb-4">Active Lost & Found Reports</h3>
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm">{report.item}</h4>
                <p className="text-xs text-slate-500">Reported by: {report.user}</p>
                <span className={`inline-block mt-2 text-[10px] uppercase font-bold px-2 py-1 rounded ${report.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {report.status}
                </span>
              </div>
              {report.status !== 'Resolved' && (
                <button 
                  onClick={() => resolveReport(report.id)}
                  className="text-xs font-semibold px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
