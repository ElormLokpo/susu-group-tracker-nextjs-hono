
import { GoArrowUpRight } from "react-icons/go";
import { TopNav } from "./components/topNav";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <div className="hidden md:block fixed top-0 w-full h-full z-10 ">
        <TopNav />
      </div>

      <div className="py-3 md:py-5 lg:py-10 text-stone-800">
        <HomepageContent />
      </div>

      <div>
        <Footer />
      </div>

    </div>
  );
}

const Marquee = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap flex items-center justify-center py-4">
      <div className="inline-flex animate-marquee">

        <div className="flex items-center gap-12 px-8">
          <span className="text-lg flex gap-2 items-center font-medium text-gray-700">
            <Image src="/mtn.svg" width={100} height={100} alt="Partner" className="h-8 w-auto opacity-70" />
            MTN Ghana
          </span>

          <span className="text-lg flex gap-2 items-center font-medium text-gray-700">
            <Image src="/telecel.svg" width={100} height={100} alt="Partner" className="h-8 w-auto opacity-70" />
            Telecel Ghana
          </span>

          <span className="text-lg flex gap-2 items-center font-medium text-gray-700">
            <Image src="/paystack.svg" width={70} height={100} alt="Partner" className="h-8 w-auto opacity-70" />

          </span>




        </div>


        <div className="flex items-center gap-12 px-8">
          <span className="text-lg flex gap-2 items-center font-medium text-gray-700">
            <Image src="/mtn.svg" width={100} height={100} alt="Partner" className="h-8 w-auto opacity-70" />
            MTN Ghana
          </span>

          <span className="text-lg flex gap-2 items-center font-medium text-gray-700">
            <Image src="/telecel.svg" width={100} height={100} alt="Partner" className="h-8 w-auto opacity-70" />
            Telecel Ghana
          </span>

          <span className="text-lg flex gap-2 items-center font-medium text-gray-700">
            <Image src="/paystack.svg" width={70} height={100} alt="Partner" className="h-8 w-auto opacity-70" />

          </span>
        </div>
      </div>
    </div>
  )
}


