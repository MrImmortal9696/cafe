import BannerTextHorizontal from "./BannerTextHorizontal";

// Chef data
const chefsData = [
  {
    name: "Hasan Defour",
    bio: [
      "We are thrilled to introduce Hasan Defour, a renowned Caribbean chef bringing vibrant, authentic flavors to Tropical Cafe in Glasgow. Born in Trinidad and Tobago, Hasan has made a name for himself internationally, skillfully blending traditional Caribbean cuisine with a modern twist. His passion for creating wholesome and accessible dishes has established him as a leader in Caribbean culinary arts.",
      "Hasan's expertise promises to enhance your dining experience with a bold fusion of island flavors and fresh ingredients, offering a true taste of the Caribbean. His culinary journey includes significant stints in award-winning restaurants and innovative concepts, such as Lime House in Singapore, the country’s first Caribbean restaurant, which received acclaim and was ranked among the top 10 best new restaurants. After his successful tenure there, Hasan returned to the UK to develop the fast-casual concept Baygo in London.",
      'In addition to his restaurant ventures, Hasan has collaborated with top UK chefs on various television programs, including "Rhodes Across the Caribbean" with Gary Rhodes, the "Taste of Home" series with the Hairy Bikers, and "Marrying Mum and Dad" on CBBC. These experiences have not only showcased his culinary skills but also helped promote Caribbean cuisine to a wider audience. At Baygo, Hasan redefined Caribbean cuisine for a fast-paced lifestyle, ensuring that every dish reflects the rich cultural heritage of the islands while catering to contemporary dietary preferences.',
      "With Hasan at the helm, we are excited to elevate our menu at Tropical Cafe and provide you with an unforgettable culinary experience that celebrates the essence of Caribbean cooking. Prepare to indulge in a delightful array of dishes that not only satisfy the palate but also tell a story of tradition, creativity, and passion. We look forward to welcoming you to experience the vibrant flavors of the Caribbean right here in Glasgow!",
    ],
  },
  {
    name: "Brian Thomas",
    bio: [
      "From the vibrant streets of Port of Spain, Trinidad, where I grew up immersed in the rich flavors of the Caribbean, my culinary journey began under the loving guidance of my grandparents. Their passion for food and mastery of flavor ignited my own passion for cooking. To hone my skills in blending local and international cuisine, I studied at the prestigious Trinidad and Tobago Hospitality Institute (TTHI), the Caribbean's mecca for culinary excellence. I've had the honor of working in some of Trinidad and Tobago's top-rated restaurants such as Crew's Inn Lighthouse Restaurant, Trotters, Prime Restaurant & Steakhouse, Texas De Brazil, Rizzoni's, and Chaud, holding positions from Line Cook to Sous Chef.",
      "After serving in some of the best kitchens, I transitioned to a new adventure as a Campboss in the Oil and Gas industry, working across Nicaragua, Aruba, Guyana, and back home in Trinidad & Tobago. For the last 9 years. I've continued to lead as a head chef, serving diverse teams across multiple countries. Now, I'm excited to bring my culinary experience and love for bold flavours to Tropical Cafe - where Caribbean soul meets international flair. Come join me on this new journey as we serve up dishes inspired by my travels and the island I call home.",
    ],
  },
];

export default function AboutChefSection({ chef }) {
  // Find the chef's data based on the chef name
  const selectedChef = chefsData.find((chefData) => chefData.name === chef);

  return (
    <div className="w-[95%] bg-white relative min-h-[0vh] container-shadow-top flex flex-col items-center gap-[100px] py-8">
      {/* Check if a chef is selected */}
      {selectedChef ? (
        <>
          <BannerTextHorizontal
            top="Our Chef"
            heading={selectedChef.name}
            description={
              selectedChef.name === "Hasan Defour"
                ? "Renowned Caribbean chef"
                : ""
            }
            button1Text="TABLE ORDER"
            // button1Link="/table-order" // Replace with actual link
            // button2Text="ONLINE SHOP"
            // button2Link="/online-shop" // Replace with actual link
          />
          {/* Chef Bio */}
          <div className="flex lg:w-[60%] w-full flex-wrap justify-center px-4">
            {selectedChef.bio.map((item, index) => (
              <div key={index} className="w-full p-6 rounded-lg text-justify">
                <p className="lg:text-[16px] text-[12px] font-semibold opacity-90 leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
