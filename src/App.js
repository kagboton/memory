import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
import HallOfFame, { FAKE_HOF } from './HallOfFame'


const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'

class App extends Component {

    //initialisation de mon état local
    state = {
        cards: this.generateCards(),
        guesses: 0,
        currentPair: [],
        matchedCardIndices: [],
    }


    generateCards() {
        const result = []
        const size = SIDE * SIDE
        const candidates = shuffle(SYMBOLS)
        while (result.length < size) {
            const card = candidates.pop()
            result.push(card, card)
        }
        return shuffle(result)
    }

    getFeedbackForCard(index){ //prend la position d'une carte et décide de la valeur de feedback a utiliser pour cette carte
        const { currentPair, matchedCardIndices } = this.state
        const indexMatched = matchedCardIndices.includes(index)

        if (currentPair.length < 2) {
            return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
        }

        if (currentPair.includes(index)) {
            return indexMatched ? 'justMatched' : 'justMismatched'
        }

        return indexMatched ? 'visible' : 'hidden'
    }


    //Arrow fx for binding (pour faire référence au bon le this)
    handleCardClick = index => {
        const { currentPair } = this.state

        if (currentPair.length === 2) {
            return
        }

        if (currentPair.length === 0) {
            this.setState({ currentPair: [index] })
            return
        }

        this.handleNewPairClosedBy(index)
    }

    render() {

        const { cards, guesses, matchedCardIndices } = this.state //utilisation de l'état local. j'utilise les variables qui m'interessent en déstructurant l'etat local
        const won = matchedCardIndices.length === cards.length // on gagne quand le nbre de card trouvé est égale au nbre présent dans le jeu
        return (
            <div className="memory">
                <GuessCount guesses={guesses} />
                {cards.map((card, index) => (
                    <Card
                        card={card}
                        feedback={this.getFeedbackForCard(index)} //ici on a pas déclarer la fonction en mode binding comme handleCardClick
                        key={index} //on récupère tjrs l'index dans key
                        index={index} //on récupère l'index pour l'utiliser sur onClick dans Card
                        onClick={this.handleCardClick}
                    />
                ))}
                {won && <HallOfFame entries={FAKE_HOF} />}
            </div>
        )
    }
}

export default App