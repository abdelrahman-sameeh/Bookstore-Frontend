import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, Form, Modal } from "react-bootstrap";
import LoadingButton from "../../../utils/LoadingButton";
import { useTranslation } from "react-i18next";
import authAxios from "../../../../api/authAxios";
import { ApiEndpoints } from "../../../../api/ApiEndpoints";
import { Delivery } from "../../../../interfaces/interfaces";
import InputError from "../../../utils/InputError";
import notify from "../../../utils/Notify";
import { useRecoilState } from "recoil";
import { ordersState } from "../../../../recoil/ordersAtom";

type MakeOrdersInDeliveryStatusDialogProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  ordersIds: any;
  setOrdersIds: any;
};

const MakeOrdersInDeliveryStatusDialog = ({
  show,
  setShow,
  ordersIds,
  setOrdersIds,
}: MakeOrdersInDeliveryStatusDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [deliveryId, setDeliveryId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useRecoilState(ordersState);

  useEffect(() => {
    authAxios(true, ApiEndpoints.getDeliveries).then((response) =>
      setDeliveries(response?.data?.data?.deliveries)
    );
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!deliveryId) {
      setError(t("makeOrdersInDelivery.selectDeliveryError"));
      return;
    }
    const data = {
      ordersIds,
      deliveryId,
    };
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.makeOrdersInDelivery,
      "PUT",
      data
    );
    setLoading(false);
    if (response.status === 200) {
      notify(t("makeOrdersInDelivery.updateSuccess"));
      const updatedOrders = orders.map((or) => {
        return ordersIds.includes(or._id as string)
          ? { ...or, status: "inDelivery" }
          : or;
      });
      setOrders(updatedOrders);
      setOrdersIds((prev: any) =>
        prev.filter((or: any) => ordersIds.includes(or._id as string))
      );
      setShow(false);
    } else if (
      response?.data?.errors[0]?.msg ==
      "order status must be pending or inProgress"
    ) {
      window.location.reload();
    } else {
      notify(t("makeOrdersInDelivery.errorOccurred"), "error");
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal centered className="custom-dialog" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("makeOrdersInDelivery.title")}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Select
            value={deliveryId}
            onChange={(e) => {
              setError(null);
              setDeliveryId(e.target.value);
            }}
          >
            <option value={""}>
              {t("makeOrdersInDelivery.selectDeliveryOption")}
            </option>{" "}
            {/* ترجمة خيار التوصيل */}
            {deliveries?.map((d) => (
              <option key={d._id} value={d._id}>
                {d?.user?.name} - {d?.user?.email}
              </option>
            ))}
          </Form.Select>
          {error && <InputError message={error} />}{" "}
          {/* عرض رسالة الخطأ إذا كانت موجودة */}
        </Modal.Body>
        <Modal.Footer>
          <LoadingButton type="submit" loading={loading}>
            {t("makeOrdersInDelivery.submit")}
          </LoadingButton>
          <Button variant="secondary" onClick={handleClose}>
            {t("makeOrdersInDelivery.close")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MakeOrdersInDeliveryStatusDialog;
