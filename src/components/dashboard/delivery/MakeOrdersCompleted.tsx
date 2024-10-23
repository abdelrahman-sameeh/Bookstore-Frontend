import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { ordersState } from "../../../recoil/ordersAtom";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import notify from "../../utils/Notify";
import LoadingButton from "../../utils/LoadingButton";

type MakeOrdersCompletedProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  ordersIds: any;
  setOrdersIds: any;
};

const MakeOrdersCompleted = ({
  show,
  setShow,
  ordersIds,
  setOrdersIds,
}: MakeOrdersCompletedProps) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [orders, setOrders] = useRecoilState(ordersState);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = {
      ordersIds,
    };
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.makeOrdersCompleted,
      "POST",
      data
    );
    setLoading(false);
    if (response.status === 200) {
      notify(t("makeOrdersCompleted.updateSuccess"));
      const updatedOrders = orders.filter((or) => {
        return !ordersIds.includes(or._id as string)
      });
      setOrders(updatedOrders);
      setOrdersIds([]);
      setShow(false);
    } else if (response?.data?.message==='some orders were not found') {
      const missedOrders = response?.data?.data?.orders
      
      const updatedOrders = orders.filter(or=>!missedOrders.includes(or._id))
      setOrders(updatedOrders);

      setOrdersIds((prev: any) =>
        prev.filter((orId: any) => !missedOrders.includes(orId))
      );
      notify(t("makeOrdersCompleted.notFoundOrders"), "error");
    } else {
      notify(t("makeOrdersCompleted.errorOccurred"), "error");
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal centered className="custom-dialog" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("makeOrdersCompleted.title")}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>{t("makeOrdersCompleted.body")}</Modal.Body>
        <Modal.Footer>
          <LoadingButton type="submit" loading={loading}>
            {t("makeOrdersCompleted.submit")}
          </LoadingButton>
          <Button variant="secondary" onClick={handleClose}>
            {t("makeOrdersCompleted.close")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MakeOrdersCompleted;
