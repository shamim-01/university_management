// Temporary Cloudinary Mock
export const uploadToCloudinary = async (file, folder = 'university') => {
  console.log('📤 Cloudinary mock upload');
  return {
    secure_url: 'https://via.placeholder.com/500',
    public_id: 'mock-' + Date.now()
  };
};

export const deleteFromCloudinary = async (publicId) => {
  console.log('🗑️ Cloudinary mock delete:', publicId);
  return { result: 'ok' };
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary
};