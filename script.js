const quoteContainer = document.getElementById('quote');
const quoteText= document.getElementById('quote-content');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

let errorLimit = 0;

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner(){
    if (!loader.hidden){
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get quote from Forismatic API
async function getQuote(){
    showLoadingSpinner();
    // We're using a proxy URL to get around the CORS issue.
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(`${proxyUrl}${apiUrl}`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        // If author is blank, add 'Unknown' placeholder
        if(data.quoteAuthor === ''){
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // Reduce font size for long quotes
        if (data.quoteText.length > 120){
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        // Stop loader, show quote
        removeLoadingSpinner();
    } catch (error) {
        if(errorLimit < 3){
            errorLimit++;
            console.log(`Quote loading failed ${errorLimit} time(s)`, error);
            getQuote();
        } else {
            console.log('Quote loading failed for good', error);
        }
    }
}

// Tweet quote
function tweetQuote(){
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

// Event listeners - any time buttons are clicked, functions are run
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On load
getQuote();