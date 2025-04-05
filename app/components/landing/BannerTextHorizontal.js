export default function BannerTextHorizontal({
  top = "HELLO, NEW FRIEND!",
  heading = "Reserve Your Table Today",
  description = "Come and dine with us or order anything Come and dine with us or order anything",
  nav,
}) {
  return (
    <div className="flex flex-col gap-6  items-center ">
      <div className="flex flex-col items-center gap-4 ">
        <div className="w-[60px] h-[6px] rounded-full bg-orange-500"></div>

        <span className=" text-[16px] font-semibold  lg:text-[20px]">
          {top}
        </span>
      </div>
      <div>
        <span
          className={`font-serif text-[28px] lg:text-[42px]  flex flex-col `}
        >
          {heading}
        </span>
      </div>
      <div className="text-center">
        <span className="opacity-80 text-[12px] lg:text-[16px]  font-medium ">{description}</span>
      </div>
      {/* <pre>{JSON.stringify(nav, null, 2)}</pre> */}

      {nav && (
        <div className="orange-button">
          {nav.map((item, index) => (
            <a
              href={index === nav.length - 1 ? undefined : item.link} // No href for the last item
              key={index}
              className={`${
                index === nav.length - 1
                  ? "opacity-50 pointer-events-none cursor-not-allowed"
                  : ""
              }`}
            >
              {item.name}
              {index !== nav.length - 1 && "  >  "}{" "}
              {/* Add ">" only if it's not the last item */}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
