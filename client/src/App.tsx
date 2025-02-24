import React from "react";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { Routers } from "./routes";
import { FolderProvider } from "./context/FolderContext";

const App: React.FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <FolderProvider>
          <Routers />
        </FolderProvider>
      </Provider>
    </div>
  );
};

export default App;
