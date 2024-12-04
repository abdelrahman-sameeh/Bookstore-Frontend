import React, { useState, useRef, useEffect } from "react";
import { Button, Image } from "react-bootstrap";

const ProfilePictureUploader = ({ initialImage, onUpload, onDelete }: any) => {
  const [preview, setPreview] = useState(initialImage); // الصورة الحالية أو الجديدة
  const fileInputRef = useRef<HTMLInputElement>(null); // مرجع لحقل اختيار الصورة

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result); // عرض الصورة الجديدة
      reader.readAsDataURL(file);
      onUpload(file); // إرسال الصورة للباك-إند
    }
  };

  const handleDelete = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    setPreview(initialImage || null);
    onDelete();
  };

  return (
    <div className="text-center mb-4 position-relative">
      <div
        className="image-uploader bg-secondary d-inline-block rounded-circle accordion-flush"
        style={{
          width: 120,
          height: 120,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => fileInputRef.current?.click()} // عند الضغط، يتم فتح اختيار الملفات
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile Preview"
            roundedCircle
            width={120}
            height={120}
          />
        ) : (
          <div className="text-white d-flex justify-content-center align-items-center h-100">
            + صورة
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {(preview && !preview.startsWith('http'))&& (
        <Button
          className="mt-2 position-absolute rounded-full"
          style={{ top: "0", left: `40%` }}
          variant="danger"
          onClick={handleDelete}
        >
          x
        </Button>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
