import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { useRecoilState } from "recoil";
import { Book, Category } from "../../../../interfaces/interfaces";
import { ownerBookState } from "../../../../recoil/bookAtom";
import authAxios from "../../../../api/authAxios";
import { ApiEndpoints } from "../../../../api/ApiEndpoints";
import notify from "../../../utils/Notify";
import FileUploader from "../../../utils/FileUploader";
import LoadingButton from "../../../utils/LoadingButton";

const clearedData = {
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
};

const canUpdate = (formData: any, targetBook: Book) => {
  if (
    formData.title !== targetBook.title ||
    formData.price !== targetBook.price ||
    formData.author !== targetBook.author ||
    formData.category !== targetBook.category?._id ||
    formData.count !== targetBook.count ||
    formData.status !== targetBook.status ||
    formData.bookPdfFile ||
    formData.bookCoverFile
  ) {
    return true;
  }
  return false;
};

const prepareData = (formData: any, targetBook: Book) => {
  let data: any = {};

  if (formData.title != targetBook.title) {
    data.title = formData.title;
  }
  if (formData.price != targetBook.price) {
    data.price = formData.price;
  }
  if (formData.author != targetBook.author) {
    data.author = formData.author;
  }
  if (formData.category != targetBook.category._id) {
    data.category = formData.category;
  }
  if (formData.count != targetBook.count) {
    data.count = formData.count;
  }
  if (formData.status != targetBook.status) {
    data.status = formData.status;
  }
  if (formData.bookCoverFile && formData.bookCoverFile != "delete") {
    data.image = formData.bookCoverFile;
  }
  if (formData.bookPdfFile && formData.bookPdfFile != "delete") {
    data.bookFile = formData.bookPdfFile;
  }

  return data;
};

const createValidateForm = (formData: any, setErrors: any, t: any) => {
  const newErrors = new Map<string, string>();
  if (formData.status === "online" && !formData.bookPdfFile) {
    newErrors.set(
      "bookPdfFile",
      t("createUpdateBookDialog.validation.pdfRequired")
    );
  }
  if (!formData.bookCoverFile) {
    newErrors.set(
      "bookCoverFile",
      t("createUpdateBookDialog.validation.coverRequired")
    );
  }

  setErrors(newErrors);
  return newErrors.size === 0; // Return true if no errors
};

const updateValidateForm = (formData: any, setErrors: any, t: any) => {
  const newErrors = new Map<string, string>();
  if (
    formData.status === "online" &&
    (!formData.bookPdfFile || formData.bookPdfFile === "delete") &&
    !formData.bookPdf
  ) {
    newErrors.set(
      "bookPdfFile",
      t("createUpdateBookDialog.validation.pdfRequired")
    );
  }

  if (
    !formData.bookCoverFile &&
    formData.bookCoverFile === "delete" &&
    !formData.bookCover
  ) {
    newErrors.set(
      "bookCoverFile",
      t("createUpdateBookDialog.validation.coverRequired")
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
  targetBook: Book;
  setTargetBook: any;
};

const CreateUpdateBook = ({
  showCreateUpdateDialog,
  setShowCreateUpdateDialog,
  createUpdateDialogMethod,
  targetBook,
  setTargetBook,
}: CreateUpdatePropsType) => {
  const { t } = useTranslation();

  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useRecoilState<any>(ownerBookState);

  // Form data state
  const [formData, setFormData] = useState<any>(clearedData);

  useEffect(() => {
    if (targetBook._id) {
      setFormData({
        title: targetBook.title,
        price: targetBook.price,
        author: targetBook.author,
        category: targetBook?.category?._id,
        count: targetBook.count,
        status: targetBook.status,
        bookCover: targetBook.imageCover,
      });
      if (targetBook.status == "online") {
        setFormData((prev: any) => ({ ...prev, bookPdf: targetBook.book }));
      }
    } else {
      setFormData(clearedData);
    }
  }, [targetBook]);

  const handleClose = () => {
    setTargetBook({});
    setShowCreateUpdateDialog(false);
  };

  useEffect(() => {
    authAxios(false, ApiEndpoints.getCategories).then((response) => {
      setCategories(response?.data?.data?.categories);
    });
  }, []);

  // Handle form input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle file upload for book cover and PDF
  const handleFileChange = (name: string, file: File | "delete") => {
    errors.has(name) && errors.delete(name);
    if (name === "bookPdfFile" && file === "delete") {
      setFormData((prev: any) => ({ ...prev, bookPdf: null }));
    }
    if (name === "bookCoverFile" && file === "delete") {
      setFormData((prev: any) => ({ ...prev, bookCover: null }));
    }

    setFormData((prevFormData: any) => ({
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
      setFormData(clearedData);
      data = {};
      setShowCreateUpdateDialog(false);
      setBooks((prev: any) => [...prev, response?.data?.data?.book]);
    } else {
      notify(t("createUpdateBookDialog.create.book.createFail"), "error");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdate(formData, targetBook)) {
      notify("nothing changed to update", "warn");
      return;
    }

    // validation
    const isValid = updateValidateForm(formData, setErrors, t);
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
    const data = prepareData(formData, targetBook);

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.getUpdateDeleteBook(targetBook._id as string),
      "PUT",
      data,
      "multipart/form-data"
    );
    setLoading(false);

    if (response.status === 200) {
      // update books state
      const updatedBook: Book = response?.data?.data?.book;
      const updatedBooks = books.map((book: Book) => {
        if (book._id === updatedBook._id) {
          return updatedBook;
        } else {
          return book;
        }
      });
      notify(t("createUpdateBookDialog.update.book.updateSuccess"), "success");
      setBooks(updatedBooks);
      setShowCreateUpdateDialog(false);
      setFormData(clearedData);
      setTargetBook({});
    } else {
      notify(t("createUpdateBookDialog.update.book.updateFail"), "error");
    }
  };

  return (
    <Modal
      className="custom-dialog"
      show={showCreateUpdateDialog}
      onHide={handleClose}
      centered
    >
      <Form
        onSubmit={
          createUpdateDialogMethod === "create" ? handleCreate : handleUpdate
        }
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-capitalize">
            {createUpdateDialogMethod === "create"
              ? t("createUpdateBookDialog.createBook")
              : t("createUpdateBookDialog.updateBook")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* File Uploader for Book Cover */}
          <Form.Group
            controlId="uploadImage"
            className="d-flex flex-column align-items-center"
          >
            <FileUploader
              type="image"
              onFileChange={(file: any) =>
                handleFileChange("bookCoverFile", file)
              }
              fileUrl={targetBook.imageCover as string}
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
                <Form.Group
                  className="d-flex flex-column align-items-center flex-1 mt-2"
                  controlId="uploadPdf"
                >
                  <FileUploader
                    type="pdf"
                    onFileChange={(file: any) =>
                      handleFileChange("bookPdfFile", file)
                    }
                    fileUrl={(targetBook.book as string) || null}
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
        <Modal.Footer className="">
          <LoadingButton variant="main" type="submit" loading={loading}>
            {createUpdateDialogMethod === "create"
              ? t("createUpdateBookDialog.createBook")
              : t("createUpdateBookDialog.updateBook")}
          </LoadingButton>
          <Button variant="secondary" onClick={handleClose}>
            {t("createUpdateBookDialog.close")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUpdateBook;
