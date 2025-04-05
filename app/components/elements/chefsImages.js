import Image from "next/image";
import SocialsIcons from "./socialsIcons";
import brian from "../../../public/landing/brian.jpg";
export default function ChefsImages({ image, name, socials, post }) {
  return (
    <div className="flex-col-center gap-4 text-zinc-700 font-serif">
      <Image
        src={image} // Use the dynamic image prop
        width={400}
        height={400}
        alt={`${name} image`}
        className="w-[400px] h-[400px] object-cover object-top top rounded-lg"
      />
      <span className="text-[24px]">{name}</span>
      <span className="text-[18px] opacity-60">{post}</span>
      {/* <SocialsIcons /> */}
    </div>
  );
}
