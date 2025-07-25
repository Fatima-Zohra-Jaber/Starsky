import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Generate from "./Components/Generate";
import Footer from "./Components/Footer"; 
import Login from "./Components/Login";

export default function App() {
  return (
    <div className="flex flex-col h-screen text-white bg-black">
      
      <Header />
      <main className="flex-grow overflow-hidden">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />

    </div>
  );
}
