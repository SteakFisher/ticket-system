import logoTall from "../../../public/KreivaXAlfaazLogo_tall.png";
import Image from "next/image";

export default function Loading() {
  return (
    <div
      style={
        {
          position: "absolute",
          bottom: 0,
          top: 0,
          height: "120px",
          width: "88px",
          left: 0,
          right: 0,
          margin: "auto",
        }
      }
    >
      <div
        className="loader"
        style={{ display: "block" }}
      ></div>
      <Image src={logoTall} alt="logo" height="120"/>
    </div>
  )
}