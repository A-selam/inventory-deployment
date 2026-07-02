import Link from "next/link";
import { Archive } from "lucide-react";

export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Copyright */}
         <p className="text-right  text-sm text-slate-400">
         &copy; {year} StockLogic. All rights reserved.
         </p>


         
        </div>
      </div>
    </footer>
  );
}
