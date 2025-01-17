import { useState, useEffect, FormEvent } from "react";
import { Form, InputGroup } from "react-bootstrap";
import LoadingButton from "../../../components/utils/LoadingButton";
import ProfilePictureUploader from "../../../components/User/ProfilePictureUploader";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import notify from "../../../components/utils/Notify";
import { useTranslation } from "react-i18next";

const Setting = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<any>(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading, setUser } = useLoggedInUser();

  useEffect(() => {
    if (user._id && !userLoading) {
      setProfileImage(user.picture);
      setOriginalImage(user.picture);
      setName(user.name);
    }
  }, [user, userLoading]);

  const handleImageUpload = (image: any) => {
    setProfileImage(image);
  };

  const handleImageDelete = () => {
    setProfileImage(null);
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (name !== user.name) {
      formData.append("name", name);
    }
    if (profileImage && profileImage instanceof File) {
      formData.append("picture", profileImage);
    }

    if (![...formData.entries()].length) {
      console.log(t("setting.noChangesToSave"));
      return;
    }

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.updateUserProfile,
      "PATCH",
      formData,
      "multipart/form-data"
    );
    setLoading(false);

    if (response.status === 200) {
      notify(t("setting.updatedSuccessfully"));
      sessionStorage.setItem(
        "user",
        JSON.stringify(response?.data?.data?.user)
      );
      setUser(response?.data?.data?.user);
      setOriginalImage(response?.data?.data?.user?.picture);
      setProfileImage(response?.data?.data?.user?.picture);
    } else {
      notify(t("setting.somethingWentWrong"), "error");
    }
  };

  return (
    <div>
      <div className="container alt-bg p-4">
        <Form onSubmit={handleSaveChanges} className="main-border secondary-bg m-auto p-3 w-100 w-md-50">
          <ProfilePictureUploader
            initialImage={originalImage}
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
          />

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label className="text-capitalize">
              {t("setting.username")}
            </Form.Label>
            <Form.Control
              className="main-text"
              placeholder={t("setting.usernamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <LoadingButton loading={loading}>
            {t("setting.edit")}
          </LoadingButton>
        </Form>
      </div>
    </div>
  );
};

export default Setting;
