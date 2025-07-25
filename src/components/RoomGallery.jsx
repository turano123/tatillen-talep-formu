import React from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

function RoomGallery({ images }) {
  const formattedImages = images.map(img => ({
    original: img.previewUrl,
    thumbnail: img.previewUrl
  }));

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ImageGallery items={formattedImages} showPlayButton={false} />
    </div>
  );
}

export default RoomGallery;
