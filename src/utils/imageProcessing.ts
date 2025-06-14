
// 이미지를 base64로 변환하는 함수
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 이미지를 Canvas에 로드하는 함수
export const loadImageToCanvas = (imageFile: File): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(imageFile);
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // 이미지 크기 조정 (분석 성능 향상)
      const maxSize = 400;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      URL.revokeObjectURL(imageUrl);
      resolve(canvas);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('이미지 로드 실패'));
    };
    
    img.src = imageUrl;
  });
};
