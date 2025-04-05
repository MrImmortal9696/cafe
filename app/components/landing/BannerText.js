export default function BannerText({
  top,
  heading,
  description,
  button1Text,
  button1Link,
  button2Text,
  button2Link,
  blurstatus = false,
}) {
  return (
    <div
      className={`flex flex-col lg:gap-8
		gap-4 font-semibold rounded-[20px] p-4  `}
    >
      {/* Top Tagline */}
      <div className="flex items-center gap-4">
        <div className="w-[40px] h-[4px] rounded-full bg-orange-500"></div>
        <span className="  font-semibold text-[10x] text-center lg:text-[16px] xl:text-[18px]">
          {top}
        </span>
      </div>

      {/* Heading */}
      <div>
        <span
          className={`font-serif flex  flex-col
               lg:text-[36px] xl:[48px] text-[20px]
          }`}
        >
          {heading}
        </span>
      </div>

      {/* Description */}
      <div className="lg:text-[16px] text-[12px]">
        <span>{description}</span>
      </div>

      {/* Buttons */}
      <div className="text-[14px] gap-4 flex items-center">
        <a href={button1Link} className="orange-button">
          {button1Text}
        </a>
        <a
          href={button2Link}
          className="lg:text-[14px] text-[12px] opacity-80 cursor-pointer"
        >
          {button2Text}
        </a>
      </div>
    </div>
  );
}