const HomepageContent = () => {
  return (
    <div className="px-3 md:px-10 lg:px-20">
      <div className="pt-10 md:pt-30 mb-10 rounded-3xl md:p-10">

        <div className="mb-10 md:mb-10 lg:mb-10 2xl:mb-15">

          <div className=" md:px-10 lg:px-40 2xl:px-60 text-center flex flex-col gap-5 items-center justify-center">
            <div className="headerText leading-7 md:leading-8 lg:leading-10 text-[25px] md:text-[28px] lg:text-[40px] 2xl:text-[60px] 2xl:leading-16.25 tracking-[-1.64px] lg:mb-2 2xl:mb-5">
              <span>Contribute anytime. </span>
              <div className="md:bg-lime-500 lg:tracking-[-4px] 2xl:tracking-[-4px] text-stone-900 px-2  rounded-full flex items-center">

                <span className="text-stone-900 lg:text-[40px] 2xl:text-[50px] w-full"> Receive your money weekly.</span>
              </div>

              <span> Reach your financial goals. With friends </span>

            </div>
            <div className="text-[18px] md:px-8 lg:px-30 text-center 2xl:px-80"><span className="bg-white p-2 rounded-md text-[16px] font-semibold">Group savings</span>, fixed contributions, and fair and <span className="bg-stone-800 rounded-md text-stone-100 px-2 py-2 text-[16px]">consistent payouts </span>. Receive money every week.</div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-10 md:mb-20 lg:mb-20 2xl:mb-50">
          <button className=" md:text-xs lg:text-normal flex items-center animate-bounce bg-stone-900 text-stone-100 gap-3 pr-2 pl-5 shadow-xl shadow-lime-500 py-2 rounded-full"> Get started with SuSu<span className="bg-white text-stone-900 p-2 text-xl rounded-full"> <GoArrowUpRight /> </span></button>
        </div>

        

      </div>

      <div className=" md:grid md:grid-cols-3 md:gap-2 lg:gap-3 2xl:gap-10 md:h-100 lg:h-150  mb-20">
          <div className="mb-5 md:mb-0 md:col-span-2 h-100  md:h-full rounded-2xl" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1655720357740-bdf90f34483f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D)", backgroundSize: "cover", backgroundPosition: "center" }}>{" "}</div>

          <div className="md:cols-span-1 rounded-2xl bg-[#122020] text-stone-100 p-2">
            <div className="border rounded-2xl h-full p-3 md:p-4 lg:p-10 border-stone-600">

              <div className="md:mb-10 lg:mb-10">
                <div className="grid grid-cols-7 gap-3 mb-3">

                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="bg-lime-500 w-5 h-5 md:w-3 md:h-3 lg:w-8 lg:h-8 2xl:w-12 2xl:h-12 rounded-full">

                    </div>
                  ))}

                  {Array(2).fill(0).map((_, index) => (
                    <div key={index} className="bg-lime-200 w-5 h-5 md:h-3 md:w-3 lg:w-8 lg:h-8 2xl:w-12 2xl:h-1 rounded-full">

                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-3 mb-3">

                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="bg-lime-500 w-5 h-5 md:w-3 md:h-3  lg:w-8 lg:h-8 2xl:w-12 2xl:h-1 rounded-full">

                    </div>
                  ))}

                  {Array(4).fill(0).map((_, index) => (
                    <div key={index} className="bg-lime-200 w-5 h-5  md:w-3 md:h-3 lg:w-8 lg:h-8 2xl:w-12 2xl:h-1 rounded-full">

                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-3 mb-7 md:mb-3">

                  {Array(2).fill(0).map((_, index) => (
                    <div key={index} className="bg-lime-500 w-5 h-5 md:w-3 md:h-3 lg:w-8 lg:h-8 2xl:w-12 2xl:h-1 rounded-full">

                    </div>
                  ))}

                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="bg-lime-200 w-5 h-5 md:w-3 md:h-3  lg:w-8 lg:h-8 2xl:w-12 2xl:h-1 rounded-full">

                    </div>
                  ))}
                </div>

              </div>

              <div className="flex justify-between items-baseline mb-10">
                <span className="lg:text-[50px] 2xl:text-[72px] ">6.5X</span>
                <span className="text-[18px] text-stone-300">Blended POT</span>
              </div>


              <div className="pt-10 border-t border-stone-600">
                <div className="md:text-[18px] lg:text-[20px] 2xl:text-[23px] mb-10 font-semibold lg:w-60">Built for fairness, and steady savings</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[18px] text-stone-300"> POT in 5 days</span>
                  <span className="lg:text-[30px] 2xl:text-[42px]">100%</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-stone-900 px-5 rounded-3xl mb-20 lg:mb-30 2xl:mb-50 text-stone-100 py-50 lg:px-90" >
          <div className="md:text-[25px] lg:text-[30px] 2xl:text-[42px]">
            Most savings groups run on trust. We run on clarity.

            <span className="text-lime-500">Every contribution is tracked, and every payout follows the order. </span> That loop is the entire system.
          </div>
        </div>



      <div className="md:flex md:flex-col mb-20 lg:mb-30 2xl:mb-60 md:items-center md:justify-center">
        <div className="flex flex-col text-center mb-10 px-8 lg:px-80 2xl:px-150 ">
          <span className=" mb-5 text-[25px] leading-6 md:leading-10 md:text-[35px] font-semibold md:mb-1">Savings you can count on </span>
          <span className="text-[14px] md:text-[18px] ">Every circle starts with a target and ends with a payout. This happens on a weekly basis</span>
        </div>


        <div className="px-2 md:px-10 lg:grid lg:grid-cols-2 lg:gap-5 lg:h-100">
          <div className="p-5 bg-[#FFBCFC] mb-5 md:mb-5  h-100 md:h-100 rounded-3xl flex flex-col justify-between lg:p-5 md:p-10">
            <div className="">
              <span className="bg-stone-900 p-2 text-xs lg:text-sm rounded-full font-semibold text-stone-100">Peak ROWP</span>
            </div>

            <div>
              <div className="text-[40px] font-semibold">8.1X</div>
              <div className=" md:text-[18px] text-stone-700 lg:w-80 leading-5">Return on weekly pool — Susu group, peak payout</div>
            </div>

          </div>

          <div className="bg-stone-200 h-100 md:h-100 p-5 md:p-10 rounded-3xl flex flex-col justify-between">
            <div className=" flex justify-between items-center text-sm">
              <span className="md:text-lg text-stone-600 font-semibold">Payout efficiency</span>
              <span className="bg-white text-xs md:text-md p-1 md:p-2 rounded-full text-stone-900 md:font-semibold">Peak WPRS</span>
            </div>

            <div>
              <div className="text-[40px] font-semibold text-center mb-3">8.1X</div>
              <div className="grid grid-cols-9 gap-2 md:gap-3 mb-3">
                {
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="bg-stone-300 w-5 md:w-7 h-15 rounded-md">

                    </div>
                  ))
                }

                {
                  Array(2).fill(0).map((_, index) => (
                    <div key={index} className="bg-[#FDE589] w-5 md:w-7 h-15 rounded-md">

                    </div>
                  ))
                }

                {
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="bg-stone-300 w-5 md:w-7 h-15 rounded-md">

                    </div>
                  ))
                }
              </div>

              <div className="md:text-[18px] text-stone-700 lg:w-80 leading-5">$50 → $500 weekly payout, rotation savings</div>
            </div>

          </div>
        </div>
      </div>





      <div className=" md:px-8 lg:px-35 2xl:px-80 mb-50">
        <div className="flex  justify-between items-baseline md:items-center mb-10">
          <span className="text-xl  lg:text-5xl mb-5">How it works</span>

          <button className="flex text-xs md:text-sm items-center hover:animate-pulse shadow-2xl shadow-stone-800 bg-stone-900 text-stone-100 gap-3 pr-1 md:pr-2 pl-1 md:pl-5  py-1 md:py-2 rounded-full"> <span className="hidden md:block"> Learn More </span> <span className="bg-white text-stone-900 p-2 text-xl rounded-full"> <GoArrowUpRight /> </span></button>

        </div>

        <div className="rounded-3xl h-100 md:flex md:justify-end md:p-2" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1655682597213-1fa005eb18b9?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D)", backgroundSize: "cover", backgroundPosition: "center" }}>

          <div className="h-full p-6 bg-stone-900 text-stone-100 md:w-[60%] lg:w-[40%] rounded-3xl">
            <div className="mb-5 text-center text-lg md:text-2xl">Group savings</div>

            <div className="md:leading-10 font-light text-stone-300 text-center">
              Join a Susu group, pay fixed weekly contribution of <span className=" text-lime-500">GHC 50</span>, and save alongside trusted members. Each week, the full collected pot goes to one member based on join order. Everyone gets their lump sum when their turn comes.
            </div>

          </div>
        </div>

      </div>

      {/* <div className="mb-50 flex flex-col gap-5 items-center justify-center">
        <div className="text-[30px] flex gap-4 items-center">
          Payment companies we work with
        </div>

        <Marquee />
      </div> */}

    </div>
  )
}



function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white py-12 text-neutral-600">
      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-6 sm:flex-row">

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-neutral-900">
            SuSu
          </span>
          <span className="text-xs text-neutral-400">© {new Date().getFullYear()}</span>
        </div>


        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
          <a href="#how-it-works" className="transition hover:text-neutral-900">
            How it Works
          </a>
          <a href="#groups" className="transition hover:text-neutral-900">
            Groups
          </a>
          <a href="#faq" className="transition hover:text-neutral-900">
            FAQ
          </a>
          <a href="#terms" className="transition hover:text-neutral-900">
            Terms
          </a>
          <a href="#privacy" className="transition hover:text-neutral-900">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  );
}