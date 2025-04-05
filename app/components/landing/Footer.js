import Image from "next/image";
import CompanyLogo from "../../../public/logo-sm-white.png";
import SocialsIcons from "../elements/socialsIcons";
import MapComponent from "../elements/map";
import Link from "next/link";
export default function Footer() {
  return (
    <div className="lg:w-[80%] w-[90%] flex flex-col items-center justify-around text-white min-h-[80vh] py-8">
      
      <Link href={"/"} className="flex w-full gap-2 items-center justify-between">
        <Image
          src={CompanyLogo}
          alt="CompanyLogo"
          width={200}
          height={200}
          className="xl:w-[200px] lg:w-[150px] w-[100px] rounded-2xl"
        />
        <SocialsIcons />
      </Link>

      <div className=" py-4 grid lg:grid-cols-2 grid-cols-1 gap-4">
        <div className="flex flex-col gap-4 justify-around h-full ">
          <div className="">
            <h1 className="lg:text-[24px] text-[14px]">
              <strong>Stay Updated</strong>
            </h1>
            <p className="lg:text-[16px] text-[12px] text-zinc-300 font-semibold">
              Share your details with us, and we’ll keep you in the loop with
              exciting updates, special offers, and our exclusive newsletters.
              We promise to keep things fresh and full of flavor!
            </p>
          </div>

          <div className=" flex-grow-0 w-[180px] ">
              <a href="/contact" className="orange-button p-2">
                CONTACT US
              </a>
          </div>
          <div className="flex flex-col">
            <h1 className="lg:text-[24px] text-[14px]">
              <strong>Contact Info</strong>
            </h1>
            <div className="lg:text-[16px] flex flex-col text-[12px] text-zinc-300 font-semibold">
              <span>
                <strong>Phone :</strong>+44 141 286 6653
              </span>
              <span>
                <strong>Email :</strong>info@tropicalcafe.co.uk
              </span>
              <span>
                <strong>Address:</strong> Tropical Café,
                <br />
                51 Bell St, Merchant City,
                <br />
                Glasgow, United Kingdom
                <br />
                G1 1NX
              </span>
            </div>
          </div>
        </div>
        <div className="lg:min-w-[500px] w-full bg-green-200 h-[400px] rounded-xl overflow-hidden">
          <MapComponent />
        </div>
      </div>
    </div>
  );
}
