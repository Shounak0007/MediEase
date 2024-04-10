import { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/images/logo2.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/doctors",
    display: "Find a Doctor",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const [{ run, steps }] = useState({
    run: true,
    steps: [
      {
        content: <h2>Let's get started</h2>,
        locale: { skip: <strong>SKIP</strong> },
        placement: "center",
        target: "body",
      },
      {
        content: <h2>Click here to find a doctor and book an appointment</h2>,
        title: "step 2",
        placement: "top",
        target: "#step1",
      },
      {
        content: <h2>Click here to Check all the services on our platform</h2>,
        title: "step 3",
        placement: "bottom",
        target: "#step2",
      },
      {
        content: <h2>Click here to contact us in case of queries</h2>,
        title: "step 4",
        placement: "bottom",
        target: "#step3",
      },
      {
        content: (
          <h2>
            Click here to view your profile, here you can view appointments and
            update profile
          </h2>
        ),
        title: "step 5",
        placement: "bottom",
        target: "#step4",
      },
    ],
  });

  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, role, token, dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener("scroll", handleStickyHeader);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  return (
    <header className="header flex items-center bg-[#90e0ef]" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} alt="" className="h-[200px] w-[200px]" />
          </div>
          <div className="navigation one" ref={menuRef} onClick={toggleMenu}>
            {role !== "admin" ? (
              <ul className="menu flex items-center gap-[2.7rem]">
                {navLinks.map((link, index) => (
                  <li key={index} id={`step${index}`}>
                    <NavLink
                      to={link.path}
                      className={(navClass) =>
                        navClass.isActive
                          ? "text-primaryColor text-[16px] leading-7 font-[600]"
                          : "text-textColor text-[16px] leading-7 font-[500]"
                      }
                    >
                      {link.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-primaryColor text-center font-bold text-[30px] ">
                Welcome to Admin Dashboard
              </p>
            )}
          </div>
          <div className="flex itmes-center gap-4">
            {token && user ? (
              <div className="flex items-center" id="step4">
                <Link
                  to={
                    role === "doctor"
                      ? "/doctors/profile/me"
                      : role === "admin"
                      ? "/admin/dashboard"
                      : "/users/profile/me"
                  }
                  className="mr-4"
                >
                  <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                    <img
                      src={user?.photo}
                      className="w-full rounded-full"
                      alt=""
                    />
                  </figure>
                </Link>
                {role === "admin" && (
                  <button
                    className="w-full bg-primaryColor p-3 text-[16px] leading-7 rounded-md text-white ml-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
