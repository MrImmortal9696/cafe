import NumbersFigures from "../elements/numbersFigures";

export default function NumericalData() {
  const data = [
    { number: 200, text: "Visitors Daily" },
    { number: 400, text: "Deliveries monthly" },
    { number: 100, sign: "%", text: "Positive feedback" },
    { number: 40, text: "Awards and honors" },
  ];

  return (
    <div className="bg-white py-8 h-auto  lg:h-[30vh] w-[95%] flex ">
      <div className=" w-[60%] py-8 mx-auto flex justify-evenly border-y-4 gap-8 border-dotted border-zinc-300 flex-wrap">
        {data.map((item, index) => (
          <NumbersFigures
            key={index}
            number={item.number}
            text={item.text}
            sign={item.sign}
          />
        ))}
      </div>
    </div>
  );
}
