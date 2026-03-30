import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

import Home from "@/pages/Home";
import { Login, Register } from "@/pages/Auth";
import CreatePost from "@/pages/CreatePost";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import { useUser } from "@/hooks/use-auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, path }: { component: any; path: string }) {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <Component />;
}

function Router() {
  const [location] = useLocation();
  const { data: user, isLoading } = useUser();

  // Redirect to login if not authenticated and trying to access root
  useEffect(() => {
    if (!isLoading && !user && location === "/") {
      // This will be handled by the Switch below
    }
  }, [user, isLoading, location]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route
        path="/"
        component={() => {
          if (isLoading) {
            return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
          }
          if (!user) {
            return <Login />;
          }
          return <Home />;
        }}
      />
      <Route
        path="/create-post"
        component={() => {
          if (isLoading) {
            return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
          }
          if (!user) {
            return <Login />;
          }
          return <CreatePost />;
        }}
      />
      <Route
        path="/admin"
        component={() => {
          if (isLoading) {
            return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
          }
          if (!user) {
            return <Login />;
          }
          return <Admin />;
        }}
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
