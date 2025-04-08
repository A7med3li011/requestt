import { FiSettings } from "react-icons/fi";
import servicesImage from "../../assets/images/services.png";
import { t } from "i18next";
import { motion } from "framer-motion";

const Services = () => {
  const services = [
    {
      icon: <FiSettings />,
      title: t("servicesLanding.title1"), 
      description: t("servicesLanding.message1"),
    },
    {
      icon: <FiSettings />,
      title: t("servicesLanding.title2"),
      description: t("servicesLanding.message2"), 
    },
    {
      icon: <FiSettings />,
      title: t("servicesLanding.title3"),
      description: t("servicesLanding.message3"),
    },
    {
      icon: <FiSettings />,
      title: t("servicesLanding.title4"), 
      description: t("servicesLanding.message4"),
    },
    {
      icon: <FiSettings />,
      title: t("servicesLanding.title5"),
      description: t("servicesLanding.message5"),
    },
    {
      icon: <FiSettings />,
      title: t("servicesLanding.title6"),
      description: t("servicesLanding.message6"), 
    }
  ];

  return (
    <motion.div
      className="services !bg-light lg:h-screen grid grid-cols-1  lg:grid-cols-4 gap-6 ltr:pl-4 rtl:pr-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-3  lg:hidden">
        <div className="col-span-1 flex flex-col bg-linear_1 text-white p-2  rounded-3xl">
          <span className="font-bold text-2xl text-white ">900+</span>
          <span className="font-medium text-base">{t("happyClient")}</span>
        </div>
        <div className="col-span-1 flex flex-col bg-linear_1 text-white p-2  rounded-3xl">
          <span className="font-bold text-2xl text-white ">300+</span>
          <span className="font-medium text-base">{t("amazingProjects")}</span>
        </div>
        <div className="col-span-1 flex flex-col bg-linear_1 text-white p-2  rounded-3xl">
          <span className="font-bold text-2xl text-white ">200+</span>
          <span className="font-medium text-base">{t("successPartner")}</span>
        </div>
      </div>
      <motion.div
        className="col-span-1 lg:col-span-2 mt-16"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1
          className="font-bold text-2xl sm:text-3xl lg:text-5xl text-purple-dark"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t("servicesLanding.head")}
        </motion.h1>
        <motion.p
          className="font-medium text-sm sm:text-base lg:text-lg text-gray"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {t("servicesLanding.subHead")}
        </motion.p>
        <div className="mt-6">
          <motion.h3
            className="font-bold text-2xl sm:text-3xl lg:text-4xl text-purple-dark m-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {t("servicesLanding.HeadServices")}
          </motion.h3>
          <ul className="services_list font-medium text-sm sm:text-base lg:text-lg text-gray">
            {services.map((service, index) => (
              <motion.li
                key={index}
                className="flex items-start space-x-3 m-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, x: 10 }}
              >
                <span className="text-xl text-blue m-2">{service.icon}</span>
                <div>
                  <h4 className="font-bold text-base lg:text-lg text-gray-dark inline">
                    {service.title} :
                  </h4>
                  <p className="text-gray text-sm lg:text-base inline">
                    {service.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className="m-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-purple-dark m-3">
              {t("servicesAdditional.title")}
            </h3>
            <ul className="list-disc pl-5 font-medium text-sm sm:text-base lg:text-lg text-gray-dark">
              {t("servicesAdditional.items", { returnObjects: true }).map((item, index) => (
                <motion.li
                  key={index}
                  className="m-4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      <div className="col-span-1 lg:col-span-2 relative">
        <img
          src={servicesImage}
          alt="servicesImage"
          className="h-[40vh] sm:h-[60vh] lg:h-[70vh] hidden lg:block lg:w-3/4 object-cover absolute rtl:left-0 ltr:right-0 rtl:scale-x-[-1]"
          loading="lazy"
        />
        <motion.div 
          className="box_services absolute rtl:rounded-r-xl ltr:rounded-l-xl bg-linear_1 p-4 h-[15vh] hidden lg:grid grid-cols-3 items-center gap-2 text-white w-4/5 rtl:left-0 ltr:right-0 lg:bottom-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div 
            className="col-span-1 flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <span className="font-bold text-2xl">900+</span>
            <span className="font-medium text-base">{t("happyClient")}</span>
          </motion.div>
          <motion.div 
            className="col-span-1 flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <span className="font-bold text-2xl">300+</span>
            <span className="font-medium text-base">
              {t("amazingProjects")}
            </span>
          </motion.div>
          <motion.div 
            className="col-span-1 flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <span className="font-bold text-2xl">200+</span>
            <span className="font-medium text-base">{t("successPartner")}</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;
