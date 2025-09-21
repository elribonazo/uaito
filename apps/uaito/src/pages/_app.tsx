import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux";

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
        <Component {...props} />
    </Provider>
    </SessionProvider>
  )
}



export default App
