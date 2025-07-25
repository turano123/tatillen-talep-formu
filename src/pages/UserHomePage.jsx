import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserHomePage.css';
import api from '../api/axiosInstance';

function UserHomePage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error('Odalar yüklenirken hata oluştu:', err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="room-list">
      <h2>Odalar</h2>
      <div className="room-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room._id}>
            <img
              src={room.images[0] || ''}
              alt="oda görseli"
              className="room-image"
            />
            <div className="room-info">
              <h3>{room.name}</h3>
              <p>Hafta İçi: {room.weekdayPrice}₺</p>
              <p>Hafta Sonu: {room.weekendPrice}₺</p>
              <Link to={`/oda/${room._id}`} className="detail-btn">
                Detaylı İncele
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserHomePage;
