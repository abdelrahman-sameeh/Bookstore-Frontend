import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import authAxios from "../../../../api/authAxios";
import { ApiEndpoints } from "../../../../api/ApiEndpoints";
import notify from "../../../utils/Notify";
import LoadingButton from "../../../utils/LoadingButton";
import { cartsState } from "../../../../recoil/cartsAtom";
import { Cart } from "../../../../interfaces/interfaces";

type DeleteCartProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  cart: Cart
  setCart: any
};

const DeleteCartDialog = ({ show, setShow, cart, setCart }: DeleteCartProps) => {
  const setCarts = useSetRecoilState(cartsState);
  const [loading, setLoading] = useState(false);


  const { t } = useTranslation();

  const handleClose = () => {
    setShow(false);
    setCart({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.deleteCart,
      "DELETE",
      {
        cartId: cart._id
      }
    );
    setLoading(false);

    if (response.status === 204) {
      notify(t("deleteCartDialog.success"));
      setCarts((prev) =>
        prev.filter((c) => c._id !== cart._id)
      ); 
      handleClose();
    } else {
      notify(t("deleteCartDialog.error"), "error"); 
    }
  };

  return (
    <Modal className="custom-dialog" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("deleteCartDialog.title")}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p>
            {t("deleteCartDialog.confirm")}
          </p>{" "}
          {/* Confirmation message */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("deleteCartDialog.close")}
          </Button>
          <LoadingButton variant="error" loading={loading}>
            {t("deleteCartDialog.delete")}
          </LoadingButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DeleteCartDialog;
