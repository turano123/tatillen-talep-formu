import React, { useState, useEffect } from 'react';
import './AdminPage.css';

function AdminPage() {
  const [rooms, setRooms] = useState(() => {
    const stored = localStorage.getItem('rooms');
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [],
    weekdayPrice: '',
    weekendPrice: ''
  });

  const [editIndex, setEditIndex] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRoom = {
      name: formData.name,
      description: formData.description,
      images: formData.images,
      weekdayPrice: formData.weekdayPrice,
      weekendPrice: formData.weekendPrice
    };

    let updatedRooms;

    if (editIndex !== null) {
      const updated = [...rooms];
      updated[editIndex] = newRoom;
      updatedRooms = updated;
      setRooms(updated);
      setEditIndex(null);
    } else {
      updatedRooms = [...rooms, newRoom];
      setRooms(updatedRooms);
    }

    // 🧠 localStorage'a kaydet
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));

    setFormData({
      name: '',
      description: '',
      images: [],
      weekdayPrice: '',
      weekendPrice: ''
    });
  };

  const handleEdit = (index) => {
    const selected = rooms[index];
    setFormData({
      name: selected.name,
      description: selected.description,
      images: selected.images,
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
                    <img key={i} src={img.previewUrl} alt="oda" width="60" />
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
