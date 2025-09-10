import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux";

import '../app/globals.css'
import { wrapper } from "@/redux/store";

function App({
  Component,
  ...rest
}:any) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <SessionProvider session={props.session}>
        <Component {...props} />
      </SessionProvider>
    </Provider>
  )
}


export default App
