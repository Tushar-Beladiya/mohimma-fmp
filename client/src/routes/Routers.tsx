import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages";
import { FoldersPage } from "../pages/Folders";

export const Routers = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/folder" element={<FoldersPage />} />
        </Routes>
      </Router>
    </div>
  );
};
