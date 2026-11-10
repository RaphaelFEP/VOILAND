/* eslint-disable @next/next/no-img-element */
import type { ImgHTMLAttributes } from "react";
export default function Image({ priority: _p, ...props }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) {
  void _p;
  const src = typeof props.src === "string" ? props.src.replace(/^\//, "") : props.src;
  return <img alt="" {...props} src={src} />;
}
