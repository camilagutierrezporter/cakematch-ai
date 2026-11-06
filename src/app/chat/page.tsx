"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createDesignBrief,
  createDesignDescription,
  createDesignVariation,
  DESIGN_FEELINGS,
  getGuardrailResponse,
  GUARDRAIL_CATEGORIES,
  INSPIRATION_SOURCES,
  UNIQUE_DETAILS,
} from "@/lib/cake-design.mjs";
import type {
  CakeDesignTranscriptMessage,
  CakeInspirationSource,
  DesignFeeling,
  DesignGuardrailCategory,
  UniqueCakeDetail,
} from "@/lib/cake-design.mjs";
import { supabase } from "@/lib/supabase/client";
import type { CakeDesignChatRow } from "@/lib/supabase/client";

type DesignSelection = {
  feeling: DesignFeeling | null;
  uniqueDetail: UniqueCakeDetail | null;
  inspiration: CakeInspirationSource | null;
};

type IntakeStep = 0 | 1 | 2 | 3;

const initialMessages: CakeDesignTranscriptMessage[] = [
  {
    id: 0,
    role: "assistant",
    message_type: "prompt",
    content: "Hi! I can help you shape a cake design idea. Let’s start with the feeling.",
  },
  {
    id: 1,
    role: "assistant",
    message_type: "prompt",
    content: "What feeling do you want your cake to create?",
  },
];

const questionOptions = [
  DESIGN_FEELINGS,
  UNIQUE_DETAILS,
  INSPIRATION_SOURCES,
] as const;

const questionPrompts = [
  "What feeling do you want your cake to create?",
  "What would you like to make your cake unique?",
  "Where would you like to find inspiration for your cake?",
] as const;

const guardrailLabels: Record<DesignGuardrailCategory, string> = {
  allergy_safety: "Allergies or safety",
  feasibility: "Can this design be made?",
  exact_price: "Price or quote",
  availability: "Availability",
  ordering: "Place an order",
  other: "Something else",
};

const emptySelection: DesignSelection = {
  feeling: null,
  uniqueDetail: null,
  inspiration: null,
};

function isDesignFeeling(value: string): value is DesignFeeling {
  return (DESIGN_FEELINGS as readonly string[]).includes(value);
}

function isUniqueDetail(value: string): value is UniqueCakeDetail {
  return (UNIQUE_DETAILS as readonly string[]).includes(value);
}

function isInspirationSource(value: string): value is CakeInspirationSource {
  return (INSPIRATION_SOURCES as readonly string[]).includes(value);
}

function isGuardrailCategory(value: string): value is DesignGuardrailCategory {
  return (GUARDRAIL_CATEGORIES as readonly string[]).includes(value);
}

function isGuardrailCategories(value: unknown): value is DesignGuardrailCategory[] {
  return Array.isArray(value) && value.every(isGuardrailCategory);
}

function isFeedbackVote(value: unknown): value is "up" | "down" {
  return value === "up" || value === "down";
}

function isTranscript(value: unknown): value is CakeDesignTranscriptMessage[] {
  return Array.isArray(value) && value.every((message) =>
    typeof message === "object"
    && message !== null
    && typeof message.id === "number"
    && (message.role === "assistant" || message.role === "user")
    && ["prompt", "selection", "design", "guardrail"].includes(message.message_type)
    && typeof message.content === "string",
  );
}

