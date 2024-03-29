import { Provider } from 'react-redux'
import '../styles/globals.css';
import store from '../stores';
import Layout from '../layout';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { SessionProvider, useSession } from "next-auth/react"
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";




 
function MyApp({ Component, pageProps }) {


  return (
    <SessionProvider
      session={pageProps.session}>
      <SSRProvider>
        <Provider store={store}>
          {Component.CheckoutHeader ? (
            <Component.CheckoutHeader>
              <Component {...pageProps} />
            </Component.CheckoutHeader>
          ) : (
            <Layout>
              {Component.PageLayout ? (
                <Component.PageLayout>
                  <Component {...pageProps} />
                </Component.PageLayout>
              ) : (
                <Component {...pageProps} />
              )}
            </Layout>
          )}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            pauseOnVisibilityChange
            closeOnClick
            pauseOnHover
          />
        </Provider>
      </SSRProvider>
    </SessionProvider>
  );


}

export default MyApp;
