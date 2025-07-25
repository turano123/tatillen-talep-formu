import React from 'react';
import { Link } from 'react-router-dom';
import './UserHomePage.css';

function UserHomePage({ rooms }) {
  return (
    <div className="room-list">
      <h2>Odalar</h2>
      <div className="room-grid">
        {rooms.map((room, index) => (
          <div className="room-card" key={index}>
            <img
              src={room.images[0]?.previewUrl || ''}
              alt="oda görseli"
              className="room-image"
            />
            <div className="room-info">
              <h3>{room.name}</h3>
              <p>Hafta İçi: {room.weekdayPrice}₺</p>
              <p>Hafta Sonu: {room.weekendPrice}₺</p>
              <Link to={`/oda/${index}`} className="detail-btn">
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
