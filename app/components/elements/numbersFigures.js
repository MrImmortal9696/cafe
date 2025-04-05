export default function NumbersFigures({ number, text, sign = "+" }) {
  return (
    <div className="flex-col-center">
      <div className="text-[28px] font-serif">
        <span>{number} </span>
        <span className="text-yellow-500">{sign}</span>
      </div>
      <span className="font-semibold">{text}</span>
    </div>
  );
}
