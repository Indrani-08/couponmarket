import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import confetti from "canvas-confetti";
import ScratchCard from "./ScratchCard";
import { setScopedNumber } from "../utils/userScopedStorage";
import "./RewardsPage.css";

const WIN_REWARDS = [
    { title: "LUCKY DROP", amount: 5, icon: "💵" },
    { title: "LUCKY DROP", amount: 10, icon: "💵" }
];

const LOSE_REWARD = { title: "BETTER LUCK NEXT TIME", amount: 0, icon: "🤞" };

function RewardsPage() {
    const navigate = useNavigate();
    const [scratchCards, setScratchCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        checkLockout();
        const storedCards = JSON.parse(localStorage.getItem("dailyCards"));
        const storedSelected = localStorage.getItem("selectedCardId");

        if (!storedCards || storedCards.length !== 3) {
            generateNewCards();
        } else {
            setScratchCards(storedCards);
            if (storedSelected) setSelectedCardId(parseInt(storedSelected, 10));
        }

        const interval = setInterval(checkLockout, 1000);
        return () => clearInterval(interval);
    }, []);

    const checkLockout = () => {
        const lastPlay = localStorage.getItem("lastRewardPlayTime");
        if (!lastPlay) {
            setIsLocked(false);
            setTimeRemaining("");
            return;
        }

        const nextPlayDate = new Date(parseInt(lastPlay, 10) + 24 * 60 * 60 * 1000);
        const now = new Date();

        if (now < nextPlayDate) {
            setIsLocked(true);
            const diff = nextPlayDate - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeRemaining(`${hours}h ${mins}m ${secs}s`);
        } else {
            // Unlocking logic: if timer expired, reset everything
            generateNewCards();
            setIsLocked(false);
            setTimeRemaining("");
            setMessage("");
            localStorage.removeItem("lastRewardPlayTime");
            localStorage.removeItem("selectedCardId");
            setSelectedCardId(null);
        }
    };

    const generateNewCards = () => {
        const winReward = WIN_REWARDS[Math.floor(Math.random() * WIN_REWARDS.length)];
        const cards = [
            { id: 1, reward: LOSE_REWARD, isScratched: false },
            { id: 2, reward: LOSE_REWARD, isScratched: false },
            { id: 3, reward: winReward, isScratched: false }
        ];

        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        setScratchCards(cards);
        localStorage.setItem("dailyCards", JSON.stringify(cards));
    };

    const handleCardSelection = (cardId) => {
        if (isLocked || selectedCardId) return;
        setSelectedCardId(cardId);
        localStorage.setItem("selectedCardId", cardId.toString());
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const handleReveal = (cardId, reward) => {
        if (isLocked) return;

        const updatedCards = scratchCards.map(c => ({ ...c, isScratched: true }));

        setScratchCards(updatedCards);
        localStorage.setItem("dailyCards", JSON.stringify(updatedCards));

        if (reward.amount > 0) {
            // Call backend to claim reward
            api.post("/rewards/claim", { rewardAmount: reward.amount })
                .then(res => {
                    const newBal = res.data.walletBalance;
                    setScopedNumber("walletBalance", newBal);
                    window.dispatchEvent(new Event("walletUpdated"));
                    setMessage(`✨ SUCCESS! ₹${reward.amount} ADDED TO WALLET ✨`);
                    triggerConfetti();
                })
                .catch(err => {
                    console.error("Error claiming reward:", err);
                    setMessage("Error claiming reward. Please try again.");
                });
        } else {
            setMessage("Better luck tomorrow!");
        }

        setTimeout(() => {
            localStorage.setItem("lastRewardPlayTime", Date.now().toString());
            setSelectedCardId(null);
            localStorage.removeItem("selectedCardId");
            checkLockout();
        }, 3500);
    };

    return (
        <div className="rewards-page">
            <div className="page-header">
                <h1>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', marginRight: '10px' }}>
                        <defs>
                            <linearGradient id="rewardGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#6c63ff" />
                                <stop offset="1" stopColor="#43c6ac" />
                            </linearGradient>
                        </defs>
                        <rect x="2" y="7" width="20" height="15" rx="2" fill="url(#rewardGrad)" />
                        <path d="M12 2C10.3 2 9 3.3 9 5C9 3.3 7.7 2 6 2C4.3 2 3 3.3 3 5C3 6.7 4.3 8 6 8H18C19.7 8 21 6.7 21 5C21 3.3 19.7 2 18 2C16.3 2 15 3.3 15 5C15 3.3 13.7 2 12 2Z" fill="url(#rewardGrad)" />
                        <rect x="11" y="7" width="2" height="15" fill="rgba(255,255,255,0.5)" />
                        <path d="M7 13h3v4H7z" fill="white" fillOpacity="0.7" rx="1" />
                    </svg>
                    Daily Rewards
                </h1>
                <p>Pick one card daily to unlock elite cashback rewards.</p>
            </div>

            {selectedCardId && !isLocked && <div className="focus-backdrop"></div>}

            {message && (
                <div className={`reward-message ${message.includes("won") || message.includes("Won") || message.includes("✨") ? "win" : "lose"}`}>
                    {message}
                </div>
            )}

            {isLocked && (
                <div className="lockout-alert">
                    <h3>🕒 {timeRemaining}</h3>
                    <p>Come back later for your next daily reward.</p>
                </div>
            )}

            <div className={`rewards-container ${selectedCardId && !isLocked ? 'has-selection' : ''} ${isLocked ? 'locked-view' : ''}`}>
                {scratchCards.map((card) => {
                    const isSelected = selectedCardId === card.id;
                    // During scratch flow, hide unselected. When locked, show all.
                    if (selectedCardId && !isSelected && !isLocked) return null;

                    return (
                        <div key={card.id}
                            className={`reward-item ${!isLocked && isSelected ? 'focused' : (isLocked ? 'result' : 'floating clickable')}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                // Once a card is selected, it's final — cannot deselect or change
                                if (!selectedCardId && !isLocked) {
                                    handleCardSelection(card.id);
                                }
                            }}>
                            <ScratchCard
                                initialScratched={card.isScratched || isLocked}
                                canScratch={!!selectedCardId && !isLocked && isSelected}
                                rewardImg={
                                    <div className="inner-reward">
                                        <span className="reward-icon">{card.reward.icon}</span>
                                        <p className="reward-title">{card.reward.title}</p>
                                        <p className="reward-subtitle">
                                            {card.reward.amount > 0 ? `₹${card.reward.amount}` : ""}
                                        </p>
                                        {card.reward.amount > 0 && (
                                            <div className="won-badge">ADDED TO WALLET</div>
                                        )}
                                    </div>
                                }
                                onComplete={() => handleReveal(card.id, card.reward)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RewardsPage;
