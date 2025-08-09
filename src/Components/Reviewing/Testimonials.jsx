import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";
import axios from "axios";

export default function Testimonials() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function handleGetData() {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}review`);
      setData(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetData();
  }, []);

  

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-gold fill-gold" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        aria-live="polite"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        aria-live="assertive"
      >
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Testimonials</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={handleGetData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-600">
          <p className="text-lg">No testimonials available</p>
        </div>
      </div>
    );
  }

  const currentTestimonial = data[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Customer Testimonials
      </h2>

      <div className="relative bg-transparent rounded-xl shadow-lg p-8 min-h-[300px]  border-[1px] border-[#94B7F4]">
        <div className="text-center">
          {/* Profile section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              {currentTestimonial?.createdBy?.profilePic ? (
                <img
                  src={
                    "https://api.request-sa.com/" +
                    currentTestimonial.createdBy.profilePic
                  }
                  alt={currentTestimonial.createdBy.name || "User"}
                  className="w-16 h-16 rounded-full "
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {currentTestimonial?.createdBy?.name || "Anonymous"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(currentTestimonial.createdAt)}
            </p>
          </div>

          {/* Rating */}
          <div className="flex justify-center mb-6">
            {renderStars(currentTestimonial.rating || 0)}
          </div>

          {/* Testimonial text */}
          {currentTestimonial.text ? (
            <div className=" text-rose-500 text-lg italic mb-6">
              “{currentTestimonial.text}”
            </div>
          ) : (
            <div className="text-gray-400 italic mb-6">No review provided.</div>
          )}
        </div>

        {/* Navigation arrows */}
        {data.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator */}
      {data.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Footer counter */}
      {/* <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {currentIndex + 1} of {data.length} testimonials
        </p>
      </div> */}
    </div>
  );
}
