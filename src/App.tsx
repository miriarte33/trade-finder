import { AuthProvider } from "@/contexts/AuthContext";
import { LeaguesProvider } from "@/contexts/LeaguesContext";
import { AppRouter } from "@/components/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <LeaguesProvider>
        <AppRouter />
      </LeaguesProvider>
    </AuthProvider>
  );
}