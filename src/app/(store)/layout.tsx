import { Header } from "@/components/header";
import { StoreProvider } from "@/components/store-provider";
import { Toaster } from "@/components/ui/sonner";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <main className="min-h-screen">
        <Header />
        {children}
        <Toaster />
      </main>
    </StoreProvider>
  );
};

export default StoreLayout;
