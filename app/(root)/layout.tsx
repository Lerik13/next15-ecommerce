import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1 wrapper">
				{children}
			</main>
			<Footer />
	 </div>
  );
}