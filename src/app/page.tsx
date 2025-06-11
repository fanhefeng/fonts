import { myFonts } from "@/fonts";
import MyFont from "@/components/ui/MyFont";

export default function Home() {
	return (
		<>
			<h1 className="text-3xl">Fonts</h1>
    {myFonts.map(font => {
      return <MyFont key={font.className} font={font} />
    })}
		</>
	);
}
