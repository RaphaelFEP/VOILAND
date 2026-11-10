import { renderToStaticMarkup } from "react-dom/server";

import { MascotSober } from "@/components/mascot/mascot-sober";
import { MascotSvg } from "@/components/mascot/mascot-svg";

const out = {
  current: renderToStaticMarkup(<MascotSvg className="bot" wave={false} />),
  sober: renderToStaticMarkup(<MascotSober className="bot" />),
};
process.stdout.write(JSON.stringify(out));
