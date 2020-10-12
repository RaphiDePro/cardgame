import React, {useEffect, useState} from 'react';
import {NavLink, Route, Switch} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <div className="container-fluid bg-light">
            <div className="page-header">
                <h1>Fuck Your Neighbour <small>With <a href={"https://deckofcardsapi.com/"} target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-secondary">CardAPI</a></small></h1>
            </div>
            <Navigation/>
            <div className="container bg-gradient-primary">
                <Display/>
            </div>
        </div>
    )
        ;
}

function Navigation() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <NavLink exact to="/" className="navbar-brand">Join</NavLink>
            <NavLink exact to="/create" className="navbar-brand">Create</NavLink>
        </nav>
    )
        ;
}

function Display() {
    return (
        <Switch>
            <Route exact path="/" component={Join}/>
            <Route path="/create" component={Create}/>
        </Switch>
    )
        ;
}

function Create() {
    const [deckId, setDeckId] = useState("");
    const [anzPlayers, setAnzPlayers] = useState(3);
    const [player, setPlayer] = useState(-1);
    const [visible, setVisible] = useState("inline-block");
    const [anzCards, setAnzCards] = useState(5);
    const [piles, setPiles] = useState([]);
    const [showPile, setShowPile] = useState(-1);
    const [tip, setTip] = useState(0);
    const [table, setTable] = useState([]);
    const [game, setGame] = useState({state: "shuffle", value: "Starten"})

    useEffect(() => {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(res => res.json())
            .then(result => setDeckId(result.deck_id))
        setAnzCards(5)
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
                        .then(() => {
                            fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player${player}/list`)
                                .then(res => res.json())
                                .then(result => {
                                    let pilesArray = Object.keys(result.piles).map(key => [key, result.piles[key]])
                                    pilesArray = pilesArray.reduce((res, elm) => elm[1], [])
                                    setPiles([...piles, pilesArray.cards])
                                    if (player < anzPlayers) {
                                        setPlayer(player + 1)
                                    } else {
                                        setPlayer(0)
                                        setGame({state: "tip", value: "Ansagen"})
                                    }
                                })

                        })
                })
        }
    }, [player])

    function handleStart() {
        switch (game.state) {
            case "shuffle":
                if (anzPlayers <= 7 && anzPlayers >= 3) {
                    setVisible("none")
                    setPlayer(1)
                }
                break;
            case "tip":
                break;

            default:
                break;

        }
    }

    function playCard(code, pile) {
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player${pile}/draw/?cards=${code}`)
            .then(res => res.json())
            .then(result => {
                let index = piles[pile-1].findIndex(element => result.cards[0].code === element.code);
                if (index > -1) {
                    let piless = piles;
                    piless[pile-1].splice(index, 1);
                    setPiles(piless);
                }
                fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/table/add/?cards=${result.cards[0].code}`)
                    .then(res => res.json())
                    .then(() => {
                        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/table/list`)
                            .then(res => res.json())
                            .then(result => {
                                setTable(result.piles.table.cards)
                            })
                    })
            })
    }

    let imgstyle = {
        width: `${100 / anzCards}%`
    }

    return (
        <div className="container">
            <p>My CardDeck-ID is: {deckId}</p>
            <label style={{display: visible}}>Spieler: </label>
            <input type={"number"} value={anzPlayers} onChange={event => setAnzPlayers(parseInt(event.target.value))}
                   max={6} min={3}
                   style={{display: visible}}/>
            <label style={{display: game.state === "tip" ? "inline-block" : "none"}}>Spieler </label>
            <input type={"number"} value={tip} onChange={event => setTip(parseInt(event.target.value))} min={0}
                   style={{display: game.state === "tip" ? "inline-block" : "none"}}/>
            <button onClick={handleStart}>{game.value}</button>
            {piles.map((pile, index) => (
                    <div key={`Div${index}`}>
                        <button onMouseDown={() => setShowPile(index)} onMouseUp={() => setShowPile(-1)}
                                key={`Button${index}`}>Spieler {index + 1} </button>
                        <ul key={index} style={{display: showPile === index ? "block" : "none"}}>
                            {pile.map(card => (
                                <li key={card.code} style={imgstyle} onClick={playCard.bind(this, card.code, (index + 1))}>
                                    <img
                                        src={card.image} alt={card.code}/></li>
                            ))}
                        </ul>
                    </div>
                )
            )}
            <ul>
                {table.map(card => (
                    <li key={card.code} style={imgstyle}><img src={card.image} alt={card.code}/></li>
                ))}
            </ul>
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
