import LandingHeader from "../../Components/landingHeader/landingHeader";
import ModifHeader from "../../Components/landingHeader/ModifiedHeader";
import ContactUsLanding from "./ContactUsLanding";
import Main from "./Main";
import PlansDetailsLanding from "./PlansDetailsLanding";
import PlansInfoLanding from "./PlansInfoLanding";
import SeePlansLanding from "./seePlansLanding";
import Services from "./Services";
import "./style.scss";
import { Routes, Route } from "react-router-dom";

const Landing = () => {
  return (
    <div className="Landing">
      <LandingHeader />
      <Routes>
        <Route path="" element={<Main />} />
        <Route path="services" element={<Services />} />
        <Route path="ContactUs" element={<ContactUsLanding />} />
        <Route path="seePlans" element={<SeePlansLanding />} />
        {/* <Route path="plansDetails" element={<PlansDetailsLanding />} /> */}
        <Route path="PlansInfo" element={<PlansInfoLanding />} />
      </Routes>
    </div>
  );
};

export default Landing;
