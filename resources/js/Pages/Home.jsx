import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

export default function Home({ auth }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      // header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <div className="">
        <div className="sm:p-6 lg:p-7 grid grid-cols-4 w-full gap-4">
          <div className="bg-[#1A1A22] h-auto w-full overflow-hidden shadow-sm sm:rounded-xl col-span-1 flex flex-col">
            <div className="p-7 text-textPurple flex justify">
              <Avatar>
                <AvatarImage src="/" />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="h-auto w-full overflow-hidden shadow-sm  col-span-3 grid grid-cols-1 gap-4">
            <div className="p-7 text-textPurple bg-[#1A1A22] sm:rounded-xl"></div>
            <div className="p-7 text-textPurple bg-[#1A1A22] sm:rounded-xl"></div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
