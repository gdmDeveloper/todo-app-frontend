export const uploadImage = async (asset) => {
  const formData = new FormData();

  // Si estamos en web
  if (asset.file) {
    formData.append('file', asset.file);
  } else {
    // móvil
    formData.append('file', {
      uri: asset.uri,
      type: 'image/jpeg',
      name: 'cover.jpg',
    });
  }

  formData.append('upload_preset', 'todoApp');

  const res = await fetch('https://api.cloudinary.com/v1_1/dpafslbtz/image/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};
