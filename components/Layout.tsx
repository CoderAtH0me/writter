import FollowBar from "./layout/FollowBar";
import Sidebar from "./layout/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-black relative z-1">
      <div className="container h-full mx-auto xl:px-30 lg:max-w-6xl">
        <div
          className="
                flex 
                flex-row 
                items-start
                justify-center 
                md:justify-start 
                h-full 
                px-1
                lg:px-0
                "
        >
          <Sidebar />
          <div
            className="
            w-full
            min-h-screen
            border-x-[1px]
            border-neutral-800
            "
          >
            {children}
          </div>
          <FollowBar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
