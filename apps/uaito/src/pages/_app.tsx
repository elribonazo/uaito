import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

import '../app/globals.css'
import { wrapper } from "@/redux/store";
import { GetServerSideProps } from "next";

function App({
  Component,
  ...rest
}:any) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <SessionProvider session={props.pageProps.session}>
    <Provider store={store}>
        <PersistGate persistor={(store as any).__persistor} loading={null}>
            <Component {...props.pageProps} />
        </PersistGate>
    </Provider>
    </SessionProvider>
  )
}



export default App
