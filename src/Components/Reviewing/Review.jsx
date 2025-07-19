import { useState } from "react";
import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Review() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (reviewText.trim() === "") {
      alert("Please write a review");
      return;
    }

    // Here you would typically send the data to your backend

    // Reset form after a delay
    // axios.post()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white text-center">
              Share Your Experience
            </h1>
            <p className="text-purple-100 text-center mt-2">
              We'd love to hear your feedback
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-8">
            {/* Star Rating */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                How would you rate your experience?
              </h3>
              <div className="flex justify-center gap-2">
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
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-3 text-sm text-gray-600 animate-fade-in">
                  {rating === 1 &&
                    "We're sorry to hear that. Please tell us how we can improve."}
                  {rating === 2 &&
                    "We appreciate your feedback. How can we do better?"}
                  {rating === 3 &&
                    "Thanks for your review. What could we improve?"}
                  {rating === 4 &&
                    "Great! We're glad you had a good experience."}
                  {rating === 5 && "Awesome! We're thrilled you loved it!"}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label
                htmlFor="review"
                className="block text-lg font-semibold text-gray-800 mb-3"
              >
                Tell us more about your experience
              </label>
              <textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts, suggestions, or any details about your experience..."
                className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 text-gray-700"
                maxLength={500}
              />
              <div className="text-right mt-2 text-sm text-gray-500">
                {reviewText.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Your feedback helps us improve and serve you better
          </p>
        </div>
      </div>
    </div>
  );
}
