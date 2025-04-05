import BannerText from "./BannerText";

export default function WorkingHoursSection() {
  const data = [
    { day: "Sunday", start: "12 pm", end: "11 pm" },
    { day: "Monday", closed: true }, // Mark Monday as closed
    { day: "Tuesday", start: "12 pm", end: "11 pm" },
    { day: "Wednesday", start: "12 pm", end: "11 pm" },
    { day: "Thursday", start: "12 pm", end: "11 pm" },
    { day: "Friday", start: "12 pm", end: "1 am" },
    { day: "Saturday", start: "12 pm", end: "1 am" },
  ];

  return (
    <div className="w-[95%] h-auto lg:h-[80vh] flex-center bg-white flex-col lg:flex-row gap-6">
      {/* Left Section */}
      <div className="text-black h-[80%] flex-center bg-[#F59D12] bg-opacity-20 w-[90%] lg:w-1/2 lg:rounded-l-[20px] rounded-[20px] p-6">
        <BannerText
          top="Serving at"
          heading="Working Hours"
          description="We’re here to bring the vibrant flavors of the Caribbean to your table!"
          button1Text="RESERVATION"
          button2Text="CONTACT US"
          button1Link="/reservation"
          button2Link="/contact"
        />
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-start justify-center flex-shrink-0 lg:w-1/3 w-[90%] font-serif py-4 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between w-full border-b border-gray-300 pb-2"
          >
            <span className="text-[18px] font-medium text-gray-800">
              {item.day}
            </span>
            <div className="flex gap-2 text-gray-600">
              {item.closed ? (
                <span className="text-[18px]">Closed</span> // Keep styling consistent
              ) : (
                <>
                  <span className="text-[18px]">{item.start}</span>
                  <span>-</span>
                  <span className="text-[18px]">{item.end}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
