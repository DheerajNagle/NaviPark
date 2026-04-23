import { useState, useEffect } from 'react';
import { lostFoundAPI } from '../services/api';
import { Search, PlusCircle } from 'lucide-react';

const LostFound = () => {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'report'
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await lostFoundAPI.getReports();
        setReports(reportsData);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await lostFoundAPI.createReport({
        item: formData.get('item'),
        location: formData.get('location'),
        reporter_contact: formData.get('contact'),
      });
      
      // Refresh reports
      const reportsData = await lostFoundAPI.getReports();
      setReports(reportsData);
      
      // Reset form and switch to search tab
      e.target.reset();
      setActiveTab('search');
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Lost & Found</h2>
      
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
        <button 
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'search' ? 'border-sky-500 dark:border-sky-400 text-sky-500 dark:text-sky-400' : 'border-transparent text-slate-500'}`}
          onClick={() => setActiveTab('search')}
        >
          Search Items
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'report' ? 'border-sky-500 dark:border-sky-400 text-sky-500 dark:text-sky-400' : 'border-transparent text-slate-500'}`}
          onClick={() => setActiveTab('report')}
        >
          Report Lost
        </button>
      </div>

      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search found items..." 
              className="input-field pl-10 text-sm py-2.5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-4 text-slate-500 text-sm">Loading reports...</div>
            ) : reports
              .filter(report => 
                searchTerm === '' || 
                report.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.location.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(report => (
              <div key={report.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-sm">{report.item}</h4>
                <p className="text-xs text-slate-500 mt-1">Found near: {report.location}</p>
                <span className="inline-block mt-2 text-[10px] uppercase font-bold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                  {report.status}
                </span>
                {report.reporter_name && (
                  <p className="text-xs text-slate-400 mt-1">Reported by: {report.reporter_name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <form className="space-y-3" onSubmit={handleReportSubmit}>
          <input type="text" name="item" placeholder="What did you lose?" className="input-field text-sm py-2.5" required />
          <input type="text" name="location" placeholder="Where did you last have it?" className="input-field text-sm py-2.5" required />
          <input type="text" name="contact" placeholder="Contact Number" className="input-field text-sm py-2.5" required />
          <button type="submit" className="btn btn-primary w-full text-sm py-2.5">
            <PlusCircle size={16} className="mr-2" /> Submit Report
          </button>
        </form>
      )}
    </div>
  );
};

export default LostFound;
