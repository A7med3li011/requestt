import { Link } from "react-router-dom";
import image404 from "../../assets/images/404.png"
import Button from "../../Components/UI/Button/Button";
import { t } from "i18next";
const Page404 = () => {
  return (
    <div className="page404 h-[80vh] flex justify-center items-center  flex-col">
      <img src={image404} alt="image404" />
      <h3 className="text-4xl font-bold text-center my-2">
        {t("Oops! the page not found.")}
      </h3>
      <p className="text-gray text-base ">
        {t("Or simply leverage the expertise of our consultation team.")}
      </p>
      <Link to={"/"}>
        <Button className={`mt-4`}>{t("Go Home")}</Button>
      </Link>
    </div>
  );
}

export default Page404