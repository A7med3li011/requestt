import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { t } from "i18next";
import i18n from "../../../config/i18n";
import Input from "../../../Components/UI/Input/Input";
import Button from "../../../Components/UI/Button/Button";
import Loader from "../../../Components/Loader/Loader";
import { addVocation, getAllVocations } from "../../../Services/api";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
const CreateVocation = () => {
  const lang = i18n.language;
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const userId = user._id;
  const [vocations, setVocations] = useState([]);
  const [isUpdated, setisUpdated] = useState(false);

  const [voc, setVoc] = useState({
    nameEN: "",
    nameAR: "",
  });
  const [loading, setLoading] = useState(false);
  let newArray = []
  useEffect(() => {
    const getVocations = async () => {
      setLoading(true);
      try {
        const res = await getAllVocations(userId, lang);
        const data =  res.results;

        
        console.log(data)
       
        
        setVocations(prev => {
          const existingNames = new Set(prev.map(item => item.name));
        
          const newUniqueItems = data.filter(item => !existingNames.has(item.name));
        
          return [...prev, ...newUniqueItems];
        });
        
      } catch (error) {
        console.error("Error fetching vocations:", error);
      } finally {
        setLoading(false);
      }
    };
    getVocations();
  }, [userId,isUpdated]);

  const handleAddVocation = async () => {
    try {
      const payload = {
        nameEN: voc.nameEN,
        nameAR: voc.nameAR,
        createdBy: user._id,
      };
      "Sending voc to API:", payload;

      const response = await addVocation(token, payload, lang);
      `Voc added successfully:`, response;

      toast.success(t("toast.VocCreatedSuccess"));
      // window.location.reload();
      setVoc({
        nameEN: "",
        nameAR: "",
      });
      setisUpdated(prev=>!prev)

      return response;
    } catch (error) {
      console.error("Error saving vocation:", error);
      // toast.error(t("toast.VocCreationError"));
    }
  };

  async function handleUpdateVocation(voc) {
    console.log(vocations);
    console.log(
      setVocations((prev) => prev.filter((item) => item._id != voc._id))
      
    );
    await axios.delete(
      `https://api.request-sa.com/api/v1/vocation/${voc._id}`,
      {
        name: voc.name,
      }
    );
  }
  console.log(vocations)
  return (
    <div className="CreateVocation">
      {loading ? (
        <div className="loader flex items-center justify-center m-auto">
          <Loader />
        </div>
      ) : (
        <div className="wrapper bg-white rounded-3xl p-3 m-2">
          <h6 className="font-semibold text-sm leading-4">{t("Vocations")}</h6>

          {vocations.length > 0 ? (
            <div className="PreviousTags grid grid-cols-2 md:grid-cols-4  gap-2 bg-white rounded-3xl p-4 shadow-lg">
              {vocations.map(
                (voc, index) =>
                  (
                    <div
                      key={index}
                      className="voc  col-span-1 rounded-3xl py-6 px-5 flex items-center justify-center relative text-center  bg-gray-100 text-sm "
                    >
                      <span
                        onClick={() => handleUpdateVocation(voc)}
                        className="text-lg text  rounded-full    !border-2 !border-black cursor-pointer absolute block top-1 left-1"
                      >
                        <IoMdClose />
                      </span>
                      {voc.name||voc.nameEN}
                      {/* {newVocations.includes(voc) && (
                    <button
                      className="absolute rounded-full bg-white w-6 -top-3 right-2"
                      onClick={() => handleDeleteVocation(voc)}
                    >
                      <span className="w-4 font-semibold text-sm">
                        &#x2715;
                      </span>
                    </button>
                  )} */}
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="text-center text-sm leading-4 text-gray-600">
              {t("No Previous Vocation")}
            </div>
          )}

          <form onSubmit={handleAddVocation} className="py-5 px-3 lg:px-8">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-2">
                <Input
                  label={t("VName")}
                  placeholder={t("Enter vocation name in English")}
                  className="bg-white border placeholder:text-xs  border-purple mx-2 border-solid focus:border focus:border-purple focus:border-solid"
                  type="text"
                  required={true}
                  value={voc.nameEN}
                  onChange={(e) =>
                    setVoc((prev) => ({ ...prev, nameEN: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2">
                <Input
                  label={t("VName")}
                  placeholder={t("Enter vocation name in Arabic")}
                  className="bg-white text-start border placeholder:text-xs  border-purple mx-2 border-solid focus:border focus:border-purple focus:border-solid"
                  type="text"
                  label_class={""}
                  required={true}
                  value={voc.nameAR}
                  onChange={(e) =>
                    setVoc((prev) => ({ ...prev, nameAR: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="btn flex items-center justify-center md:justify-end m-4">
              <Button
                className="!font-bold text-base !px-10"
                onClick={handleAddVocation}
              >
                {t("+ Add new vocation")}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateVocation;
