import NavbarWrapper from "../../components/navbar/Navbar-Wrapper";
import { Phase2Provider } from "../../context/phase2Context";
import Phase4NavbarClient from "../../components/navbar/Phase4Navbar.client";
export default function Phase4Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Phase4NavbarClient />
      <Phase2Provider value={{ username: "Paresh" }}>{children}</Phase2Provider>
    </div>
  );
}
