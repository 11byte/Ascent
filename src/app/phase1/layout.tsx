import NavbarWrapper from "../../components/navbar/Navbar-Wrapper";
import { Phase2Provider } from "../../context/phase2Context";

export default function Phase2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavbarWrapper
        phaseNo={1}
        username="Paresh"
        points={7777}
        triangle={true}
        tBorder={{
          light: "#77BEF0",
          dark: "#77BEF0",
        }}
        tColor={{
          dark: "#FFCB61",
          light: "#FFCB61",
        }}
        tDepthColor={{
          dark: "#EA5B6F",
          light: "#EA5B6F",
        }}
      />
      <Phase2Provider value={{ username: "Paresh" }}>{children}</Phase2Provider>
    </div>
  );
}
