import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Generate from "./Components/Generate";
import Footer from "./Components/Footer"; 
import Login from "./Components/Login";

export default function App() {
  return (
    <div className="flex flex-col h-screen text-white bg-black px-8 ">
      
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        
        <Route path="/generate" element={<Generate />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />



    </div>
  );
}
