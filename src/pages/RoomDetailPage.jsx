import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RoomDetailPage.css';
import api from '../api/axiosInstance';

function RoomDetailPage() {
  const { id } = useParams(); // URL'den MongoDB id'sini alıyoruz
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await api.get(`/rooms/${id}`); // MongoDB'den odayı çek
        setRoom(res.data);
      } catch (err) {
        console.error('Oda verisi alınamadı:', err);
      }
    }
    fetchRoom();
  }, [id]);

  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    adults: '',
    children: '',
    childAges: [],
    breakfast: 'Dahil',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChildAgeChange = (index, value) => {
    const updatedAges = [...form.childAges];
    updatedAges[index] = value;
    setForm((prev) => ({ ...prev, childAges: updatedAges }));
  };

  const generateRequestId = () => {
    return Math.floor(Math.random() * 90000000 + 10000000);
  };

  const sendWhatsApp = () => {
    if (!room) return;
    const requestId = generateRequestId();
    let message = `📌 *TATILLEN REZERVASYON TALEBİ*\n\n`;
    message += `🏡 ${room.name}\n`;
    message += `🔕️ Giriş Tarihi: ${form.checkIn}\n`;
    message += `🔕️ Çıkış Tarihi: ${form.checkOut}\n`;
    message += `👨‍👩‍👧‍👦 Yetişkin Sayısı: ${form.adults}\n`;
    message += `🦲 Çocuk Sayısı: ${form.children}\n`;

    form.childAges.forEach((age, i) => {
      message += `👧 Çocuk${i + 1}: ${age} yaş\n`;
    });

    message += `🍳 Kahvaltı: ${form.breakfast}\n`;
    message += `🦑 Talep No: ${requestId}`;

    const encoded = encodeURIComponent(message);
    const phone = '905431665454';
    window.open(`https://wa.me/+${phone}?text=${encoded}`, '_blank');
  };

  const getImageSrc = (img) => {
    try {
      if (!img) return '';
      return typeof img === 'string' ? img : '';
    } catch (e) {
      console.error('Görsel hatası:', e);
      return '';
    }
  };

  const nextImage = () => {
    if (!room?.images?.length) return;
    setSelectedImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    if (!room?.images?.length) return;
    setSelectedImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1));
  };

  if (!room) return <p>Oda bilgisi bulunamadı veya yükleniyor...</p>;

  return (
    <div className="room-detail">
      <button className="back-button" onClick={() => navigate(-1)}>← Geri Dön</button>

      <h2>{room.name}</h2>

      <div className="slider-container">
        <button onClick={prevImage} className="slider-btn">←</button>
        <img
          src={getImageSrc(room.images[selectedImageIndex])}
          alt={`oda-${selectedImageIndex}`}
          className="slider-image"
        />
        <button onClick={nextImage} className="slider-btn">→</button>
      </div>

      <div className="gallery-thumbnails">
        {room.images?.map((img, i) => {
          const src = getImageSrc(img);
          return (
            <img
              key={i}
              src={src}
              alt={`thumb-${i}`}
              className={`thumbnail ${i === selectedImageIndex ? 'active' : ''}`}
              onClick={() => setSelectedImageIndex(i)}
            />
          );
        })}
      </div>

      <button className="open-modal-btn" onClick={() => setShowModal(true)}>
        Rezervasyon Talebi Gönder
      </button>

      {room.description && (
        <div
          className="room-description"
          style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            lineHeight: '1.6',
            fontSize: '16px',
            marginTop: '20px',
          }}
        >
          {room.description}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Rezervasyon Talep Formu</h3>

            <label>Giriş Tarihi:</label>
            <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} required />

            <label>Çıkış Tarihi:</label>
            <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} required />

            <label>Yetişkin Sayısı:</label>
            <input type="number" name="adults" value={form.adults} onChange={handleChange} required />

            <label>Çocuk Sayısı: <span style={{ fontSize: '12px' }}>(0-12 yaş)</span></label>
            <input type="number" name="children" value={form.children} onChange={handleChange} />

            {Number(form.children) > 0 && (
              <div>
                {[...Array(Number(form.children))].map((_, i) => (
                  <div key={i}>
                    <label>Çocuk {i + 1} Yaşı:</label>
                    <input
                      type="number"
                      value={form.childAges[i] || ''}
                      onChange={(e) => handleChildAgeChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            <label>Kahvaltı:</label>
            <select name="breakfast" value={form.breakfast} onChange={handleChange}>
              <option value="Dahil">Dahil</option>
              <option value="Hariç">Hariç</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
              <button style={{ backgroundColor: '#25d366' }} onClick={sendWhatsApp}>
                WhatsApp’a Gönder
              </button>
              <button style={{ backgroundColor: '#aaa' }} onClick={() => setShowModal(false)}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetailPage;
