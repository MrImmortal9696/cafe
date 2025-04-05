import Image from "next/image";

export default function IconText({ icon, title, description }) {
  return (
    <div className="flex-col-center gap-4 px-4">
      <Image src={icon} width={100} height={100} alt={"Menu image"} />
      <span className="font-semibold text-xl">{title}</span>
      <span className="text-center">{description}</span>
    </div>
  );
}
