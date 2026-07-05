import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  role: "customer" | "seller" | "admin" | "delivery";
};

export default function ProtectedRoute({ children, role }: Props) {
  const location = useLocation();

  const user = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (user !== role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <>{children}</>;
}
