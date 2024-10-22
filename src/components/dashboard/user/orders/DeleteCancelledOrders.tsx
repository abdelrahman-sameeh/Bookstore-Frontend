import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import authAxios from "../../../../api/authAxios";
import { ApiEndpoints } from "../../../../api/ApiEndpoints";
import notify from "../../../utils/Notify";
import LoadingButton from "../../../utils/LoadingButton";
import { ordersState } from "../../../../recoil/ordersAtom";

type DeleteCancelledOrdersProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  cancelledOrders: any;
  setCancelledOrders: any;
};

const DeleteCancelledOrders = ({
  show,
  setShow,
  cancelledOrders,
  setCancelledOrders,
}: DeleteCancelledOrdersProps) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [orders, setOrders] = useRecoilState(ordersState);

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.getDeleteUserOrders,
      "DELETE",
      {
        orders: cancelledOrders,
      }
    );
    setLoading(false);
    if (response.status === 200) {
      notify(t("deleteCancelledOrderDialog.success"));
      const updateOrders = orders.filter(
        (or) => !cancelledOrders.includes(or._id)
      );
      setOrders(updateOrders);
      setCancelledOrders([]);
      handleClose();
    } else {
      notify(t("deleteCancelledOrderDialog.error"), "error");
    }
  };

  return (
    <Modal className="custom-dialog" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("deleteCancelledOrderDialog.title")}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p>{t("deleteCancelledOrderDialog.confirm")}</p>{" "}
          {/* Confirmation message */}
        </Modal.Body>
        <Modal.Footer>
          <LoadingButton type={"submit"} variant="error" loading={loading}>
            {t("deleteCancelledOrderDialog.delete")}
          </LoadingButton>
          <Button variant="secondary" onClick={handleClose}>
            {t("deleteCancelledOrderDialog.close")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DeleteCancelledOrders;
