import Image from "next/image";
import AttractIcon3D from '@/components/Scene'
import ArrowButtons from '@/components/Arrows'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      {/*Logo*/}
      <div className="absolute top-10 left-10 z-999">
        <Image src={"/attract-group-logo.svg"} alt="AttractGroup" width={300} height="100"/>
      </div>
      
      {/*3D Logo*/}
      <AttractIcon3D />

      {/*Arrows*/} 
      <div className="absolute bottom-10 right-10 z-999">
        <ArrowButtons/>
      </div>
    </div>
  );
}
