import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../utils/LoadingButton";
import FileUploader from "../../utils/FileUploader";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { Category } from "../../../interfaces/interfaces";
import notify from "../../utils/Notify";

// Validation function
const createValidateForm = (formData: any, setErrors: any, t: any) => {
  const newErrors = new Map<string, string>();

  if (!formData.title)
    newErrors.set(
      "title",
      t("createUpdateBookDialog.create.validation.titleRequired")
    );
  if (!formData.author)
    newErrors.set(
      "author",
      t("createUpdateBookDialog.create.validation.authorRequired")
    );
  if (!formData.category)
    newErrors.set(
      "category",
      t("createUpdateBookDialog.create.validation.categoryRequired")
    );
  if (!formData.price || isNaN(Number(formData.price))) {
    newErrors.set(
      "price",
      t("createUpdateBookDialog.create.validation.priceRequired")
    );
  }
  if (!formData.count || isNaN(Number(formData.count))) {
    newErrors.set(
      "count",
      t("createUpdateBookDialog.create.validation.countRequired")
    );
  }
  if (formData.status === "online" && !formData.bookPdfFile) {
    newErrors.set(
      "bookPdfFile",
      t("createUpdateBookDialog.create.validation.pdfRequired")
    );
  }
  if (!formData.bookCoverFile) {
    newErrors.set(
      "bookCoverFile",
      t("createUpdateBookDialog.create.validation.coverRequired")
    );
  }

  setErrors(newErrors);
  return newErrors.size === 0; // Return true if no errors
};

type CreateUpdatePropsType = {
  showCreateUpdateDialog: boolean;
  setShowCreateUpdateDialog: Dispatch<SetStateAction<boolean>>;
  createUpdateDialogMethod: "create" | "update";
  setCreateUpdateDialogMethod: Dispatch<SetStateAction<"create" | "update">>;
};

