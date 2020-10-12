const CardsAPI = {
    deckId: "",
    players: [],

    generatePile: function (player, anzCards) {
        fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${anzCards}`)
            .then(res => res.json())
            .then(result => {
                let cards = result.cards;
                let cardsCodes = cards.map(card => (card.code))
                let cardsString = cardsCodes.join(',')
                fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/pile/player${player}/add/?cards=${cardsString}`)
                    .then(res => res.json())
                    .then(result => {
                        fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/pile/player${player}/list`)
                            .then(res => res.json())
                            .then(result => {
                                console.log(result)
                            })
                    })
            })
    }
}
export default CardsAPI