function storageFailureMessage(error: { message?: string }, operation: string) {
  const detail = error.message ? ` Details: ${error.message}` : "";
  return `${operation} failed. Check that Anonymous Sign-Ins are enabled in Supabase Auth and that docs/WEEK5_SUPABASE_SETUP.sql has been applied.${detail}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [step, setStep] = useState<IntakeStep>(0);
  const [selection, setSelection] = useState<DesignSelection>(emptySelection);
  const [designDescription, setDesignDescription] = useState("");
  const [variationPreview, setVariationPreview] = useState<string | null>(null);
  const [guardrailCategories, setGuardrailCategories] = useState<DesignGuardrailCategory[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasDesignChanged, setHasDesignChanged] = useState(false);
  const [storageStatus, setStorageStatus] = useState<"loading" | "ready" | "error">("loading");
  const [storageError, setStorageError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [notice, setNotice] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);

  const ensureOwner = useCallback(async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (sessionData.session?.user) {
      setOwnerId(sessionData.session.user.id);
      return sessionData.session.user.id;
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    if (!data.user) throw new Error("Supabase did not return an anonymous user.");
    setOwnerId(data.user.id);
    return data.user.id;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSavedDesign() {
      let phase = "checking the anonymous session";
      try {
        const owner = await ensureOwner();
        phase = "loading the saved design";
        const { data, error } = await supabase
          .from("chat_sessions")
          .select("*")
          .eq("owner_id", owner)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          if (!cancelled) setStorageStatus("ready");
          return;
        }

        if (
          !isDesignFeeling(data.feeling)
          || !isUniqueDetail(data.unique_detail)
          || !isInspirationSource(data.inspiration)
          || typeof data.design_description !== "string"
          || !data.design_description.trim()
          || !isGuardrailCategories(data.guardrail_categories)
          || !isTranscript(data.transcript)
        ) {
          throw new Error("The saved design has invalid or outdated data.");
        }

        const savedRow: CakeDesignChatRow = data;
        phase = "loading design feedback";
        const { data: savedFeedback, error: feedbackError } = await supabase
          .from("chat_feedback")
          .select("vote")
          .eq("owner_id", owner)
          .eq("session_id", savedRow.id)
          .maybeSingle();
        if (feedbackError) throw feedbackError;
        if (savedFeedback && !isFeedbackVote(savedFeedback.vote)) {
          throw new Error("The saved design feedback has an unexpected value.");
        }

        if (cancelled) return;
        setSessionId(savedRow.id);
        setSelection({
          feeling: savedRow.feeling,
          uniqueDetail: savedRow.unique_detail,
          inspiration: savedRow.inspiration,
        });
        setDesignDescription(savedRow.design_description);
        setGuardrailCategories(savedRow.guardrail_categories);
        setMessages(savedRow.transcript);
        setStep(3);
        setFeedback(savedFeedback?.vote ?? null);
        setHasUnsavedChanges(false);
        setHasDesignChanged(false);
        setStorageStatus("ready");
        setNotice("Your latest saved design is ready.");
      } catch (error) {
        console.error(`Could not restore the saved cake design chat while ${phase}.`, error);
        if (!cancelled) {
          setStorageError(storageFailureMessage(
            error instanceof Error ? error : {},
            `Restoring your private chat while ${phase}`,
          ));
          setStorageStatus("error");
        }
      }
    }

    void restoreSavedDesign();
    return () => {
      cancelled = true;
    };
  }, [ensureOwner]);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTo({ top: transcript.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function addMessages(...newMessages: Omit<CakeDesignTranscriptMessage, "id">[]) {
    setMessages((currentMessages) => [
      ...currentMessages,
      ...newMessages.map((message, index) => ({
        ...message,
        id: currentMessages.length + index,
      })),
    ]);
  }

  function handleOption(value: string) {
    setNotice("");

    if (step === 0 && isDesignFeeling(value)) {
      setSelection((current) => ({ ...current, feeling: value }));
      setHasUnsavedChanges(true);
      addMessages(
        { role: "user", message_type: "selection", content: value },
        { role: "assistant", message_type: "prompt", content: questionPrompts[1] },
      );
      setStep(1);
      return;
    }

    if (step === 1 && isUniqueDetail(value)) {
      setSelection((current) => ({ ...current, uniqueDetail: value }));
      setHasUnsavedChanges(true);
      addMessages(
        { role: "user", message_type: "selection", content: value },
        { role: "assistant", message_type: "prompt", content: questionPrompts[2] },
      );
      setStep(2);
      return;
    }

    if (step === 2 && isInspirationSource(value)) {
      const completedSelection: DesignSelection = { ...selection, inspiration: value };
      if (!completedSelection.feeling || !completedSelection.uniqueDetail) return;

      const description = createDesignDescription({
        feeling: completedSelection.feeling,
        uniqueDetail: completedSelection.uniqueDetail,
        inspiration: value,
      });
      setSelection(completedSelection);
      setHasUnsavedChanges(true);
      setDesignDescription(description);
      addMessages(
        { role: "user", message_type: "selection", content: value },
        { role: "assistant", message_type: "design", content: description },
      );
      setStep(3);
    }
  }

  function handleGuardrail(category: DesignGuardrailCategory) {
    if (guardrailCategories.includes(category)) return;
    setGuardrailCategories((current) => [...current, category]);
    setHasUnsavedChanges(true);
    addMessages(
      { role: "user", message_type: "selection", content: guardrailLabels[category] },
      { role: "assistant", message_type: "guardrail", content: getGuardrailResponse(category) },
    );
    setNotice("Save changes to keep this response with your design.");
  }

  function changeSelection(targetStep: 0 | 1 | 2) {
    const messageCount = targetStep === 0 ? 2 : targetStep === 1 ? 4 : 6;
    setMessages((currentMessages) => currentMessages.slice(0, messageCount));
    setSelection((current) => ({
      feeling: current.feeling,
      uniqueDetail: targetStep < 2 ? null : current.uniqueDetail,
      inspiration: null,
    }));
    if (targetStep === 0) setSelection(emptySelection);
    setDesignDescription("");
    setVariationPreview(null);
    setGuardrailCategories([]);
    setStep(targetStep);
    setHasUnsavedChanges(true);
    setHasDesignChanged(true);
    setNotice("Choose your updated answer, then save the design.");
  }

  function tryAnotherDesign() {
    if (!selection.feeling || !selection.uniqueDetail || !selection.inspiration) return;
    setNotice("");
    setVariationPreview(createDesignVariation({
      feeling: selection.feeling,
      uniqueDetail: selection.uniqueDetail,
      inspiration: selection.inspiration,
    }, variationPreview ?? designDescription));
  }

  function chooseVariation() {
    if (!variationPreview) return;

    const chosenDescription = variationPreview;
    setDesignDescription(chosenDescription);
    setMessages((currentMessages) => {
      let latestDesignIndex = -1;
      currentMessages.forEach((message, index) => {
        if (message.role === "assistant" && message.message_type === "design") {
          latestDesignIndex = index;
        }
      });

      if (latestDesignIndex < 0) {
        return [
          ...currentMessages,
          {
            id: currentMessages.length,
            role: "assistant",
            message_type: "design",
            content: chosenDescription,
          },
        ];
      }

      return currentMessages.map((message, index) =>
        index === latestDesignIndex ? { ...message, content: chosenDescription } : message,
      );
    });
    setVariationPreview(null);
    setHasUnsavedChanges(true);
    setHasDesignChanged(true);
    setNotice("New variation selected. Save to replace your saved design.");
  }

  async function saveDesign() {
    if (
      step !== 3
      || !selection.feeling
      || !selection.uniqueDetail
      || !selection.inspiration
      || !designDescription
    ) return;

    setIsSaving(true);
    setStorageError("");
    setNotice("");
    try {
      const owner = ownerId ?? await ensureOwner();
      const design = {
        feeling: selection.feeling,
        unique_detail: selection.uniqueDetail,
        inspiration: selection.inspiration,
        design_description: designDescription,
        guardrail_categories: guardrailCategories,
        transcript: messages,
        updated_at: new Date().toISOString(),
      };

      if (sessionId) {
        const { data, error } = await supabase
          .from("chat_sessions")
          .update(design)
          .eq("id", sessionId)
          .eq("owner_id", owner)
          .select("id")
          .single();
        if (error) throw error;
        setSessionId(data.id);
        if (hasDesignChanged) {
          const { error: feedbackDeleteError } = await supabase
            .from("chat_feedback")
            .delete()
            .eq("session_id", sessionId)
            .eq("owner_id", owner);
          if (feedbackDeleteError) throw feedbackDeleteError;
          setFeedback(null);
          setHasDesignChanged(false);
        }
      } else {
        const { data, error } = await supabase
          .from("chat_sessions")
          .insert({ ...design, owner_id: owner })
          .select("id")
          .single();
        if (error) throw error;
        setSessionId(data.id);
      }

      setStorageStatus("ready");
      setHasUnsavedChanges(false);
      setHasDesignChanged(false);
      setNotice("Your design is saved privately in this browser session.");
    } catch (error) {
      console.error("Could not save the cake design chat.", error);
      setStorageError(storageFailureMessage(
        error instanceof Error ? error : {},
        "Saving your design",
      ));
      setStorageStatus("error");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveFeedback(vote: "up" | "down") {
    if (!sessionId) return;

    setIsSendingFeedback(true);
    setStorageError("");
    setNotice("");
    try {
      const owner = ownerId ?? await ensureOwner();
      const { error } = await supabase
        .from("chat_feedback")
        .upsert({
          owner_id: owner,
          session_id: sessionId,
          design_version: "week5-design-v1",
          vote,
          updated_at: new Date().toISOString(),
        }, { onConflict: "owner_id,session_id" });
      if (error) throw error;
      setFeedback(vote);
      setNotice("Thanks for your feedback.");
    } catch (error) {
      console.error("Could not save cake design feedback.", error);
      setStorageError(storageFailureMessage(
        error instanceof Error ? error : {},
        "Saving your feedback",
      ));
    } finally {
      setIsSendingFeedback(false);
    }
  }

  async function startNewDesign() {
    if (sessionId && !window.confirm("Delete your saved design and start a new one?")) return;

    if (sessionId) {
      try {
        const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId);
        if (error) throw error;
      } catch (error) {
        console.error("Could not delete the saved cake design chat.", error);
        setStorageError(storageFailureMessage(
          error instanceof Error ? error : {},
          "Deleting your saved design",
        ));
        return;
      }
    }

    setMessages(initialMessages);
    setStep(0);
    setSelection(emptySelection);
    setDesignDescription("");
    setVariationPreview(null);
    setGuardrailCategories([]);
    setSessionId(null);
    setFeedback(null);
    setHasUnsavedChanges(false);
    setHasDesignChanged(false);
    setStorageError("");
    setNotice(sessionId ? "Your saved design was deleted." : "Your new design chat is ready.");
  }

  async function copyDesignBrief() {
    if (!selection.feeling || !selection.uniqueDetail || !selection.inspiration || !designDescription) return;
    const brief = createDesignBrief({
      feeling: selection.feeling,
      uniqueDetail: selection.uniqueDetail,
      inspiration: selection.inspiration,
      designDescription,
    });

    try {
      await navigator.clipboard.writeText(brief);
      setNotice("Design brief copied. It has not been sent to a bakery.");
    } catch (error) {
      console.error("Could not copy the cake design brief.", error);
      setNotice("Your browser could not copy the brief. Select the design text to copy it.");
    }
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
          <p className="eyebrow">A guided cake design chat</p>
          <h1 id="chat-title">Imagine a cake that feels like you.</h1>
          <p className="chat-description">
            Choose a feeling, a unique detail, and a source of inspiration. Get a
            simple design idea to share with a cake designer.
          </p>
        </header>

        <section className="chat-window" aria-label="Cake design conversation">
          <div className="chat-privacy-note">
            <strong>Privacy note</strong>
            <span>
              Your choices are saved privately in this browser when you choose Save design.
              Clearing browser data may lose the chat. Don&apos;t share names, contact details,
              or sensitive information.
            </span>
          </div>

          {storageStatus === "loading" ? (
            <p className="chat-storage-status" role="status">Restoring your private chat…</p>
          ) : null}
          {storageError ? (
            <div className="chat-storage-error" role="alert">
              <p className="chat-error">{storageError}</p>
              <button className="chat-reset-button" type="button" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : null}

          <div
            className="chat-transcript"
            ref={transcriptRef}
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message) => (
              <article
                className={`chat-message chat-message-${message.role}${message.message_type === "design" ? " chat-message-design" : ""}`}
                key={message.id}
              >
                <span className="chat-message-sender">
                  {message.role === "assistant" ? "CakeMatch" : "You"}
                </span>
                <p>{message.content}</p>
              </article>
            ))}
          </div>

          {step !== 3 ? (
            <>
              {(selection.feeling || selection.uniqueDetail) ? (
                <div className="chat-answer-summary" aria-label="Your selected answers">
                  <strong>Your choices</strong>
                  {selection.feeling ? (
                    <span>
                      Feeling: {selection.feeling}
                      <button type="button" onClick={() => changeSelection(0)}>Change</button>
                    </span>
                  ) : null}
                  {selection.uniqueDetail ? (
                    <span>
                      Unique detail: {selection.uniqueDetail}
                      <button type="button" onClick={() => changeSelection(1)}>Change</button>
                    </span>
                  ) : null}
                </div>
              ) : null}
              <fieldset className="chat-options" disabled={storageStatus === "loading"}>
                <legend>
                  Question {step + 1} of 3
                  <span>{questionPrompts[step]}</span>
                </legend>
                <div className="chat-option-list">
                  {questionOptions[step].map((option) => (
                    <button
                      className="chat-option"
                      key={option}
                      type="button"
                      onClick={() => handleOption(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            </>
          ) : (
            <div className="chat-complete">
              <section className="chat-design-result" aria-labelledby="design-result-title">
                <p className="eyebrow">Your personalized cake design</p>
                <h2 id="design-result-title">{selection.feeling} • {selection.uniqueDetail}</h2>
                <p className="chat-result-inspiration">Inspired by: {selection.inspiration}</p>
                <p className="chat-result-description">{designDescription}</p>
                <button className="chat-reset-button" type="button" onClick={tryAnotherDesign}>
                  Try another design
                </button>
                {variationPreview ? (
                  <section className="chat-variation-preview" aria-labelledby="variation-preview-title">
                    <p className="eyebrow">Alternative concept preview</p>
                    <h3 id="variation-preview-title">Another idea using your same answers</h3>
                    <p className="chat-result-description">{variationPreview}</p>
                    <div className="chat-variation-actions">
                      <button className="primary-button" type="button" onClick={chooseVariation}>
                        Use this version
                      </button>
                      <button
                        className="chat-reset-button"
                        type="button"
                        onClick={() => setVariationPreview(null)}
                      >
                        Keep current design
                      </button>
                    </div>
                  </section>
                ) : null}
                <button className="chat-reset-button" type="button" onClick={copyDesignBrief}>
                  Copy design brief
                </button>
                <div className="chat-answer-summary" aria-label="Change a design choice">
                  <strong>Want to change an answer?</strong>
                  <span>
                    Feeling: {selection.feeling}
                    <button type="button" onClick={() => changeSelection(0)}>Change</button>
                  </span>
                  <span>
                    Unique detail: {selection.uniqueDetail}
                    <button type="button" onClick={() => changeSelection(1)}>Change</button>
                  </span>
                  <span>
                    Inspiration: {selection.inspiration}
                    <button type="button" onClick={() => changeSelection(2)}>Change</button>
                  </span>
                </div>
              </section>

              <section className="chat-guardrail" aria-labelledby="guardrail-title">
                <h3 id="guardrail-title">Need a next step?</h3>
                <p>
                  I can share general guidance, but a cake designer must confirm
                  safety, feasibility, prices, availability, and orders.
                </p>
                <div className="chat-option-list chat-guardrail-options">
                  {GUARDRAIL_CATEGORIES.map((category) => (
                    <button
                      className="chat-option chat-guardrail-option"
                      key={category}
                      type="button"
                      disabled={guardrailCategories.includes(category)}
                      onClick={() => handleGuardrail(category)}
                    >
                      {guardrailLabels[category]}
                    </button>
                  ))}
                </div>
              </section>

              <section className="chat-human-checkpoint" aria-label="Human checkpoint">
                <strong>Human checkpoint</strong>
                <span>
                  This is a starting idea, not an order or confirmed quote. Ask a
                  cake designer to review the design and confirm ingredients,
                  allergy precautions, feasibility, price, and availability.
                </span>
              </section>

              <div className="chat-actions">
                <button
                  className="primary-button chat-submit"
                  type="button"
                  onClick={saveDesign}
                  disabled={isSaving || storageStatus === "loading" || (Boolean(sessionId) && !hasUnsavedChanges)}
                >
                  {isSaving
                    ? "Saving…"
                    : sessionId
                      ? hasUnsavedChanges ? "Save changes" : "Saved"
                      : "Save design"}
                </button>
                <button className="chat-reset-button" type="button" onClick={startNewDesign}>
                  Start a new design
                </button>
              </div>

              <section className="chat-feedback" aria-label="Design feedback">
                <p>Was this design idea helpful?</p>
                <button
                  className={`chat-feedback-button${feedback === "up" ? " is-selected" : ""}`}
                  type="button"
                  aria-label="Thumbs up: helpful"
                  aria-pressed={feedback === "up"}
                  disabled={!sessionId || hasDesignChanged || isSendingFeedback}
                  onClick={() => saveFeedback("up")}
                >
                  👍 <span>Yes</span>
                </button>
                <button
                  className={`chat-feedback-button${feedback === "down" ? " is-selected" : ""}`}
                  type="button"
                  aria-label="Thumbs down: not helpful"
                  aria-pressed={feedback === "down"}
                  disabled={!sessionId || hasDesignChanged || isSendingFeedback}
                  onClick={() => saveFeedback("down")}
                >
                  👎 <span>No</span>
                </button>
                {!sessionId ? (
                  <span className="chat-feedback-hint">Save the design before leaving feedback.</span>
                ) : hasDesignChanged ? (
                  <span className="chat-feedback-hint">Save the changed design before leaving feedback.</span>
                ) : null}
              </section>
            </div>
          )}

          {notice ? <p className="chat-storage-status" role="status">{notice}</p> : null}
        </section>
      </section>

      <footer className="site-footer">
        <p>CakeMatch AI — Project created by Camila Gutiérrez</p>
        <p>AI-Native Builder 2026</p>
      </footer>
    </main>
  );
}
