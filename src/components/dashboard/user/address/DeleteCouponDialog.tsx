import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import {
  addressesState,
  targetAddressState,
} from "../../../../recoil/addressesAtom";
import authAxios from "../../../../api/authAxios";
import { ApiEndpoints } from "../../../../api/ApiEndpoints";
import notify from "../../../utils/Notify";
import LoadingButton from "../../../utils/LoadingButton";

type DeleteAddressProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

const DeleteAddressDialog = ({ show, setShow }: DeleteAddressProps) => {
  const setAddresses = useSetRecoilState(addressesState);
  const [targetAddress, setTargetAddress] = useRecoilState(targetAddressState);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleClose = () => {
    setShow(false);
    setTargetAddress({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.retrieveUpdateDeleteAddress(targetAddress._id as string),
      "DELETE"
    );
    setLoading(false);

    if (response.status === 204) {
      notify(t("deleteAddressDialog.success")); // Success message from i18next
      setAddresses((prev) =>
        prev.filter((address) => address._id !== targetAddress._id)
      ); // Update the coupon list
      handleClose();
    } else {
      notify(t("deleteAddressDialog.error"), "error"); // Error message from i18next
    }
  };

  return (
    <Modal className="custom-dialog" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("deleteAddressDialog.title")}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p>
            {t("deleteAddressDialog.confirm", {
              address: targetAddress.address,
            })}
          </p>{" "}
          {/* Confirmation message */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("deleteAddressDialog.close")}
          </Button>
          <LoadingButton variant="error" loading={loading}>
            {t("deleteAddressDialog.delete")}
          </LoadingButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DeleteAddressDialog;
