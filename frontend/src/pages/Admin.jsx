import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useEffect, useState } from "react";

export default function Admin() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      api.get("/admin/analytics").then((res) => {
        setData(res.data);
      });
    }
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {data && (
        <ul className="space-y-2">
          <li>Total Users: {data.total_users}</li>
          <li>Total Topics: {data.total_topics}</li>
          <li>Total Orders: {data.total_orders}</li>
          <li>Total Revenue: ₹{data.total_revenue}</li>
        </ul>
      )}
    </div>
  );
}
