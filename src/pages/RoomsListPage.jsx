import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RoomListPage.css';

function RoomListPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  return (
    <div className="room-list">
      <h2>Tüm Odalar</h2>
      <div className="room-grid">
        {rooms.length === 0 ? (
          <p>Henüz oda eklenmemiş.</p>
        ) : (
          rooms.map((room, index) => (
            <div className="room-card" key={index}>
              {room.images && room.images.length > 0 && (
                <img
                  src={
                    typeof room.images[0] === 'string'
                      ? room.images[0]
                      : URL.createObjectURL(room.images[0])
                  }
                  alt="oda görseli"
                  className="room-image"
                />
              )}
              <div className="room-info">
                <h3>{room.name}</h3>
                <p>Hafta İçi: {room.weekdayPrice}₺</p>
                <p>Hafta Sonu: {room.weekendPrice}₺</p>
                <Link
                  to={`/oda/${index}`}
                  state={{ room }} // 💥 en kritik kısım
                  className="detail-btn"
                >
                  Detaylı İncele
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RoomListPage;
