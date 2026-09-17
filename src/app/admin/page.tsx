import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-32 pb-20">
        <div className="container mx-auto px-4 w-full max-w-md">
          <AdminLoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
