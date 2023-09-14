
import './App.css';
import HomePage from './component/HomePage';
import React, { useState } from 'react'


function App() {
  const [cards, setCards] = useState([
    {
        id: 1,
        title: "koh kong krav",
        description:
          "Koh Kong Krav Beach is in the 5th place out of 13 beaches in the Koh Kong region The beach is located in a natural place, among the mountains. It is partially covered 	   by trees which give natural shade. It is a spacious coastline with crystal turquoise water and white fine sand, so you don't need special shoes.",
        status: "beach",
        peopleGoing: "1537",
      },
      {
        id: 2,
        title: "phnom sampov",
        description:
          " This legendary 100 metres high mountain, topped by Wat Sampeou, contains 3 natural caves, lined with Buddhist shrines and statues: Pkasla, Lakhaon and Aksopheak.",
        status: "mountain",
        peopleGoing: "81000",
      },
      {
        id: 3,
        title: "kirirom",
        description:
          "Kirirom National Park, a high altitude plateau, is known for its unique high elevation pine forest, which forms the headwaters for numerous streams feeding Kampong 	   	   Speu Town.",
        status: "forest",
        peopleGoing: "2500",
      },

])
  return (
    <div className="App">
      <HomePage cards = {cards} setCards = {setCards} />
    </div>
  );
}

export default App;
