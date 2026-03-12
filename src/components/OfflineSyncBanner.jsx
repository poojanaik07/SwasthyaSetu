import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { getPendingCount, syncAll } from '../utils/offlineStorage';

export default function OfflineSyncBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ done: 0, total: 0 });
  const [justSynced, setJustSynced] = useState(false);

  useEffect(() => {
    const handleOnline = () => { setOnline(true); fetchPending(); };
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    fetchPending();
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  async function fetchPending() {
    try { setPending(await getPendingCount()); } catch {}
  }

  async function handleSync() {
    if (!online || syncing) return;
    setSyncing(true);
    setJustSynced(false);
    try {
      await syncAll((done, total) => setSyncProgress({ done, total }));
      setPending(0);
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 3000);
    } catch {}
    setSyncing(false);
  }

  if (online && pending === 0 && !justSynced) return null;

  const pct = syncProgress.total > 0 ? Math.round((syncProgress.done / syncProgress.total) * 100) : 0;

  return (
    <div className={`offline-banner ${justSynced ? 'online' : syncing ? 'syncing' : online ? 'online' : 'offline'}`}>
      {justSynced ? (
        <><CheckCircle size={18} /> <span>All {syncProgress.total} records synced successfully!</span></>
      ) : syncing ? (
        <>
          <span className="spinning"><RefreshCw size={18} /></span>
          <span>Syncing {syncProgress.done}/{syncProgress.total} records...</span>
          <div className="sync-progress">
            <div className="sync-progress-bar"><div className="sync-progress-fill" style={{ width: `${pct}%` }} /></div>
          </div>
        </>
      ) : online && pending > 0 ? (
        <>
          <Wifi size={18} />
          <span>Back online! <strong>{pending} record{pending > 1 ? 's' : ''}</strong> pending sync.</span>
          <button className="btn btn-sm btn-primary" onClick={handleSync} style={{ marginLeft: 'auto' }}>
            <RefreshCw size={14} /> Sync Now
          </button>
        </>
      ) : (
        <>
          <WifiOff size={18} />
          <span>You're offline. Data will be saved locally and synced when connected.</span>
          {pending > 0 && <span className="badge badge-yellow" style={{ marginLeft: 'auto' }}>{pending} pending</span>}
        </>
      )}
    </div>
  );
}
