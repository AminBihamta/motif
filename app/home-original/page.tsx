import CustomLink from "../components/CustomLink";
import Image from "next/image";
import { Running } from "iconoir-react";
import AnimatedContainer from "../components/animated-container";
import MotifLogo from "../components/motif-logo";
import Popup from "../components/popup";

export default function Home() {
  const rowImages1 = [
    "/assets/style-references/01-mid-century.jpg",
    "/assets/style-references/02-mid-century.jpg",
    "/assets/style-references/03-mid-century.jpg",
    "/assets/style-references/04-mid-century.jpg",
    "/assets/style-references/05-mid-century.jpg",
    "/assets/style-references/06-mid-century.jpg",
    "/assets/style-references/07-mid-century.jpg",
    "/assets/style-references/08-mid-century.jpg",
    "/assets/style-references/09-mid-century.jpg",
    "/assets/style-references/10-mid-century.jpg",
    "/assets/style-references/11-mid-century.jpg",
    "/assets/style-references/12-mid-century.jpg",

    "/assets/style-references/13-bohemian.jpg",
    "/assets/style-references/14-bohemian.jpg",
    "/assets/style-references/15-bohemian.jpg",
    "/assets/style-references/16-bohemian.jpg",
    "/assets/style-references/17-bohemian.jpg",
    "/assets/style-references/18-bohemian.jpg",
    "/assets/style-references/19-bohemian.jpg",
    "/assets/style-references/20-bohemian.jpg",
    "/assets/style-references/21-bohemian.jpg",
    "/assets/style-references/22-bohemian.jpg",
    "/assets/style-references/23-bohemian.jpg",
    "/assets/style-references/24-bohemian.jpg",
  ];

  const rowImages2 = [
    "/assets/style-references/25-bauhaus.jpg",
    "/assets/style-references/26-bauhaus.jpg",
    "/assets/style-references/27-bauhaus.jpg",
    "/assets/style-references/28-bauhaus.jpg",
    "/assets/style-references/29-bauhaus.jpg",
    "/assets/style-references/30-bauhaus.jpg",

    "/assets/style-references/32-abstract-geometry.jpg",
    "/assets/style-references/33-abstract-geometry.jpg",
    "/assets/style-references/34-abstract-geometry.jpg",
    "/assets/style-references/35-abstract-geometry.jpg",
    "/assets/style-references/36-abstract-geometry.jpg",
    "/assets/style-references/37-abstract-geometry.jpg",
    "/assets/style-references/38-abstract-geometry.jpg",
    "/assets/style-references/39-abstract-geometry.jpg",

    "/assets/style-references/32-vintage-fashion.jpg",
    "/assets/style-references/33-vintage-fashion.jpg",
    "/assets/style-references/34-vintage-fashion.jpg",
    "/assets/style-references/40-vintage-fashion.jpg",

    "/assets/style-references/35-streetwear.jpg",
    "/assets/style-references/36-streetwear.jpg",
    "/assets/style-references/37-streetwear.jpg",
  ];

  return (
    <AnimatedContainer>
      <main className="w-full h-full flex justify-center md:justify-start items-center flex-col md:pt-50">
        <div className="flex flex-col">
          <h1 className="text-6xl md:text-9xl text-center font-light">Welcome to</h1>
          <div className="absolute left-1/2 flex w-[min(90vw,36rem)] -translate-x-1/2 translate-y-16 justify-center md:w-[min(70vw,48rem)] md:translate-y-32">
            <MotifLogo className="h-auto w-full brightness-0 dark:brightness-100" priority />
          </div>

          <h2 className="text-md md:text-2xl text-center mt-20 md:mt-40">Your vibe finder</h2>
          <Image
            className="absolute top-[-150] right-[-250] z-1 md:block hidden"
            src="/assets/persian-rug-1.png"
            width={700}
            height={200}
            alt="Persian Rug"
          />

          <Image
            className="absolute md:top-[50] md:left-[50] top-60 left-2 w-40"
            src="/assets/star.png"
            width={300}
            height={200}
            alt="Star"
            id="rotating-star"
          />
          <Image
            className="absolute md:bottom-[30vh] right-[-130] md:right-[-100] md:w-75 md:h-75 w-60 bottom-[10vh]"
            src="/assets/cd.png"
            width={300}
            height={200}
            alt="Star"
            id="rotating-cd"
          />

          <Image
            className="absolute md:bottom-[10vh] bottom-[5vh] md:left-[-300] left-[-150] z-1 w-75 h-75 md:w-75 md:h-75 "
            src="/assets/persian-rug-flower-transparent.png"
            width={600}
            height={600}
            alt="Star"
          />
          <div className="flex w-fill justify-center gap-4 mt-10 ">
            <Popup />
            <CustomLink
              theme="red"
              label="Give it a try"
              icon={Running}
              link="find-my-vibe"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 overflow-hidden z-2 absolute top-0 md:hidden">
          <div className=" w-max shrink-0 gap-2 scroll-left flex">
            {[...rowImages1, ...rowImages1].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Placeholder"
                width={200}
                height={200}
                className="row-image size-56 shrink-0 rounded-lg object-cover"
              />
            ))}
          </div>

          <div className="flex w-max shrink-0 gap-2 scroll-right hidden md:flex">
            {[...rowImages2, ...rowImages2].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Placeholder"
                width={200}
                height={200}
                className="row-image size-56 shrink-0 rounded-lg object-cover"
              />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 overflow-hidden z-2 absolute bottom-0">
          <div className=" w-max shrink-0 gap-2 scroll-left hidden md:flex">
            {[...rowImages1, ...rowImages1].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Placeholder"
                width={200}
                height={200}
                className="row-image size-56 shrink-0 rounded-lg object-cover"
              />
            ))}
          </div>

          <div className="flex w-max shrink-0 gap-2 scroll-right ">
            {[...rowImages2, ...rowImages2].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Placeholder"
                width={200}
                height={200}
                className="row-image size-56 shrink-0 rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      </main>
    </AnimatedContainer>
  );
}
