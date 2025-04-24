import { Button } from "../../components/ui/button";

export default function NavTrading() {
  return (
    <>
      <header className="bg-[#0e0e0e] border-b border-green-500/20 mb-2">
        <nav className="flex items-center justify-between py-2 p-2">
          <div className="flex items-center gap-1 px-2">
            <h1 className="font-mono font-bold  text-sm">VOIN</h1>
          </div>

          <div className="flex gap-2 p-0">
            <div className="flex items-center justify-center gap-1 px-4 rounded-md text-green-50  border border-green-50 border-opacity-20 cursor-pointer bg-[#181818]">
              <img src="/Voin.png" alt="Logo" className="size-5" />
              <h1 className="mr-1 text-xs">130.000.00</h1>
            </div>

            <Button
              className="flex w-full p-0 m-0 justify-center items-center rounded-full cursor-pointer bg-transparent hover:bg-transparent"
              variant={"ghost"}
            >
              <img
                src="/patente/Bronze.png"
                alt=""
                className="w-10 h-10 border border-green-50 border-opacity-20 rounded-full bg-[#181818]"
              ></img>
            </Button>
          </div>
        </nav>
      </header>
    </>
  );
}
