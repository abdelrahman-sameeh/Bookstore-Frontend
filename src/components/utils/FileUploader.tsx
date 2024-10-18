import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Image, Alert } from "react-bootstrap";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";

type FileUploaderPropsTypes = {
  type: "image" | "pdf";
  fileUrl: string | null; // Here, the file is passed as a URL string
  onFileChange: (file: File | null | "delete") => void;
};

const FileUploader = ({
  type,
  fileUrl,
  onFileChange,
}: FileUploaderPropsTypes) => {
  const [selectedFile, setSelectedFile] = useState<File | null | "delete">(
    null
  );
  const [preview, setPreview] = useState<string | null>(fileUrl);
  const [fileType] = useState<string>(
    type === "image" ? "image/*" : "application/pdf"
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (fileUrl) {
      setPreview(fileUrl);
    }
  }, [fileUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t("fileUploader.fileTooLarge"));
        resetFile();
        return;
      }

      if (type === "image" && !file.type.startsWith("image/")) {
        setError(t("fileUploader.invalidImageType"));
        resetFile();
        return;
      } else if (type === "pdf" && file.type !== "application/pdf") {
        setError(t("fileUploader.invalidPdfType"));
        resetFile();
        return;
      }

      setError(null);
      setSelectedFile(file);
      onFileChange(file);

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
    if (fileUrl) {
      onFileChange("delete");
      setSelectedFile('delete');
    } else {
      setSelectedFile(null);
      onFileChange(null);
    }
    setPreview(null);
    setError(null);
  };


  const handleDelete = () => {
    resetFile();
  };

  const handleUpdate = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Form.Group className="position-relative" style={{paddingBottom: ((selectedFile && selectedFile!='delete') || preview) ? '30px': '', width: 'fit-content', border: '2px solid var(--main-bg)', minWidth: '200px', borderRadius: '10px'}}>
        {(!selectedFile || selectedFile=='delete') && !preview && (
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
          <div style={{ textAlign: "center" }}>
            <Image
              src={preview}
              alt="Selected"
              style={{ width: "150px", height: "150px", objectFit: "contain" }}
            />
          </div>
        )}

        {type === "pdf" && preview && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            {preview ? <p>{t("fileUploader.pdfExist")}</p> : null}
            {selectedFile && selectedFile!='delete' ? (
              <Alert variant="success">
                {t("fileUploader.pdfUploadedSuccessfully")}
              </Alert>
            ) : null}

          </div>
        )}

        {((selectedFile && selectedFile!='delete') || preview) && (
          <div
          className="position-absolute"
            style={{ display: "flex", bottom: '1px', justifyContent: "center", width: '100%' }}
          >
            <Button style={{height: '30px', display: 'flex', alignItems: 'center'}} variant="warning" onClick={handleUpdate}>
            <Icon icon="tabler:edit" />
            </Button>
            <Button style={{height: '30px', display: 'flex', alignItems: 'center'}} variant="danger" onClick={handleDelete}>
              <Icon icon="ph:trash" />
            </Button>
          </div>
        )}
      </Form.Group>
    </div>
  );
};

export default FileUploader;
