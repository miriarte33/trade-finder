import { AuthProvider } from "@/contexts/AuthContext";
import { LeaguesProvider } from "@/contexts/LeaguesContext";
import { TradeSelectionProvider } from "@/contexts/TradeSelectionContext";
import { AppRouter } from "@/components/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <LeaguesProvider>
        <TradeSelectionProvider>
          <AppRouter />
        </TradeSelectionProvider>
      </LeaguesProvider>
    </AuthProvider>
  );
}