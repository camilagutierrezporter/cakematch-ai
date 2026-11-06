"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  supabase,
  type MarketingAssetRow,
  type MarketingAssetType,
} from "@/lib/supabase/client";

type NewMarketingAsset = {
  asset_type: MarketingAssetType;
  title: string;
  content: string;
};

type MarketingAssetsContextValue = {
  isAuthenticated: boolean;
  saveAsset: (asset: NewMarketingAsset) => Promise<void>;
};

const MarketingAssetsContext = createContext<MarketingAssetsContextValue | null>(null);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export function useMarketingAssets() {
  const context = useContext(MarketingAssetsContext);
  if (!context) {
    throw new Error("Marketing asset actions must be used within their provider.");
  }
  return context;
}

export default function MarketingAssetsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<MarketingAssetRow[]>([]);
  const [email, setEmail] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [assetsError, setAssetsError] = useState("");
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  const currentUserId = useRef<string | null>(null);

  const loadAssets = useCallback(async (userId: string) => {
    setIsLoadingAssets(true);
    setAssetsError("");

    try {
      const { data, error } = await supabase
        .from("marketing_assets")
        .select("id, user_id, created_at, asset_type, title, content")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      if (currentUserId.current === userId) {
        setAssets(data ?? []);
      }
    } catch (error) {
      if (currentUserId.current === userId) {
        setAssetsError(`Could not load saved assets: ${getErrorMessage(error)}`);
      }
    } finally {
      if (currentUserId.current === userId) {
        setIsLoadingAssets(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      currentUserId.current = nextUser?.id ?? null;
      setUser(nextUser);
      setAssets([]);
      setAssetsError("");

      if (nextUser) {
        window.setTimeout(() => {
          if (currentUserId.current === nextUser.id) {
            void loadAssets(nextUser.id);
          }
        }, 0);
      } else {
        setIsLoadingAssets(false);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) {
        return;
      }

      if (error) {
        currentUserId.current = null;
        setIsLoadingAssets(false);
        setAuthError(`Could not check your sign-in status: ${error.message}`);
        return;
      }

      const sessionUser = data.session?.user ?? null;
      currentUserId.current = sessionUser?.id ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        void loadAssets(sessionUser.id);
      } else {
        setIsLoadingAssets(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadAssets]);

  async function sendSignInLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSendingLink(true);
    setAuthError("");
    setAuthMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/marketing`,
        },
      });

      if (error) {
        throw error;
      }

      setAuthMessage("Check your email for a secure sign-in link. It will return you to Marketing.");
    } catch (error) {
      setAuthError(`Could not send a sign-in link: ${getErrorMessage(error)}`);
    } finally {
      setIsSendingLink(false);
    }
  }

  async function signOut() {
    setAuthError("");
    setAuthMessage("");

    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(`Could not sign out: ${error.message}`);
    } else {
      setAuthMessage("You have signed out. Saved assets remain available after you sign in again.");
    }
  }

  async function saveAsset(asset: NewMarketingAsset) {
    if (!user) {
      throw new Error("Sign in with your email before saving marketing assets.");
    }

    const { data, error } = await supabase
      .from("marketing_assets")
      .insert({
        user_id: user.id,
        asset_type: asset.asset_type,
        title: asset.title,
        content: asset.content,
      })
      .select("id, user_id, created_at, asset_type, title, content")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    setAssets((current) =>
      [data, ...current.filter((saved) => saved.id !== data.id)].slice(0, 100),
    );
  }

  async function removeAsset(assetId: string) {
    setPendingRemovalId(assetId);
    setAssetsError("");

    try {
      const { error } = await supabase
        .from("marketing_assets")
        .delete()
        .eq("id", assetId);

      if (error) {
        throw error;
      }

      setAssets((current) => current.filter((asset) => asset.id !== assetId));
    } catch (error) {
      setAssetsError(`Could not remove the saved asset: ${getErrorMessage(error)}`);
    } finally {
      setPendingRemovalId(null);
    }
  }

  return (
    <MarketingAssetsContext.Provider value={{ isAuthenticated: Boolean(user), saveAsset }}>
      {children}
      <section
        className="marketing-section saved-marketing-section"
        aria-labelledby="saved-marketing-title"
      >
        <div className="marketing-section-heading">
          <p className="eyebrow">08 · Your library</p>
          <h2 id="saved-marketing-title">Saved marketing assets.</h2>
          <p className="marketing-section-note">
            Saved content is private to the account that created it. Sign in
            with the same email to retrieve your assets on another visit.
          </p>
        </div>

        <div className="marketing-card marketing-auth-card">
          {user ? (
            <div className="marketing-authenticated">
              <div>
                <p className="marketing-kicker">Signed in</p>
                <p className="marketing-user-email">{user.email}</p>
              </div>
              <button
                className="content-action-button"
                type="button"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          ) : (
            <form className="marketing-auth-form" onSubmit={sendSignInLink}>
              <div>
                <label className="ab-field" htmlFor="marketing-signin-email">
                  Email address
                  <input
                    autoComplete="email"
                    id="marketing-signin-email"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    type="email"
                    value={email}
                  />
                </label>
                <p className="auth-helper">
                  We&apos;ll email you a one-time sign-in link. No password is needed.
                </p>
              </div>
              <button
                className="primary-button"
                disabled={isSendingLink}
                type="submit"
              >
                {isSendingLink ? "Sending link…" : "Email me a sign-in link"}
              </button>
            </form>
          )}
          {authMessage && (
            <p className="auth-feedback" role="status" aria-live="polite">
              {authMessage}
            </p>
          )}
          {authError && (
            <p className="auth-feedback is-error" role="alert">
              {authError}
            </p>
          )}
        </div>

        <div className="saved-marketing-assets">
          <h3>Your saved content</h3>
          {!user ? (
            <p className="saved-assets-empty">
              Sign in to view and save your private marketing assets.
            </p>
          ) : isLoadingAssets ? (
            <p className="saved-assets-empty" role="status">Loading your saved assets…</p>
          ) : assetsError ? (
            <p className="saved-assets-error" role="alert">{assetsError}</p>
          ) : assets.length === 0 ? (
            <p className="saved-assets-empty">
              No saved assets yet. Use a Save button above to add content to your library.
            </p>
          ) : (
            <>
              <p className="saved-assets-note">
                Showing up to 100 most recent assets saved to your account.
              </p>
              <div className="saved-assets-list">
                {assets.map((asset) => (
                  <article className="marketing-card saved-marketing-asset" key={asset.id}>
                    <div className="saved-asset-heading">
                      <div>
                        <p className="marketing-kicker">{asset.asset_type.replaceAll("_", " ")}</p>
                        <h4>{asset.title}</h4>
                        <time dateTime={asset.created_at}>
                          {new Date(asset.created_at).toLocaleString()}
                        </time>
                      </div>
                      <button
                        className="remove-button"
                        disabled={pendingRemovalId === asset.id}
                        onClick={() => void removeAsset(asset.id)}
                        type="button"
                      >
                        {pendingRemovalId === asset.id ? "Removing…" : "Remove"}
                      </button>
                    </div>
                    <pre className="saved-asset-content">{asset.content}</pre>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </MarketingAssetsContext.Provider>
  );
}
