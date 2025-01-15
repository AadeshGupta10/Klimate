import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import { ThemeProvider } from "./context/ThemeProvider"
import WeatherDashboard from "./pages/WeatherDashboard"
import CityPage from "./pages/CityPage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

const App = () => {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, //5 Minutes,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <Layout>
            <Routes>
              <Route path="/" element={<WeatherDashboard />} />
              <Route path="/city/:city" element={<CityPage />} />
            </Routes>
          </Layout>
          <Toaster richColors />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App