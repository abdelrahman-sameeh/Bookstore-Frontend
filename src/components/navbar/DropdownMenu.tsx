import React from "react";
import { useSetRecoilState } from "recoil";
import { isLoginPageAtom } from "../../recoil/utils";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { UserRolesType } from "../../interfaces/interfaces";
import { useTranslation } from "react-i18next";

const getNavigationPath = (role: UserRolesType) => {
  switch (role) {
    case "user":
      return "/dashboard/user/books";
    case "owner":
      return "/dashboard/owner/onboarding";
    case "admin":
      return "/dashboard/admin/categories";
    case "delivery":
      return "/dashboard/delivery/orders";
  }
};

const DropdownMenu = () => {
  const setIsLoginPage = useSetRecoilState(isLoginPageAtom);
  const { user } = useLoggedInUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      {user && user?._id ? (
        <Dropdown>
          <Dropdown.Toggle
            id="user-menu"
            className="no-arrow d-flex w-100 justify-content-center align-items-center border-0 bg-transparent main-text"
          >
            <div
              className="user-avatar main-text d-flex align-items-center justify-content-center me-2"
              style={{
                width: "30px",
                height: "30px",
                fontSize: "14px",
              }}
            >
              {user.picture ? (
                <img className="profile-picture" src={user.picture} />
              ) : (
                <span>
                  {user?.name[0]}
                  {user?.name?.split(" ")[1]?.[0]}
                </span>
              )}
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                navigate("/");
              }}
            >
              {t("navbar.home")}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate(getNavigationPath(user.role as UserRolesType));
              }}
            >
              {t("navbar.dashboard")}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                sessionStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              {t("navbar.logout")}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <div className="links d-flex justify-content-center align-items-center">
          <Link
            onClick={() => {
              setIsLoginPage(false);
            }}
            style={{ lineHeight: "38px" }}
            className="main-text  h-100 border-start border-end px-2  text-center text-capitalize alt-bg"
            to="/auth?signup=true"
          >
            {t("navbar.register")}
          </Link>
          <Link
            onClick={() => {
              setIsLoginPage(true);
            }}
            style={{ lineHeight: "38px" }}
            className="main-text h-100 text-center mx-0 px-2 text-capitalize alt-bg"
            to="/auth?login=true"
          >
            {t("navbar.login")}
          </Link>
        </div>
      )}
    </>
  );
};

export default DropdownMenu;
