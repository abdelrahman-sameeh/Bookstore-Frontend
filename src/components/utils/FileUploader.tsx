import React, { useState, useRef } from "react";
import { Button, Form, Image, Alert } from "react-bootstrap";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";

type FileUploaderPropsTypes = {
  type: "image" | "pdf";
  onFileChange: (file: File | null) => void; // New prop to handle file change
};

const FileUploader = ({ type, onFileChange }: FileUploaderPropsTypes) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t("fileUploader.fileTooLarge"));
        resetFile();
        return;
      }

      // Check file type
      if (type === "image" && !file.type.startsWith("image/")) {
        setError(t("fileUploader.invalidImageType"));
        resetFile();
        return;
      } else if (type === "pdf" && file.type !== "application/pdf") {
        setError(t("fileUploader.invalidPdfType"));
        resetFile();
        return;
      }

      // If all validations pass
      setError(null);
      setSelectedFile(file);
      setFileType(file.type);
      onFileChange(file); // Call the passed function with the selected file

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const resetFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    setSelectedFile(null);
    setPreview(null);
    setFileType("");
    setError(null);
    onFileChange(null);
  };

  const handleDelete = () => {
    resetFile();
  };

  const handleUpdate = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Form.Group>
        {!selectedFile && (
          <label
            htmlFor={type}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Icon icon="uil:image-upload" className="fs-1" />
            <p>
              {type === "image"
                ? t("fileUploader.uploadImage")
                : t("fileUploader.uploadPdf")}
            </p>
          </label>
        )}

        <Form.Control
          id={type}
          type="file"
          accept={type === "image" ? "image/*" : "application/pdf"}
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        {error && <Alert variant="danger">{error}</Alert>}

        {preview && fileType.startsWith("image/") && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Image
              src={preview}
              alt="Selected"
              style={{ width: "150px", height: "150px", objectFit: "contain" }}
            />
          </div>
        )}

        {type === "pdf" && fileType.startsWith("application/pdf") && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            {t("fileUploader.prfUploadedSuccessfully")}
          </div>
        )}

        {selectedFile && (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button variant="warning" onClick={handleUpdate}>
              <Icon icon="radix-icons:update" />
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Icon icon="ph:trash" />
            </Button>
          </div>
        )}
      </Form.Group>
    </div>
  );
};

export default FileUploader;
