"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type IntakeStep = 0 | 1 | 2 | 3;

const initialMessages: Message[] = [
  {
    id: 0,
    role: "assistant",
    text: "Hi! I can help you get started with a cake plan. Let's begin with your event.",
  },
  {
    id: 1,
    role: "assistant",
    text: "What kind of event are you planning?",
  },
];

const assistantQuestions = [
  "About how many guests will be there?",
  "What's your cake budget in MXN?",
];

function formatMxBudget(value: number) {
  return `MXN $${value.toLocaleString("en-MX", {
    maximumFractionDigits: 2,
  })}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [step, setStep] = useState<IntakeStep>(0);
  const [eventType, setEventType] = useState("");
  const [customEventType, setCustomEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  function addMessage(role: Message["role"], text: string) {
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: currentMessages.length, role, text },
    ]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (step === 0) {
      const eventLabel = eventType === "Other" ? customEventType.trim() : eventType;
      if (!eventLabel) {
        setError(eventType === "Other" ? "Tell us what kind of event you're planning." : "Choose an event type to continue.");
        return;
      }

      if (eventLabel.length > 80) {
        setError("Keep the event type under 80 characters.");
        return;
      }

      addMessage("user", eventLabel);
      addMessage("assistant", assistantQuestions[0]);
      setStep(1);
      return;
    }

    if (step === 1) {
      const count = Number(guestCount);
      if (!guestCount.trim() || !Number.isSafeInteger(count) || count < 1) {
        setError("Enter a whole number of guests greater than zero.");
        return;
      }

      addMessage("user", `${count} ${count === 1 ? "guest" : "guests"}`);
      addMessage("assistant", assistantQuestions[1]);
      setStep(2);
      return;
    }

    if (step === 2) {
      const amount = Number(budget);
      if (!budget.trim() || !Number.isFinite(amount) || amount <= 0) {
        setError("Enter a budget greater than MXN $0.");
        return;
      }

      addMessage("user", formatMxBudget(amount));
      addMessage("assistant", "Thanks! Your event type, guest count, and MXN budget are ready for the next step.");
      setStep(3);
    }
  }

  function startOver() {
    setMessages(initialMessages);
    setStep(0);
    setEventType("");
    setCustomEventType("");
    setGuestCount("");
    setBudget("");
    setError("");
  }

  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          CakeMatch <span>AI</span>
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/core">Core</Link>
          <Link href="/chat" aria-current="page">Chat</Link>
          <Link href="/docs">Documentation</Link>
        </div>
      </nav>

      <section className="chat-page" aria-labelledby="chat-title">
        <header className="chat-intro">
          <p className="eyebrow">A guided cake chat</p>
          <h1 id="chat-title">Let&apos;s plan something sweet.</h1>
          <p className="chat-description">
            Share a few event details to get started. This first step collects
            your planning basics; it doesn&apos;t create an order or quote.
          </p>
        </header>

        <section className="chat-window" aria-label="Cake planning conversation">
          <div className="chat-privacy-note">
            <strong>Privacy note</strong>
            <span>Please don&apos;t share names, contact details, or sensitive information.</span>
          </div>

          <div
            className="chat-transcript"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message) => (
              <article
                className={`chat-message chat-message-${message.role}`}
                key={message.id}
              >
                <span className="chat-message-sender">
                  {message.role === "assistant" ? "CakeMatch" : "You"}
                </span>
                <p>{message.text}</p>
              </article>
            ))}
          </div>

          {step < 3 ? (
            <form className="chat-input-form" onSubmit={handleSubmit} noValidate>
              {step === 0 ? (
                <div className="chat-field-group">
                  <label className="chat-field" htmlFor="event-type">
                    Event type
                    <select
                      id="event-type"
                      value={eventType}
                      onChange={(event) => {
                        setEventType(event.target.value);
                        setError("");
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "chat-error" : undefined}
                    >
                      <option value="">Choose an event type</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Baby shower">Baby shower</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  {eventType === "Other" ? (
                    <label className="chat-field" htmlFor="custom-event-type">
                      Describe your event
                      <input
                        id="custom-event-type"
                        type="text"
                        maxLength={80}
                        value={customEventType}
                        onChange={(event) => {
                          setCustomEventType(event.target.value);
                          setError("");
                        }}
                        placeholder="Graduation, anniversary..."
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "chat-error" : undefined}
                      />
                    </label>
                  ) : null}
                </div>
              ) : null}

              {step === 1 ? (
                <label className="chat-field" htmlFor="guest-count">
                  Number of guests
                  <input
                    id="guest-count"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={guestCount}
                    onChange={(event) => {
                      setGuestCount(event.target.value);
                      setError("");
                    }}
                    placeholder="12"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "chat-error" : undefined}
                  />
                </label>
              ) : null}

              {step === 2 ? (
                <label className="chat-field" htmlFor="cake-budget">
                  Cake budget
                  <span className="chat-currency-input">
                    <span aria-hidden="true">MXN $</span>
                    <input
                      id="cake-budget"
                      type="number"
                      min="0.01"
                      step="0.01"
                      inputMode="decimal"
                      value={budget}
                      onChange={(event) => {
                        setBudget(event.target.value);
                        setError("");
                      }}
                      placeholder="1,500"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "chat-error budget-help" : "budget-help"}
                    />
                  </span>
                  <span id="budget-help" className="chat-field-help">Enter a positive amount in Mexican pesos.</span>
                </label>
              ) : null}

              {error ? <p className="chat-error" id="chat-error" role="alert">{error}</p> : null}
              <button className="primary-button chat-submit" type="submit">
                {step === 2 ? "Finish intake" : "Continue"}
              </button>
            </form>
          ) : (
            <div className="chat-complete" role="status">
              <p>Your planning details are complete.</p>
              <span>A cake recommendation will be part of a later chat stage.</span>
              <button className="chat-reset-button" type="button" onClick={startOver}>
                Start over
              </button>
            </div>
          )}
        </section>
      </section>

      <footer className="site-footer">
        <p>CakeMatch AI — Project created by Camila Gutiérrez</p>
        <p>AI-Native Builder 2026</p>
      </footer>
    </main>
  );
}
