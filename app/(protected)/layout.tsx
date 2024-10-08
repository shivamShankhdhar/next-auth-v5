import { Navbar } from "./_components/Navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-6 py-[50px] items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to blue-800">
      <Navbar />
      {children}
    </div>
  );
};
export default ProtectedLayout;
