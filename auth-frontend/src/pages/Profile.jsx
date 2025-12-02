import { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("profile/")
      .then(res => setData(res.data))
      .catch(() => alert("Not authorized!"));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Profile</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
