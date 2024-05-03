document.addEventListener("DOMContentLoaded", function() {
    const quoteList = document.getElementById("quote-cards");
    const newQuoteForm = document.getElementById("new-quote-form");
  
    // Function to fetch and display quotes
    const fetchAndDisplayQuotes = async () => {
      const response = await fetch("http://localhost:3000/quotes?_embed=likes");
      const quotes = await response.json();
  
      quoteList.innerHTML = ""; // Clear previous quotes
  
      quotes.forEach(quote => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "quote-card");
        listItem.innerHTML = `
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn btn-success like-btn'>Likes: <span>${quote.likes.length}</span></button>
            <button class='btn btn-danger delete-btn'>Delete</button>
          </blockquote>
        `;
        const likeBtn = listItem.querySelector(".like-btn");
        const deleteBtn = listItem.querySelector(".delete-btn");
  
        likeBtn.addEventListener("click", () => likeQuote(quote));
        deleteBtn.addEventListener("click", () => deleteQuote(quote));
  
        quoteList.appendChild(listItem);
      });
    };
  
    // Function to add a new quote
    const addQuote = async (quote, author) => {
      const response = await fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ quote, author, likes: [] })
      });
      await fetchAndDisplayQuotes();
    };
  
    // Function to like a quote
    const likeQuote = async (quote) => {
      const response = await fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ quoteId: quote.id })
      });
      await fetchAndDisplayQuotes();
    };
  
    // Function to delete a quote
    const deleteQuote = async (quote) => {
      const response = await fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE"
      });
      await fetchAndDisplayQuotes();
    };
  
    // Event listener for new quote form submission
    newQuoteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const quote = document.getElementById("quote").value;
      const author = document.getElementById("author").value;
      if (quote && author) {
        await addQuote(quote, author);
        newQuoteForm.reset();
      } else {
        alert("Please enter both the quote and author.");
      }
    });
  
    // Fetch and display quotes on page load
    fetchAndDisplayQuotes();
  });