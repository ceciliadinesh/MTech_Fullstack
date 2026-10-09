
const platformName = "BidLive";

let liveBidders = 128;

const platformActive = true;

const auctions = [
    {
        id: 1,
        title: "Vintage Camera",
        category: "Photography",
        description: "Classic 35mm film camera in excellent condition.",
        image: "images/camera.jpg",
        price: 12500,
        endTime: Date.now() + 1000 * 60 * 15,
        bids: [
            { user: "Rahul", amount: 12500 },
            { user: "Priya", amount: 11800 }
        ]
    },

    {
        id: 2,
        title: "Luxury Wristwatch",
        category: "Fashion",
        description: "Elegant automatic wristwatch with premium finishing.",
        image: "images/watch.jpg",
        price: 45000,
        endTime: Date.now() + 1000 * 60 * 22,
        bids: [
            { user: "Amit", amount: 45000 },
            { user: "Neha", amount: 43000 }
        ]
    },

    {
        id: 3,
        title: "Modern Art Painting",
        category: "Art",
        description: "Original abstract artwork by an emerging artist.",
        image: "images/painting.jpg",
        price: 28000,
        endTime: Date.now() + 1000 * 60 * 30,
        bids: [
            { user: "Arjun", amount: 28000 },
            { user: "Sneha", amount: 26000 }
        ]
    },

    {
        id: 4,
        title: "Acoustic Guitar",
        category: "Music",
        description: "Handcrafted acoustic guitar with warm natural tone.",
        image: "images/guitar.jpg",
        price: 18500,
        endTime: Date.now() + 1000 * 60 * 37,
        bids: [
            { user: "Vikram", amount: 18500 },
            { user: "Riya", amount: 17000 }
        ]
    },

    {
        id: 5,
        title: "Classic Motorcycle",
        category: "Automobile",
        description: "Beautifully restored classic motorcycle.",
        image: "images/motorcycle.jpg",
        price: 95000,
        endTime: Date.now() + 1000 * 60 * 45,
        bids: [
            { user: "Karan", amount: 95000 },
            { user: "Dev", amount: 92000 }
        ]
    },

    {
        id: 6,
        title: "Designer Chair",
        category: "Furniture",
        description: "Minimalist designer lounge chair for modern interiors.",
        image: "images/chair.jpg",
        price: 22000,
        endTime: Date.now() + 1000 * 60 * 52,
        bids: [
            { user: "Meera", amount: 22000 },
            { user: "Anil", amount: 20500 }
        ]
    }
];



const auctionGrid = document.getElementById("auctionGrid");
const searchInput = document.getElementById("searchInput");

const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalTimer = document.getElementById("modalTimer");

const bidForm = document.getElementById("bidForm");
const bidInput = document.getElementById("bidInput");
const bidHistory = document.getElementById("bidHistory");
const bidMessage = document.getElementById("bidMessage");

const toast = document.getElementById("toast");

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

const liveBiddersElement = document.getElementById("liveBidders");



let selectedAuctionId = null;



function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}


function getRemainingTime(endTime) {

    const difference = endTime - Date.now();

    if (difference <= 0) {
        return {
            expired: true,
            text: "Ended"
        };
    }

    const seconds = Math.floor(difference / 1000);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
        expired: false,
        text:
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
    };
}


function renderAuctions(list = auctions) {

    auctionGrid.innerHTML = "";

    if (list.length === 0) {

        auctionGrid.innerHTML = `
            <p style="grid-column: 1/-1; text-align:center;">
                No auctions found.
            </p>
        `;

        return;
    }

    list.forEach(auction => {

        const time = getRemainingTime(auction.endTime);

        const card = document.createElement("article");

        card.className = "auction-card";

        card.innerHTML = `
            <img
                class="auction-image"
                src="${auction.image}"
                alt="${auction.title}"
            >

            <div class="card-body">

                <div class="card-top">
                    <span class="live-label">
                        ${time.expired ? "ENDED" : "● LIVE"}
                    </span>

                    <span class="category">
                        ${auction.category}
                    </span>
                </div>

                <h3>${auction.title}</h3>

                <p class="card-description">
                    ${auction.description}
                </p>

                <div class="card-bottom">

                    <div>
                        <span class="price-label">
                            CURRENT BID
                        </span>

                        <span class="price">
                            ${formatCurrency(auction.price)}
                        </span>
                    </div>

                    <span
                        class="timer"
                        data-timer-id="${auction.id}"
                    >
                        ${time.text}
                    </span>

                </div>

                <button
                    class="primary-btn bid-btn"
                    data-auction-id="${auction.id}"
                    ${time.expired ? "disabled" : ""}
                >
                    ${time.expired ? "Auction Ended" : "Place Bid"}
                </button>

            </div>
        `;

        auctionGrid.appendChild(card);
    });
}




