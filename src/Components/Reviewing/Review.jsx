import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Review() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  // Check if current language is Arabic
  const isRTL = currentLanguage === "ar";
  const { t, i18n } = useTranslation();
  // Mock translations object - replace with your i18n setup

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.success(t("pleaseSelectRating"));
      return;
    }
    if (reviewText.trim() === "") {
      toast.success(t("pleaseWriteReview"));
      return;
    }
    const data = {
      userId: user._id,
      rating,
      reviewText: reviewText,
    };
    await axios
      .post(`${import.meta.env.VITE_API_URL}review`, data)
      .then((res) => {
        toast.success(t("Thankks"));
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
    // Reset form
  };

  const getRatingMessage = (rating) => {
    const messages = {
      1: t("rating1Message"),
      2: t("rating2Message"),
      3: t("rating3Message"),
      4: t("rating4Message"),
      5: t("rating5Message"),
    };
    return messages[rating] || "";
  };

  return (
    <div
      className={`min-h-screen p-4 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Language Toggle */}
      {/* <div className="max-w-2xl mx-auto mb-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setCurrentLanguage("en")}
            className={`px-3 py-1 rounded ${
              currentLanguage === "en"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setCurrentLanguage("ar")}
            className={`px-3 py-1 rounded ${
              currentLanguage === "ar"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            العربية
          </button>
        </div>
      </div> */}
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white text-center">
              {t("shareYourExperience")}
            </h1>
            <p className="text-purple-100 text-center mt-2">
              {t("loveToHearFeedback")}
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-8">
            {/* Star Rating */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t("howWouldYouRate")}
              </h3>
              <div
                className={`flex justify-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= (hoverRating || rating)
                          ? "fill-gold text-gold"
                          : "text-gray-300 hover:text-gold"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-3 text-sm text-gray-600 animate-fade-in">
                  {getRatingMessage(rating)}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label
                htmlFor="review"
                className={`block text-lg font-semibold text-gray-800 mb-3 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("tellUsMore")}
              </label>
              <textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t("shareYourThoughts")}
                className={`w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 text-gray-700 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                maxLength={500}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <div
                className={`mt-2 text-sm text-gray-500 ${
                  isRTL ? "text-left" : "text-right"
                }`}
              >
                {reviewText.length}/500 {t("characters")}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              >
                {t("submitReview")}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">{t("feedbackHelpsImprove")}</p>
        </div>
      </div>
    </div>
  );
}
