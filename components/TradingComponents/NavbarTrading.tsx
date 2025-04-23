import { CircleUser } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function NavTrading() {
  return (
    <>
      <header className="bg-[#212121] border-b border-green-500/20 mb-2">
        <nav className="flex items-center justify-between p-4">
          <div className="flex items-center gap-1">
            <h1 className="font-mono font-bold  text-sm">VOIN</h1>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center justify-center gap-1 px-4 py-1 rounded-md text-green-50  border border-green-50 border-opacity-20 cursor-pointer bg-[#212121] hover:bg-[#181818]">
              <img src="/Voin.png" alt="Logo" className="size-5" />
              <h1 className="mr-1 text-xs">130.000.00</h1>
            </div>

            <Button
              className="flex w-full justify-center items-center p-1 rounded-full cursor-pointer bg-transparent hover:bg-transparent"
              variant={"ghost"}
            >
              <img
                src="/patente/Bronze.png"
                alt=""
                className="w-10 h-10 p-1 border border-green-50 border-opacity-20 rounded-full bg-[#212121] hover:bg-[#181818]"
              ></img>
            </Button>
          </div>
        </nav>
      </header>
    </>
  );
}
