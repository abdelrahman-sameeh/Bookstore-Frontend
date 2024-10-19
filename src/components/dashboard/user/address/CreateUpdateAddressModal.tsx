import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../../utils/LoadingButton";
import { useRecoilState } from "recoil";
import {
  addressesState,
  targetAddressState,
} from "../../../../recoil/addressesAtom";
import authAxios from "../../../../api/authAxios";
import { ApiEndpoints } from "../../../../api/ApiEndpoints";
import notify from "../../../utils/Notify";

type CreateUpdateProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  isUpdate: boolean;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
};

const validateForm = (
  country: string,
  city: string,
  address: string,
  phone: string,
  setErrors: any,
  t: any
) => {
  const newErrors: any = {};

  if (!country) newErrors.country = t("createUpdateAddressDialog.required");
  if (!city) newErrors.city = t("createUpdateAddressDialog.required");
  if (!address) newErrors.address = t("createUpdateAddressDialog.required");
  if (!phone) newErrors.phone = t("createUpdateAddressDialog.required");
  if (phone && (phone.length > 12 || phone.length < 11 || Number.isNaN(+phone)))
    newErrors.phone = t("createUpdateAddressDialog.invalidPhone");

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const CreateUpdateAddressModal = ({
  show,
  setShow,
  isUpdate,
  setIsUpdate,
}: CreateUpdateProps) => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useRecoilState(addressesState);
  const [targetAddress, setTargetAddress] = useRecoilState(targetAddressState);
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setTargetAddress({});
    setIsUpdate(false);
    setShow(false);
    setCountry("");
    setCity("");
    setAddress("");
    setPhone("");
    setErrors({});
  };

  useEffect(() => {
    setErrors({});
    if (isUpdate && targetAddress._id) {
      setCountry(targetAddress?.country || "");
      setCity(targetAddress?.city || "");
      setAddress(targetAddress?.address || "");
      setPhone(targetAddress?.phone || "");
    } else {
      setCountry("");
      setCity("");
      setAddress("");
      setPhone("");
    }
  }, [isUpdate, targetAddress]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm(country, city, address, phone, setErrors, t)) return;
    const data = { country, city, address, phone };
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.listCreateAddresses,
      "POST",
      data
    );
    setLoading(false);
    if (response?.status === 201) {
      notify(t("createUpdateAddressDialog.createSuccess"));
      setAddresses((prev) => [...prev, response?.data?.data?.address]);
      handleClose();
    } else {
      notify(t("createUpdateAddressDialog.createError"), "error");
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm(country, city, address, phone, setErrors, t)) return;
    if (
      country?.toLowerCase() === targetAddress?.country?.toLowerCase() &&
      city?.toLowerCase() === targetAddress?.city?.toLowerCase() &&
      address?.toLowerCase() === targetAddress?.address?.toLowerCase() &&
      phone?.toLowerCase() === targetAddress?.phone?.toLowerCase()
    ) {
      // No changes detected, show notification and return
      notify(t("createUpdateAddressDialog.noChanges"), "warn");
      return;
    }

    const data = { country, city, address, phone };

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.retrieveUpdateDeleteAddress(targetAddress?._id as string),
      "PUT",
      data
    );
    setLoading(false);
    if (response?.status === 200) {
      notify(t("createUpdateAddressDialog.updateSuccess"));
      const updatedAddresses = addresses.map((address) => {
        if (address._id === targetAddress._id) {
          return response?.data?.data?.address;
        } else return address;
      });
      setAddresses(updatedAddresses);
      handleClose();
    } else {
      notify(t("createUpdateAddressDialog.updateError"), "error");
    }
  };

  return (
    <Modal className="custom-dialog" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isUpdate
            ? t("createUpdateAddressDialog.updateTitle")
            : t("createUpdateAddressDialog.createTitle")}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={isUpdate ? handleUpdate : handleCreate}>
        <Modal.Body>
          {/* Country */}
          <Form.Group controlId="formCountry" className="mb-3">
            <Form.Label>{t("createUpdateAddressDialog.country")}</Form.Label>
            <Form.Control
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              isInvalid={!!errors.country}
            />
            <Form.Control.Feedback type="invalid">
              {errors.country}
            </Form.Control.Feedback>
          </Form.Group>

          {/* City */}
          <Form.Group controlId="formCity" className="mb-3">
            <Form.Label>{t("createUpdateAddressDialog.city")}</Form.Label>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              isInvalid={!!errors.city}
            />
            <Form.Control.Feedback type="invalid">
              {errors.city}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Address */}
          <Form.Group controlId="formAddress" className="mb-3">
            <Form.Label>{t("createUpdateAddressDialog.address")}</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Phone */}
          <Form.Group controlId="formPhone" className="mb-3">
            <Form.Label>{t("createUpdateAddressDialog.phone")}</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("createUpdateAddressDialog.close")}
          </Button>
          <LoadingButton loading={loading} type="submit">
            {isUpdate
              ? t("createUpdateAddressDialog.update")
              : t("createUpdateAddressDialog.create")}
          </LoadingButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUpdateAddressModal;
