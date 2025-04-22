import { CircleUser } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function NavTrading() {
  return (
    <>
      <header className="bg-blue-950">
        <nav className="flex items-center justify-between p-4">
          <div className="flex items-center gap-1">
            <img src="/Voin.png" alt="Logo" className="size-10" />
            <h1 className="font-semibold text-lg">Voin</h1>
          </div>

          <div className="flex gap-4 ">
            <div className="flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-white text-black">
              <img src="/Voin.png" alt="Logo" className="size-6" />
              <h1 className="mr-2">130.000.00</h1>
            </div>

            <Button className="bg-white text-black" variant={"ghost"}>
              <CircleUser />
            </Button>
          </div>
        </nav>
      </header>
    </>
  );
}
