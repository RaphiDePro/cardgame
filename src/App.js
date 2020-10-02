import React, { useEffect, useState } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import './App.css';

function App() {
  const [deckId, setDeckId] = useState("");
  const [anzPlayers, setAnzPlayers] = useState(3);
  const [player, setPlayer] = useState(-1);
  const [visible, setVisible] = useState("inline-block");
  const [anzCards, setAnzCards] = useState(5);
  const [game, setGame] = useState({ state: "shuffle", value: "Starten" })

  useEffect(() => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json())
      .then(result => setDeckId(result.deck_id))
  }, [])


  useEffect(() => {
    if (player > 0) {
      fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${anzCards}`)
        .then(res => res.json())
        .then(result => {
          let cards = result.cards;
          let cardsCodes = cards.map(card => (card.code))
          let cardsString = cardsCodes.join(',')
          fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player${player}/add/?cards=${cardsString}`)
            .then(res => res.json())
            .then(result => {
              console.log(result)
              if (player < anzPlayers) {
                setPlayer(player + 1)
              } else {
                setPlayer(0)
                setGame({ state: "tip", value: "Ansagen" })
              }
            })
        })
    }
  }, [player])

  function changePlayer(event) {
    setAnzPlayers(event.target.value);
  }

  function handleStart() {
    switch (game.state) {
      case "shuffle":
        if (anzPlayers <= 6 && anzPlayers >= 3) {
          setVisible("none")
          setPlayer(1)
        }
        break;
      case "tip":
        break;

    }
  }

  return (
    <div className="App">
      <nav>
        <NavLink exact to={"/"}></NavLink>
        <NavLink exact to={"/create"}></NavLink>
      </nav>
      <Switch>
        <Route exact path={"/"} component={Join} />
        <Route path={"/create"} component={Create} />
      </Switch>
      <p>My CardDeck-ID is: {deckId}</p>
      <input type={"number"} value={anzPlayers} onChange={changePlayer} max={5} min={3} style={{ display: visible }} />
      <button onClick={handleStart}>{game.value}</button>
    </div >
  );
}

function Create() {
  return (
    <div className="container">

    </div>
  )
}

function Join() {

  return (
    <div className="container">

    </div>
  )
}


export default App;
