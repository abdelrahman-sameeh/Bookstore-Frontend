import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, Modal } from "react-bootstrap";
import LoadingButton from "../../utils/LoadingButton";
import { useTranslation } from "react-i18next";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import notify from "../../utils/Notify";
import InputError from "../../utils/InputError";
import { useRecoilState, useRecoilValue } from "recoil";
import { Category } from "../../../interfaces/interfaces";
import {
  categoriesState,
  categoryState,
} from "../../../recoil/categories.atom";

type CreateUpdateCategoryDialogProps = {
  showCreateUpdateDialog: boolean;
  setShowCreateUpdateDialog: Dispatch<SetStateAction<boolean>>;
  method: "create" | "update";
};

const validation = (title: string, setErrors: any) => {
  const errors = new Map();

  if (!isNaN(+title)) {
    setErrors(errors.set("title", "invalid category title"));
  }
  if (title.length > 25) {
    setErrors(errors.set("title", "too big category title"));
  }

  if (errors.size) {
    return false;
  }

  return true;
};

function CreateUpdateCategoryDialog({
  showCreateUpdateDialog,
  setShowCreateUpdateDialog,
  method,
}: CreateUpdateCategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const { t } = useTranslation(); // Destructure the t function for translations
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [categories, setCategories] = useRecoilState(categoriesState);
  const category = useRecoilValue(categoryState);

  useEffect(() => {
    if (method === "update") {
      setTitle(category.name as string);
    } else {
      setTitle("");
    }
  }, [category]);

  const handleClose = () => {
    setShowCreateUpdateDialog(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!validation(title, setErrors)) return false;

    const data = { name: title };

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.listCreateCategory,
      "POST",
      data
    );
    setLoading(false);

    if (response.status === 201) {
      notify(t("createUpdateCategoryDialog.successCreate"), "success");
      setCategories((prev) => [...prev, response?.data?.data?.category]);
      setShowCreateUpdateDialog(false);
    } else if (
      response.status === 400 &&
      response?.data?.message === "category already exist"
    ) {
      notify(t("createUpdateCategoryDialog.exist"), "error");
    } else {
      notify(t("createUpdateCategoryDialog.error"), "error");
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (title.toLowerCase() === category?.name?.toLowerCase()) {
      notify(t("createUpdateCategoryDialog.noChanges"), "warn");
      return false;
    }

    if (!validation(title, setErrors)) return false;

    const data = { name: title };

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.getUpdateDeleteCategory(category._id as string),
      "PUT",
      data
    );
    setLoading(false);

    if (response.status === 200) {
      notify(t("createUpdateCategoryDialog.successUpdate"), "success");
      const updatedCategories = categories.map((cat) => {
        if (cat._id === category._id) {
          return response?.data?.data?.category;
        }
      return cat;
      });
      setCategories(updatedCategories);
      setShowCreateUpdateDialog(false);
    } else if (
      response.status === 400 &&
      response?.data?.message === "category already exist"
    ) {
      notify(t("createUpdateCategoryDialog.exist"), "error");
    } else {
      notify(t("createUpdateCategoryDialog.error"), "error");
    }
  };

  return (
    <Modal
      className="custom-dialog"
      show={showCreateUpdateDialog}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {method === "create"
            ? t("createUpdateCategoryDialog.createTitle")
            : t("createUpdateCategoryDialog.updateTitle")}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={method === "create" ? handleCreate : handleUpdate}>
        <Modal.Body>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control"
            placeholder={t("createUpdateCategoryDialog.titlePlaceholder")}
          />
          {errors.has("title") && (
            <InputError message={errors.get("title") as string} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("createUpdateCategoryDialog.close")}
          </Button>
          <LoadingButton type="submit" loading={loading}>
            {method === "create"
              ? t("createUpdateCategoryDialog.create")
              : t("createUpdateCategoryDialog.update")}
          </LoadingButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default CreateUpdateCategoryDialog;
