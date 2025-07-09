import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Generate from "./Components/Generate";
import Footer from "./Components/Footer"; 

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col text-white bg-black px-8 ">
      
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
      <Footer />



    </div>
  );
}
