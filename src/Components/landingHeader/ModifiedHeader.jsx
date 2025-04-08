import { Link } from "react-router-dom";
import logo from "../../assets/images/transpairant_leatest.png";
import { t } from "i18next";
import { FaBarsStaggered } from "react-icons/fa6";
export default function ModifHeader() {
  return (
    <div className="py-3 px-6">
      <header className="flex  justify-between items-center">
        <div>
          <img className="w-[70px] h-[70px] block" src={logo} alt="logo" />
        </div>
        <ul className="md:flex lg:text-base text-xs items-center gap-x-5 bg-white py-3 px-6 rounded-full hidden">
          <li>
            <Link>Home</Link>
          </li>
          <li>
            <Link>Services</Link>
          </li>
          <li>
            <Link>Price</Link>
          </li>
          <li>
            <Link>Contact us</Link>
          </li>
          <li>
            <Link>Contact us</Link>
          </li>
          <li>
            <Link>Language</Link>
          </li>
        </ul>
        <div className="md:hidden">
          <FaBarsStaggered className="text-purple w-5 h-5" />
        </div>
        <div className="CTA flex items-center ">
          <Link to="/LogIn/Mail">
            <button className="py-1 px-3 md:px-8 bg-linear_1 rounded-3xl text-light mx-2 font-semibold  md:text-base transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center md:gap-2 text-xs flex-col-reverse md:flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {t("signIn")}
            </button>
          </Link>
          <Link to="/SignUp/ChooseRole">
            <button className="py-1 px-3    md:px-8 bg-light border-2 border-purple border-solid rounded-3xl text-purple mx-2 font-semibold  md:text-base transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-purple hover:text-white flex items-center md:gap-2 text-xs flex-col-reverse md:flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              {t("Sign Up")}
            </button>
          </Link>
        </div>
      </header>
    </div>
  );
}
