import { useEffect } from "react";

export default function home() {
  useEffect(() => {
    window.location.replace("./shop");
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}