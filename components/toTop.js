import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ToTop({ scrollTargetElementRef }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      scrollTargetElementRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
  }, []);

  return "";
}
