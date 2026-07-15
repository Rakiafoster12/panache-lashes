import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { Head } from "./components/Head";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={Services} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/policies"} component={Policies} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <Head />
      <ScrollToTop />
      <Router />
    </ErrorBoundary>
  );
}

export default App;