const CreateUpdateBook = ({
  showCreateUpdateDialog,
  setShowCreateUpdateDialog,
  createUpdateDialogMethod,
}: CreateUpdatePropsType) => {
  const { t } = useTranslation();

  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    author: "",
    category: "",
    count: "",
    status: "online",
    bookCover: "",
    bookCoverFile: null as File | null, // Storing file object
    bookPdf: "",
    bookPdfFile: null as File | null, // Storing file object for PDF
  });

  const handleClose = () => setShowCreateUpdateDialog(false);

  useEffect(() => {
    authAxios(false, ApiEndpoints.getCategories).then((response) => {
      setCategories(response?.data?.data?.categories);
    });
  }, []);

  // Handle form input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle file upload for book cover and PDF
  const handleFileChange = (name: string, file: File | null) => {
    errors.has(name) && errors.delete(name);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: file,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = createValidateForm(formData, setErrors, t);

    if (!isValid) {
      const modal = document?.querySelector(".modal");
      if (
        modal &&
        (errors.has("bookCoverFile") ||
          (errors.has("bookPdfFile") && formData.status === "online"))
      ) {
        modal.scrollTo({ top: 0, behavior: "smooth" });
      }

      return false;
    }

    // prepare data
    let data: any = {
      title: formData.title,
      price: formData.price,
      author: formData.author,
      category: formData.category,
      count: formData.count,
      status: formData.status,
    };
    if (formData.bookPdfFile) {
      data.bookFile = formData.bookPdfFile;
    }
    if (formData.bookCoverFile) {
      data.image = formData.bookCoverFile;
    }

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.createBook,
      "POST",
      data,
      "multipart/form-data"
    );
    setLoading(false);

    if (response.status === 201) {
      notify(t("createUpdateBookDialog.create.book.createSuccess"), "success");
      setFormData({
        author: "",
        bookCover: "",
        bookCoverFile: null as File | null,
        bookPdf: "",
        category: "",
        bookPdfFile: null as File | null,
        count: "",
        price: "",
        status: "online",
        title: "",
      });
      data = {};
      setShowCreateUpdateDialog(false);
    } else {
      notify(t("createUpdateBookDialog.create.book.createFail"), "error");
    }
  };

  return (
    <Modal
      className="custom-dialog"
      show={showCreateUpdateDialog}
      onHide={handleClose}
    >
      <Form onSubmit={handleCreate}>
        <Modal.Header closeButton>
          <Modal.Title className="text-capitalize">
            {createUpdateDialogMethod === "create"
              ? t("createUpdateBookDialog.createBook")
              : t("createUpdateBookDialog.updateBook")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* File Uploader for Book Cover */}
          <Form.Group controlId="uploadImage">
            <FileUploader
              type="image"
              onFileChange={(file) => handleFileChange("bookCoverFile", file)}
            />
            {errors.has("bookCoverFile") && (
              <Form.Control.Feedback
                className="d-flex justify-content-center"
                type="invalid"
              >
                {errors.get("bookCoverFile")}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Book Status */}
          <Row>
            <Col sm={12} md={formData.status === "online" ? 6 : 12}>
              <Form.Group className="mt-2" controlId="formBookStatus">
                <Form.Label className="m-0">
                  {t("createUpdateBookDialog.status")}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="online">
                    {t("createUpdateBookDialog.statusOptions.online")}
                  </option>
                  <option value="offline">
                    {t("createUpdateBookDialog.statusOptions.offline")}
                  </option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col
              sm={formData.status === "online" ? 12 : 0}
              md={formData.status === "online" ? 6 : 0}
            >
              {formData.status === "online" && (
                <Form.Group className="flex-1 mt-2" controlId="uploadPdf">
                  <FileUploader
                    type="pdf"
                    onFileChange={(file) =>
                      handleFileChange("bookPdfFile", file)
                    }
                  />
                  {errors.has("bookPdfFile") && (
                    <Form.Control.Feedback
                      className="d-flex justify-content-center"
                      type="invalid"
                    >
                      {errors.get("bookPdfFile")}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              )}
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={6}>
              {/* Title */}
              <Form.Group className="mt-2" controlId="formBookTitle">
                <Form.Label className="m-0">
                  {t("createUpdateBookDialog.title")}
                </Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t("createUpdateBookDialog.enterTitle")}
                />
                {errors.has("title") && (
                  <Form.Control.Feedback className="d-flex" type="invalid">
                    {errors.get("title")}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col sm={12} md={6}>
              {/* Author */}
              <Form.Group className="mt-2" controlId="formBookAuthor">
                <Form.Label className="m-0">
                  {t("createUpdateBookDialog.author")}
                </Form.Label>
                <Form.Control
                  type="text"
                  required
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder={t("createUpdateBookDialog.enterAuthor")}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              {/* Price */}
              <Form.Group className="mt-2" controlId="formBookPrice">
                <Form.Label className="m-0">
                  {t("createUpdateBookDialog.price")}
                </Form.Label>
                <Form.Control
                  type="number"
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={t("createUpdateBookDialog.enterPrice")}
                />
                {errors.has("price") && (
                  <Form.Control.Feedback className="d-flex" type="invalid">
                    {errors.get("price")}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col xs={6}>
              {/* Count */}
              <Form.Group className="mt-2" controlId="formBookCount">
                <Form.Label className="m-0">
                  {t("createUpdateBookDialog.count")}
                </Form.Label>
                <Form.Control
                  type="number"
                  required
                  name="count"
                  value={formData.count}
                  onChange={handleInputChange}
                  placeholder={t("createUpdateBookDialog.enterCount")}
                />
                {errors.has("count") && (
                  <Form.Control.Feedback className="d-flex" type="invalid">
                    {errors.get("count")}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              {/* Category */}
              <Form.Group className="mt-2" controlId="formBookCategory">
                <Form.Label className="m-0">
                  {t("createUpdateBookDialog.category")}
                </Form.Label>
                <Form.Control
                  as="select"
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">
                    {t("createUpdateBookDialog.selectCategory")}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
                {errors.has("category") && (
                  <Form.Control.Feedback className="d-flex" type="invalid">
                    {errors.get("category")}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("close")}
          </Button>
          <LoadingButton variant="main" type="submit" loading={loading}>
            {createUpdateDialogMethod === "create"
              ? t("createUpdateBookDialog.createBook")
              : t("createUpdateBookDialog.updateBook")}
          </LoadingButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUpdateBook;
