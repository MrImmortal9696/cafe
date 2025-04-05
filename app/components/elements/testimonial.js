export default function Testimonial({ stars, comment, name }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "10px",
      }}
      className="flex flex-col justify-between lg:text-[16px] text-[12px] gap-8 border border-zinc-400 "
    >
      {/* Stars Section */}

      {/* Comment Section */}
      <div>
        <span style={{ fontStyle: "italic" }} className="font-semibold">
          {comment}
        </span>
      </div>
      {/* Name Section */}
      <div className="flex justify-between">
        <span>- {name}</span>
        <div>
          {Array.from({ length: stars }).map((_, index) => (
            <span key={index}>⭐</span>
          ))}
        </div>
      </div>
    </div>
  );
}
