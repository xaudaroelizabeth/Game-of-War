let deckId 
let computerScore = 0
let myScore = 0
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")
let remainingCards



function handleClick() {
     if (remainingCards===0){
                resetGame()
            }
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            deckId = data.deck_id
            console.log(deckId)
        })
       
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", () => {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingCards = data.remaining
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText

            // Trigger confetti when there are no remaining cards
            if (data.remaining === 0) {
                drawCardBtn.disabled = true;
                
                 // Apply heartbreak effect if the computer wins
                if (computerScore > myScore) {
                    header.classList.add("heartbreak");  // Apply heartbreak animation
                    header.textContent = `Better Luck Next Time!`
                    newDeckBtn.textContent = `New Game`
                } else if (myScore > computerScore) {
                    setTimeout(triggerConfetti, 500);  // Slight delay for better visual effect
                    header.textContent = `CASH MONEY, YOU WON!`
                    newDeckBtn.textContent = `New Game`
                } else {
                    header.textContent = `No Winners!`
                    newDeckBtn.textContent = `New Game`
                }
            }
        })
})

/**
 * Challenge:
 * 
 * Display the final winner in the header at the top by
 * replacing the text of the h2.
 */

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        computerScoreEl.textContent = `House: ${computerScore}`
        return randomStatements("computer")
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++
        myScoreEl.textContent = `You: ${myScore}`
        return randomStatements("user")
    } else {
        return "War!"
    }
}

function randomStatements (winner){
    if (winner=== "user"){
        let winningStatement = [ 
            "You win the round!",
            "Victory — for now!",
            "Your card reigns!",
            "You take the battle!",
            `You're unstoppable!`,
            "You crushed it!",
            `You’re on fire!`,
        ]
        const randomIndex = Math.floor(Math.random() * winningStatement.length);
        return winningStatement[randomIndex]
    }else if (winner === "computer"){
        let losingStatement = [
            "Lost this one.",
            "Card goes to them.",
            `They've got the edge!`,
            "Try again!",
            "Oof, not your card!",
            "Tough luck!",
            "They win this round."
        ]
        const randomIndex = Math.floor(Math.random() * losingStatement.length);
        return losingStatement[randomIndex]
    }
}

function resetGame (){
        deckId = undefined
        computerScore = 0
        myScore = 0
        drawCardBtn.disabled = false
        newDeckBtn.textContent = `New Deck`
        computerScoreEl.textContent = `House: 0`
        myScoreEl.textContent = `You: 0 `
        header.textContent = `Game of War`
        cardsContainer.children[0].innerHTML = ``
        cardsContainer.children[1].innerHTML = ``

}


function triggerConfetti() {
    const confettiCount = 50; // Number of confetti pieces
    const container = document.createElement("div");
    container.classList.add("confetti-container");
    document.body.appendChild(container);

    // Generate confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        
        // Randomize position and animation delay for a more natural fall
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(confetti);

        // Remove confetti after animation ends
        setTimeout(() => {
            confetti.remove();
        }, 3000); // Confetti pieces removed after animation ends
    }

    // Optionally remove the container itself after confetti animation
    setTimeout(() => {
        container.remove();
    }, 3000);
}

