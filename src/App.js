import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import UserHomePage from './pages/UserHomePage';
import RoomDetailPage from './pages/RoomDetailPage';

function App() {
  const [rooms, setRooms] = useState([]);

  // Sayfa yenilendiğinde localStorage'dan oda verilerini çek
  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  return (
    <Routes>
      {/* Admin paneli (oda ekleme vb.) */}
      <Route path="/admin" element={<AdminPage setRooms={setRooms} />} />

      {/* Kullanıcı ana sayfası (oda listesi) */}
      <Route path="/" element={<UserHomePage rooms={rooms} />} />

      {/* Detay sayfası */}
      <Route path="/oda/:index" element={<RoomDetailPage />} />
    </Routes>
  );
}

export default App;
