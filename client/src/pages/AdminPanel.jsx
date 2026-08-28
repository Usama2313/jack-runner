import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [userId, setUserId] = useState('');
  const [levels, setLevels] = useState(''); // comma separated numbers
  const [activate, setActivate] = useState(false);
  const [message, setMessage] = useState('');

  const handleUnlock = async () => {
    try {
      const levelArray = levels.split(',').map(l => Number(l.trim())).filter(l => !isNaN(l));
      const res = await axios.post('/api/admin/unlock-levels', { userId, levels: levelArray });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error');
    }
  };

  const handleActivate = async () => {
    try {
      const res = await axios.post('/api/admin/activate', { userId, activated: activate });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="admin-panel container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {message && <div className="mb-4 p-2 bg-gray-100 rounded">{message}</div>}
      <div className="mb-4">
        <label className="block font-medium">User ID</label>
        <input
          type="number"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Unlock Levels (comma separated)</label>
        <input
          type="text"
          value={levels}
          onChange={e => setLevels(e.target.value)}
          className="border rounded w-full p-2"
        />
        <button onClick={handleUnlock} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Unlock Levels
        </button>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={activate}
            onChange={e => setActivate(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2">Activate Premium</span>
        </label>
        <button onClick={handleActivate} className="ml-4 bg-green-600 text-white px-4 py-2 rounded">
          Set Activation
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
