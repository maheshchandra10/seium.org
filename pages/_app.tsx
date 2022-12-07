import { AuthProvider } from "@context/Auth";
import Header from "@components/utils/Header";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
