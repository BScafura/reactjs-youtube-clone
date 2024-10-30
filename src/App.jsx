import { useState } from "react";
import Navbar from "../src/components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home/Home";
import Video from "../src/pages/Video/Video";

const App = () => {
  const [sidebar, setSideBar] = useState(true);

  return (
    <div>
      <Navbar setSideBar={setSideBar}></Navbar>
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar}></Home>}></Route>
        <Route
          path="/video/:categoryId/:videoId"
          element={<Video></Video>}
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
