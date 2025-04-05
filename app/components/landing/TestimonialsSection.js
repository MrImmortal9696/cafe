import { useState, useEffect } from "react";
import Testimonial from "../elements/testimonial";
import BannerTextHorizontal from "./BannerTextHorizontal";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

export default function TestimonialsSection() {
  const reviews = [
    {
      stars: 5,
      comment:
        "Tropical Café is a hidden gem in Glasgow! The flavors are bold, the atmosphere is vibrant, and every dish feels like a trip to the Caribbean. I can’t wait to come back!",
      name: "Alex M.",
    },
    {
      stars: 5,
      comment:
        "I absolutely loved the food and the friendly staff! Tropical Café brings such a refreshing vibe to the city. Highly recommended!",
      name: "Samantha K.",
    },
    {
      stars: 5,
      comment:
        "Fantastic experience! The food, drinks, and service were top-notch. It's my new favorite spot for both casual meals and special occasions.",
      name: "Chris T.",
    },
    // ... Add the remaining reviews here
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to move slider left
  const slideLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  // Function to move slider right
  const slideRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-slider functionality
  useEffect(() => {
    const interval = setInterval(() => {
      slideRight();
    }, 3000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [currentIndex]); // Rerun the effect when the index changes

  // Slice reviews to show 3 at a time
  const visibleReviews = [
    ...reviews.slice(currentIndex, currentIndex + 3),
    ...reviews.slice(0, Math.max(0, currentIndex + 3 - reviews.length)),
  ];

  return (
    <div className="w-[95%] min-h-[60vh] rounded-b-[20px] bg-white flex flex-col justify-around">
      {/* Header Section */}
      <div className="w-[80%] mx-auto text-center">
        <BannerTextHorizontal
          top="Testimonials"
          heading="What Our Visitors Say"
          description="At Tropical Café, we pride ourselves on creating an unforgettable dining experience that keeps our guests coming back for more. Here’s what they’re saying about us:"
          button1Text="TABLE ORDER"
          button1Link="/table-order"
          button2Text="ONLINE SHOP"
          button2Link="/online-shop"
        />
      </div>

      {/* Testimonials Slider */}
      <div className="relative flex-center gap-4 w-[80%] mx-auto py-8">
        {/* Left Arrow */}
        <button
          onClick={slideLeft}
          className="text-orange-400 transition-colors ease-in-out w-[60px] h-[40px] rounded-md transform hover:scale-110"
        >
          <FaArrowLeft />
        </button>
        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
          {visibleReviews.map((review, index) => (
            <Testimonial
              key={index}
              stars={review.stars}
              comment={review.comment}
              name={review.name}
            />
          ))}
        </div>
        {/* Right Arrow */}
        <button
          onClick={slideRight}
          className="text-orange-400 transition-colors ease-in-out w-[60px] h-[40px] rounded-md transform hover:scale-110"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