auctionGrid.addEventListener("click", function(event) {

    if (event.target.classList.contains("bid-btn")) {

        const id = Number(event.target.dataset.auctionId);

        openAuction(id);
    }
});



function openAuction(id) {

    const auction = auctions.find(item => item.id === id);

    if (!auction) {
        return;
    }

    const time = getRemainingTime(auction.endTime);

    if (time.expired) {
        showToast("This auction has ended.");
        return;
    }

    selectedAuctionId = id;

    modalImage.src = auction.image;
    modalTitle.textContent = auction.title;
    modalDescription.textContent = auction.description;
    modalPrice.textContent = formatCurrency(auction.price);

    bidInput.value = "";
    bidInput.min = auction.price + 1;

    bidMessage.textContent = "";
    bidMessage.className = "message";

    renderBidHistory(auction);

    modalOverlay.classList.add("active");
}



closeModal.addEventListener("click", closeAuction);

modalOverlay.addEventListener("click", function(event) {

    if (event.target === modalOverlay) {
        closeAuction();
    }
});

function closeAuction() {

    modalOverlay.classList.remove("active");

    selectedAuctionId = null;
}



function renderBidHistory(auction) {

    bidHistory.innerHTML = "";

    auction.bids.slice(0, 5).forEach(bid => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${bid.user}</span>
            <strong>${formatCurrency(bid.amount)}</strong>
        `;

        bidHistory.appendChild(li);
    });
}



bidForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (selectedAuctionId === null) {
        return;
    }

    const auction = auctions.find(
        item => item.id === selectedAuctionId
    );

    const enteredBid = Number(bidInput.value);

    const time = getRemainingTime(auction.endTime);

    if (time.expired) {

        showBidMessage(
            "This auction has already ended.",
            "error"
        );

        return;
    }

    if (!enteredBid || enteredBid <= auction.price) {

        showBidMessage(
            `Your bid must be higher than ${formatCurrency(auction.price)}.`,
            "error"
        );

        return;
    }



    const createBidder = function(name) {

        let bidderName = name;

        return function(amount) {

            return {
                user: bidderName,
                amount: amount
            };
        };
    };


    const createUserBid = createBidder("You");

    const newBid = createUserBid(enteredBid);


    auction.bids.unshift(newBid);

    auction.price = enteredBid;

    modalPrice.textContent = formatCurrency(auction.price);

    bidInput.min = auction.price + 1;

    renderBidHistory(auction);

    renderAuctions();

    showBidMessage(
        `Success! You are now the highest bidder at ${formatCurrency(enteredBid)}.`,
        "success"
    );

    showToast(" Bid placed successfully!");
});


function showBidMessage(message, type) {


    bidMessage.textContent = message;

    bidMessage.className = `message ${type}`;
}



searchInput.addEventListener("input", function(event) {

    const searchTerm = event.target.value.toLowerCase();

    const filteredAuctions = auctions.filter(auction => {

        return (
            auction.title.toLowerCase().includes(searchTerm) ||
            auction.category.toLowerCase().includes(searchTerm)
        );
    });

    renderAuctions(filteredAuctions);
});



function updateTimers() {

    document.querySelectorAll("[data-timer-id]")
        .forEach(timerElement => {

            const id = Number(
                timerElement.dataset.timerId
            );

            const auction = auctions.find(
                item => item.id === id
            );

            if (!auction) {
                return;
            }

            const time = getRemainingTime(
                auction.endTime
            );

            timerElement.textContent = time.text;

            if (time.expired) {

                timerElement.style.color = "#777486";

                const button = timerElement
                    .closest(".auction-card")
                    .querySelector(".bid-btn");

                button.disabled = true;
                button.textContent = "Auction Ended";
            }
        });

    if (selectedAuctionId !== null) {

        const auction = auctions.find(
            item => item.id === selectedAuctionId
        );

        if (auction) {

            const time = getRemainingTime(
                auction.endTime
            );

            modalTimer.textContent = time.text;

            if (time.expired) {

                bidInput.disabled = true;
                bidForm.querySelector("button").disabled = true;

                showBidMessage(
                    "Auction ended.",
                    "error"
                );
            }
        }
    }
}




function updateLiveBidders() {

    const change =
        Math.floor(Math.random() * 7) - 3;

    liveBidders = Math.max(
        80,
        liveBidders + change
    );

    liveBiddersElement.textContent =
        liveBidders;
}



function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}



menuBtn.addEventListener("click", function() {

    navMenu.classList.toggle("active");
});



renderAuctions();

setInterval(updateTimers, 1000);

setInterval(updateLiveBidders, 4000);