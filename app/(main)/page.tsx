"use client";
import { Button, Input, Image } from "@heroui/react";

import { siteConfig } from "@/config/site";
// import { Link } from "@heroui/link";
// import { Snippet } from "@heroui/snippet";
// import { Code } from "@heroui/code";
// import { button as buttonStyles } from "@heroui/theme";

// import { siteConfig } from "@/config/site";
// import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="pb-12">
      <section className="flex bg-cover bg-no-repeat h-[520px] bg-[url('https://bbdbuy.oss-cn-hongkong.aliyuncs.com/uploads/20250220/c4917de822e9f85cec22162733faad64.jpg')]">
        <div className="container mx-auto flex-col flex justify-center items-center 	max-w-6xl">
          <div className="text-6xl tracking-tighter font-bold text-white mb-[50px]">
            <p>Simplify Your Shopping With BBD</p>
          </div>
          <Input
            endContent={
              <Button className="bg-[#f0700c] text-[#fff]">Search</Button>
            }
            label="Enter product name / link"
            radius={"full"}
            size={"lg"}
            type="email"
          />
        </div>
      </section>

      <div className="container mx-auto">
        <div className="mt-[20px] flex justify-evenly">
          <Image
            alt="HeroUI hero Image"
            src="	https://bbdbuy.com/uploads/20241029/61049479ab798a2c55ec58757d45f56c.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="	https://bbdbuy.com/uploads/20241029/4e05c63f6f2a87850e803ea0c907c705.png"
            width={350}
          />
          {/* <Carousel arrows autoplay>
            <div className="!flex justify-between" style={contentStyle}>
              <Image
                alt="HeroUI hero Image"
                src="	https://bbdbuy.com/uploads/20241029/61049479ab798a2c55ec58757d45f56c.png"
                width={350}
              />
              <Image
                alt="HeroUI hero Image"
                src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
                width={350}
              />
              <Image
                alt="HeroUI hero Image"
                src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
                width={350}
              />
              <Image
                alt="HeroUI hero Image"
                src="	https://bbdbuy.com/uploads/20241029/4e05c63f6f2a87850e803ea0c907c705.png"
                width={350}
              />
            </div>
            <div className="!flex justify-between" style={contentStyle}>
              <Image
                alt="HeroUI hero Image"
                src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
                width={350}
              />
              <Image
                alt="HeroUI hero Image"
                src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
                width={350}
              />
              <Image
                alt="HeroUI hero Image"
                src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
                width={350}
              />
              <Image
                alt="HeroUI hero Image"
                src="	https://bbdbuy.com/uploads/20241029/4e05c63f6f2a87850e803ea0c907c705.png"
                width={350}
              />
            </div>
          </Carousel> */}
        </div>
        <h2 className="text-4xl  font-bold text-center my-14">
          One-Stop Shopping Service
        </h2>
        <div className="flex justify-evenly">
          {siteConfig.describeItems.map((item) => {
            return (
              <div
                key={item.title}
                className="w-[22%] border border-solid border-[#f5f5f5] p-8"
              >
                <Image height={120} src={item.src} width={170} />
                <h6 className="text-[18px] leading-[60px] font-bold">
                  {item.title}
                </h6>
                <div className="text-[14px] leading-[24px] text-[#7d8fb3]">
                  {item.describe}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    // <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
    //   <div className="inline-block max-w-xl text-center justify-center">
    //     <span className={title()}>Make&nbsp;</span>
    //     <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
    //     <br />
    //     <span className={title()}>
    //       websites regardless of your design experience.
    //     </span>
    //     <div className={subtitle({ class: "mt-4" })}>
    //       Beautiful, fast and modern React UI library.
    //     </div>
    //   </div>

    //   <div className="flex gap-3">
    //     <Link
    //       isExternal
    //       className={buttonStyles({
    //         color: "primary",
    //         radius: "full",
    //         variant: "shadow",
    //       })}
    //       href={siteConfig.links.docs}
    //     >
    //       Documentation
    //     </Link>
    //     <Link
    //       isExternal
    //       className={buttonStyles({ variant: "bordered", radius: "full" })}
    //       href={siteConfig.links.github}
    //     >
    //       <GithubIcon size={20} />
    //       GitHub
    //     </Link>
    //   </div>

    //   <div className="mt-8">
    //     <Snippet hideCopyButton hideSymbol variant="bordered">
    //       <span>
    //         Get started by editing <Code color="primary">app/page.tsx</Code>
    //       </span>
    //     </Snippet>
    //   </div>
    // </section>
  );
}
