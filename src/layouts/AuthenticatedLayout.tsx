import { Outlet } from 'react-router-dom';
// import { Navbar, Sidebar, Footer } from '@/components/layout';
import SidebarLayout from '@/components/common/sidebar/sidebar-layout';

export const AuthenticatedLayout = () => {

    return (
    <div className="flex">
      <SidebarLayout/>

      {/* This must be a single child */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
  // return (
  //   <div className="flex h-screen bg-gray-100">
  //     {/* Sidebar */}
  //     <Sidebar />

  //     {/* Main Content Area */}
  //     <div className="flex-1 flex flex-col overflow-hidden">
  //       {/* Navbar */}
  //       <Navbar />

  //       {/* Main Content */}
  //       <main className="flex-1 overflow-y-auto bg-gray-100">
  //         <div className="p-6">
  //           <Outlet />
  //         </div>
  //       </main>

  //       {/* Footer */}
  //       <Footer />
  //     </div>
  //   </div>
  // );
};