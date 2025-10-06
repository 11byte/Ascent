import NavbarWrapper from "../../components/navbar/Navbar-Wrapper";
import { Phase2Provider } from "../../context/phase2Context";
export default function Phase4Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavbarWrapper
        phaseNo={4}
        username="Paresh"
        points={7777}
        triangle={true}
        tBorder={{
          light: "#F3F3E0",
          dark: "#F3F3E0",
        }}
        tColor={{
          dark: "#183B4E",
          light: "#183B4E",
        }}
        tDepthColor={{
          dark: "#DDA853",
          light: "#DDA853",
        }}
      />
      <Phase2Provider value={{ username: "Paresh" }}>{children}</Phase2Provider>
    </div>
  );
}
