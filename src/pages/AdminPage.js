import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import api from '../api/axiosInstance';

function AdminPage() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [],
    weekdayPrice: '',
    weekendPrice: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  // 🔁 Sayfa açıldığında odaları MongoDB'den çek
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error('Oda verisi alınamadı:', err);
      }
    };
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imagePreviews]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const base64Images = await Promise.all(
      formData.images.map(async (img) => {
        if (img.previewUrl.startsWith('blob:')) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // base64 string
            reader.onerror = reject;
            reader.readAsDataURL(img.file);
          });
        } else {
          return img.previewUrl; // mevcut görsel
        }
      })
    );

    const newRoom = {
      name: formData.name,
      description: formData.description,
      images: base64Images, // base64 string listesi
      weekdayPrice: formData.weekdayPrice,
      weekendPrice: formData.weekendPrice
    };

    try {
      const res = await api.post('/rooms', newRoom);
      setRooms([...rooms, res.data]);
      alert('Oda başarıyla kaydedildi!');
    } catch (err) {
      console.error('Kayıt hatası:', err);
      alert('Bir hata oluştu.');
    }

    setFormData({
      name: '',
      description: '',
      images: [],
      weekdayPrice: '',
      weekendPrice: ''
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const selected = rooms[index];
    setFormData({
      name: selected.name,
      description: selected.description,
      images: selected.images.map(img => ({
        file: null,
        previewUrl: img // string olarak saklandı
      })),
      weekdayPrice: selected.weekdayPrice,
      weekendPrice: selected.weekendPrice
    });
    setEditIndex(index);
  };

  return (
    <div className="admin-container">
      <h2>Oda Ekle</h2>
      <form className="room-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Oda Adı *" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Açıklama *" value={formData.description} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageChange} multiple />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
          {formData.images.map((img, idx) => (
            <img key={idx} src={img.previewUrl} alt="oda" width="80" />
          ))}
        </div>
        <input type="number" name="weekdayPrice" placeholder="Hafta İçi Fiyat *" value={formData.weekdayPrice} onChange={handleChange} required />
        <input type="number" name="weekendPrice" placeholder="Hafta Sonu Fiyat *" value={formData.weekendPrice} onChange={handleChange} required />
        <button type="submit">{editIndex !== null ? 'Güncelle' : 'Ekle'}</button>
      </form>

      <h3>Eklenen Odalar</h3>
      <table className="room-table">
        <thead>
          <tr>
            <th>Adı</th>
            <th>Açıklama</th>
            <th>Görseller</th>
            <th>Hafta İçi</th>
            <th>Hafta Sonu</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={index}>
              <td>{room.name}</td>
              <td>{room.description}</td>
              <td>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {room.images.map((img, i) => (
                    <img key={i} src={img} alt="oda" width="60" />
                  ))}
                </div>
              </td>
              <td>{room.weekdayPrice}₺</td>
              <td>{room.weekendPrice}₺</td>
              <td><button onClick={() => handleEdit(index)}>Düzenle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
