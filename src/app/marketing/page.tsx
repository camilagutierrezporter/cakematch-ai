import Link from "next/link";
import AbHeadlineTester from "./ab-headline-tester";
import ContentActions from "./content-actions";
import MarketingAssetsProvider from "./marketing-assets";

const socialPosts = [
  {
    number: "01",
    channel: "Instagram · Carousel",
    theme: "Start with the celebration",
    caption:
      "Big day coming up? Start with the sweet part. CakeMatch AI helps you turn your occasion, guest count, flavor, style, and budget into a cake or cupcake recommendation that feels like you. Plan your dessert in a few thoughtful steps.",
    action: "Create your recommendation at CakeMatch AI.",
  },
  {
    number: "02",
    channel: "Instagram · Reel",
    theme: "How much cake do I need?",
    caption:
      "One of the trickiest party questions, answered with a little more confidence. Share how many guests are coming and CakeMatch AI will suggest a cake size or cupcake quantity to get your planning started.",
    action: "Bring your guest list to the CakeMatch AI planner.",
  },
  {
    number: "03",
    channel: "Facebook",
    theme: "A birthday made personal",
    caption:
      "A birthday cake should feel like part of the celebration. Choose the occasion, guest count, flavor, style, and budget you have in mind. CakeMatch AI brings those details together in one practical recommendation.",
    action: "Plan a birthday dessert with CakeMatch AI.",
  },
  {
    number: "04",
    channel: "Instagram · Stories",
    theme: "Cake or cupcakes?",
    caption:
      "Team centerpiece cake or a cupcake for every guest? There is no wrong answer. CakeMatch AI helps you explore either option based on your celebration and guest count.",
    action: "Tap through to plan your dessert.",
  },
  {
    number: "05",
    channel: "Instagram · Carousel",
    theme: "Bring your style to the table",
    caption:
      "Soft florals, clean and classic, or playful color? Your celebration has its own look. Add your preferred style and flavor to CakeMatch AI and get a recommendation shaped around your ideas.",
    action: "Turn your inspiration into a starting point at CakeMatch AI.",
  },
  {
    number: "06",
    channel: "Facebook",
    theme: "A little budget clarity",
    caption:
      "Planning a celebration means making lots of decisions. CakeMatch AI includes your budget in the cake or cupcake planning process and provides an estimated price range to help you think through the next step.",
    action: "Try the planner and explore your options.",
  },
  {
    number: "07",
    channel: "Instagram · Reel",
    theme: "Small gathering, sweet moment",
    caption:
      "A celebration does not need a crowd to deserve a beautiful dessert. Share your guest count and preferences with CakeMatch AI to find a cake or cupcake idea for the moment you are celebrating.",
    action: "Make a plan for your next small gathering.",
  },
  {
    number: "08",
    channel: "Instagram · Stories",
    theme: "Flavor first",
    caption:
      "If you could pick one flavor for your next celebration, what would it be? Chocolate, vanilla, something fruity, or a family favorite? CakeMatch AI makes flavor one of the details in your dessert recommendation.",
    action: "Choose your flavor in the CakeMatch AI planner.",
  },
  {
    number: "09",
    channel: "Facebook",
    theme: "Celebrating the local baker",
    caption:
      "Independent bakeries bring care, creativity, and a personal touch to celebrations everywhere. CakeMatch AI is exploring ways to help people discover local bakers and help those bakers reach more customers.",
    action: "Follow along as CakeMatch AI grows.",
  },
  {
    number: "10",
    channel: "Instagram · Carousel",
    theme: "The details, all in one place",
    caption:
      "Occasion. Guests. Flavor. Style. Budget. A few useful details can make cake planning feel less like guesswork. CakeMatch AI brings them together to suggest a dessert direction for your celebration.",
    action: "Start your CakeMatch AI recommendation today.",
  },
];

const videoScripts = [
  {
    number: "01",
    title: "From party idea to cake plan",
    duration: "30 seconds",
    scenes: [
      {
        time: "0–5 sec",
        visual: "A celebration invitation sits beside a blank cake sketch.",
        audio: "Planning a celebration is exciting. Choosing the dessert can feel like one more big decision.",
      },
      {
        time: "5–15 sec",
        visual: "Show the CakeMatch AI planner fields: occasion, guests, flavor, style, and budget.",
        audio: "Tell CakeMatch AI what you are celebrating, how many guests are coming, and the flavors, style, and budget you have in mind.",
      },
      {
        time: "15–25 sec",
        visual: "A recommendation card appears with an amount, flavor, design, and estimated price.",
        audio: "Get a cake or cupcake recommendation to help you decide what to explore next.",
      },
      {
        time: "25–30 sec",
        visual: "The invitation and finished cake share the frame with the CakeMatch AI wordmark.",
        audio: "Make room for the moment. Start planning with CakeMatch AI.",
      },
    ],
  },
  {
    number: "02",
    title: "Cake or cupcakes for your guest list?",
    duration: "20 seconds",
    scenes: [
      {
        time: "0–4 sec",
        visual: "Split screen: a decorated celebration cake on one side, a tray of cupcakes on the other.",
        audio: "A centerpiece cake, or cupcakes for everyone?",
      },
      {
        time: "4–12 sec",
        visual: "A guest count is entered in the CakeMatch AI planner; the product choice changes from cake to cupcakes.",
        audio: "Your guest list and celebration can help shape the answer. Add your details to CakeMatch AI and explore a suggested cake size or cupcake quantity.",
      },
      {
        time: "12–20 sec",
        visual: "Both desserts appear together with a CakeMatch AI call-to-action.",
        audio: "Choose the dessert that fits your day. Plan your recommendation with CakeMatch AI.",
      },
    ],
  },
  {
    number: "03",
    title: "A little love for independent bakeries",
    duration: "25 seconds",
    scenes: [
      {
        time: "0–6 sec",
        visual: "Close-up details of a baker piping frosting and finishing a cake by hand.",
        audio: "Behind every special cake is a maker who puts care into the details.",
      },
      {
        time: "6–16 sec",
        visual: "A celebration table, then a local bakery storefront and its display case.",
        audio: "Independent bakeries bring their own flavor and creativity to the milestones we remember.",
      },
      {
        time: "16–25 sec",
        visual: "CakeMatch AI brand card in cream, blush, and burgundy.",
        audio: "CakeMatch AI is exploring ways to connect celebration planners with local bakers. Follow the journey and celebrate the craft in your community.",
      },
    ],
  },
];

const campaignDays = [
  { day: 1, channel: "Instagram", format: "Carousel", focus: "Introduce CakeMatch AI", content: "Share the value proposition: a thoughtful cake or cupcake recommendation shaped around occasion, guests, flavor, style, and budget.", action: "Visit the planner." },
  { day: 2, channel: "Instagram Stories", format: "Poll", focus: "Cake or cupcakes?", content: "Ask followers which dessert they would choose for their next celebration, then invite them to explore both options.", action: "Try CakeMatch AI." },
  { day: 3, channel: "Facebook", format: "Text + image", focus: "Start with the guest list", content: "Explain how guest count helps make cake-size or cupcake-quantity planning feel more manageable.", action: "Plan for your guests." },
  { day: 4, channel: "Instagram", format: "Reel", focus: "A simple planning walkthrough", content: "Show the planner details being entered and a recommendation appearing.", action: "Create a recommendation." },
  { day: 5, channel: "Instagram Stories", format: "Question box", focus: "Favorite celebration flavor", content: "Invite people to share the flavor they would choose for a birthday, wedding, or other special moment.", action: "Add your flavor in the planner." },
  { day: 6, channel: "Facebook", format: "Text post", focus: "Make room in the budget", content: "Describe how adding a budget helps people explore an estimated price range as they plan.", action: "Include your budget in a plan." },
  { day: 7, channel: "Instagram", format: "Carousel", focus: "Style inspiration", content: "Feature three design moods—classic, floral, and playful—and remind planners to include their preferred style.", action: "Choose a style with CakeMatch AI." },
  { day: 8, channel: "Instagram Stories", format: "Behind the scenes", focus: "Celebrate the craft", content: "Share a baker-at-work moment and recognize the creativity of independent bakeries.", action: "Follow CakeMatch AI for more." },
  { day: 9, channel: "Facebook", format: "Community spotlight", focus: "Independent bakery appreciation", content: "Celebrate the local bakeries that make birthdays, weddings, and everyday milestones sweeter.", action: "Tag a bakery you love." },
  { day: 10, channel: "Instagram", format: "Reel", focus: "Cake or cupcake recommendation", content: "Demonstrate changing the product choice in the planner and show how the recommendation responds.", action: "Explore your dessert options." },
  { day: 11, channel: "Instagram Stories", format: "Quiz", focus: "What details matter most?", content: "Ask followers to pick what they consider first: guest count, flavor, design, or budget.", action: "Bring your priorities to the planner." },
  { day: 12, channel: "Facebook", format: "Text + image", focus: "A small gathering deserves cake", content: "Remind planners that intimate celebrations can be meaningful and deserve a dessert chosen with care.", action: "Plan a dessert for your gathering." },
  { day: 13, channel: "Instagram", format: "Carousel", focus: "The planning checklist", content: "Present five prompts for a cake plan: occasion, guest count, product, flavor and style, and budget.", action: "Answer them with CakeMatch AI." },
  { day: 14, channel: "Instagram + Facebook", format: "Campaign recap", focus: "Bring the celebration together", content: "Recap two weeks of cake ideas, planning tips, and bakery appreciation, then restate how CakeMatch AI helps turn preferences into a starting recommendation.", action: "Start planning at CakeMatch AI." },
];

const landingPageCopy = [
  "HEADLINE",
  "Find the right cake for your celebration.",
  "",
  "DESCRIPTION",
  "Tell CakeMatch AI what you're celebrating, how many guests you're welcoming, and the flavor, style, and budget you have in mind. Get a thoughtful cake or cupcake recommendation to make dessert planning feel simple.",
  "",
  "CALL TO ACTION",
  "Create My Recommendation",
].join("\n");

function formatSocialPost(post: (typeof socialPosts)[number]) {
  return [
    `CAKEMATCH AI — SOCIAL MEDIA POST ${post.number}`,
    `Platform and format: ${post.channel}`,
    `Theme: ${post.theme}`,
    "",
    "POST COPY",
    post.caption,
    "",
    "CALL TO ACTION",
    post.action,
  ].join("\n");
}

function formatVideoScript(script: (typeof videoScripts)[number]) {
  return [
    `CAKEMATCH AI — VIDEO SCRIPT ${script.number}`,
    `Title: ${script.title}`,
    `Duration: ${script.duration}`,
    "",
    ...script.scenes.flatMap((scene, index) => [
      `SCENE ${index + 1} · ${scene.time}`,
      `Visual: ${scene.visual}`,
      `Voiceover: ${scene.audio}`,
      "",
    ]),
  ].join("\n").trimEnd();
}

const campaignCalendarCopy = [
  "CAKEMATCH AI — 14-DAY CAMPAIGN CALENDAR",
  "",
  ...campaignDays.flatMap((item) => [
    `DAY ${String(item.day).padStart(2, "0")} · ${item.focus}`,
    `Channel: ${item.channel}`,
    `Format: ${item.format}`,
    `Content: ${item.content}`,
    `Call to action: ${item.action}`,
    "",
  ]),
].join("\n").trimEnd();

export default function MarketingPage() {
  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          CakeMatch <span>AI</span>
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/core">Plan an event</Link>
          <Link href="/product">Product</Link>
          <Link href="/marketing" aria-current="page">Marketing</Link>
        </div>
      </nav>

      <MarketingAssetsProvider>
      <div className="marketing-page">
        <header className="marketing-intro">
          <p className="eyebrow">Marketing studio · Week 4</p>
          <h1 id="marketing-title">Make every celebration a little sweeter.</h1>
          <p className="marketing-lead">
            A ready-to-use brand foundation and content campaign for the people
            planning celebrations and the independent bakeries that make them
            memorable.
          </p>
          <Link className="primary-button" href="/core">Plan a celebration</Link>
        </header>

        <section className="marketing-section" aria-labelledby="brand-system-title">
          <div className="marketing-section-heading">
            <p className="eyebrow">01 · Brand foundation</p>
            <h2 id="brand-system-title">Thoughtful planning, made sweeter.</h2>
          </div>
          <div className="brand-system-grid">
            <article className="marketing-card brand-promise">
              <p className="marketing-kicker">Brand promise</p>
              <h3>A clearer first step toward the right celebration dessert.</h3>
              <p>
                CakeMatch AI brings occasion, guest count, flavor, style, and
                budget together in a helpful cake or cupcake recommendation.
                Our bigger vision is to help more people discover the craft of
                independent bakeries.
              </p>
            </article>
            <article className="marketing-card brand-voice">
              <p className="marketing-kicker">Voice and personality</p>
              <ul>
                <li><strong>Warm:</strong> celebrate the person and the moment.</li>
                <li><strong>Helpful:</strong> make planning feel clear, not complicated.</li>
                <li><strong>Elegant:</strong> use thoughtful, simple language.</li>
                <li><strong>Honest:</strong> describe recommendations as a starting point.</li>
              </ul>
            </article>
            <article className="marketing-card brand-colors">
              <p className="marketing-kicker">Color palette</p>
              <div className="brand-swatches">
                <div><span className="swatch swatch-cream" /><span>Cream</span><code>#FBF3ED</code></div>
                <div><span className="swatch swatch-blush" /><span>Soft blush</span><code>#E8B9B5</code></div>
                <div><span className="swatch swatch-burgundy" /><span>Burgundy</span><code>#823F4D</code></div>
              </div>
            </article>
            <article className="marketing-card brand-type">
              <p className="marketing-kicker">Typography</p>
              <p className="brand-type-sample">Elegant serif headings</p>
              <p>
                Pair expressive Georgia serif headlines with clean sans-serif
                body copy for a polished, approachable feel.
              </p>
            </article>
          </div>
        </section>

        <section className="marketing-section" aria-labelledby="personas-title">
          <div className="marketing-section-heading">
            <p className="eyebrow">02 · Who we serve</p>
            <h2 id="personas-title">Two people behind every sweet match.</h2>
          </div>
          <div className="persona-grid">
            <article className="marketing-card persona-card">
              <span className="persona-number">01</span>
              <p className="marketing-kicker">Target persona · Celebration planner</p>
              <h3>Mariana, making a milestone personal</h3>
              <p>
                Mariana is organizing a birthday or family celebration. She
                knows the guest count and has ideas about flavor and style, but
                wants help narrowing down the cake or cupcake quantity and
                keeping the budget in view.
              </p>
              <p className="persona-need"><strong>Needs:</strong> an easy starting point, practical guidance, and a dessert that feels right for the occasion.</p>
            </article>
            <article className="marketing-card persona-card persona-card-accent">
              <span className="persona-number">02</span>
              <p className="marketing-kicker">Target persona · Independent bakery</p>
              <h3>Lucía, sharing her bakery&apos;s craft</h3>
              <p>
                Lucía runs a small independent bakery known for personal
                service and made-to-order desserts. She wants more local people
                to discover her work and arrive with clearer ideas for their
                celebrations.
              </p>
              <p className="persona-need"><strong>Needs:</strong> local visibility, thoughtful customer connections, and room to show what makes her bakery special.</p>
              <span className="status-pill status-proposed">Connection tools are a future vision</span>
            </article>
          </div>
        </section>

        <section className="marketing-section landing-copy" aria-labelledby="landing-copy-title">
          <div className="marketing-section-heading">
            <p className="eyebrow">03 · Landing page copy</p>
            <h2 id="landing-copy-title">Words for the first visit.</h2>
          </div>
          <article className="landing-copy-card">
            <p className="marketing-kicker">Headline</p>
            <h3>Find the right cake for your celebration.</h3>
            <p className="marketing-kicker">Description</p>
            <p className="landing-description">
              Tell CakeMatch AI what you&apos;re celebrating, how many guests
              you&apos;re welcoming, and the flavor, style, and budget you have
              in mind. Get a thoughtful cake or cupcake recommendation to make
              dessert planning feel simple.
            </p>
            <Link className="primary-button" href="/core">Create My Recommendation</Link>
            <ContentActions
              content={landingPageCopy}
              filename="cakematch-landing-page-copy.txt"
              label="Landing page copy"
              assetType="landing_copy"
              assetTitle="Landing page copy"
            />
          </article>
        </section>

        <section className="marketing-section" aria-labelledby="social-posts-title">
          <div className="marketing-section-heading">
            <p className="eyebrow">04 · Social content</p>
            <h2 id="social-posts-title">Ten posts, ready to share.</h2>
            <p className="marketing-section-note">Prepared campaign copy for CakeMatch AI. Bakery discovery is described as a future direction, not a current feature.</p>
          </div>
          <div className="social-post-grid">
            {socialPosts.map((post) => (
              <article className="marketing-card social-post-card" key={post.number}>
                <div className="content-card-meta">
                  <span className="content-number">{post.number}</span>
                  <span>{post.channel}</span>
                </div>
                <h3>{post.theme}</h3>
                <p>{post.caption}</p>
                <p className="post-action"><strong>Close with:</strong> {post.action}</p>
                <ContentActions
                  content={formatSocialPost(post)}
                  filename={`cakematch-social-post-${post.number}.txt`}
                  label={`Social post ${post.number}`}
                  assetType="social_post"
                  assetTitle={`Social post ${post.number}: ${post.theme}`}
                />
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-section" aria-labelledby="video-scripts-title">
          <div className="marketing-section-heading">
            <p className="eyebrow">05 · Short-form video</p>
            <h2 id="video-scripts-title">Three stories to bring to life.</h2>
          </div>
          <div className="video-script-grid">
            {videoScripts.map((script) => (
              <article className="marketing-card video-script-card" key={script.number}>
                <div className="content-card-meta">
                  <span className="content-number">{script.number}</span>
                  <span>{script.duration}</span>
                </div>
                <h3>{script.title}</h3>
                <ol className="script-scenes">
                  {script.scenes.map((scene) => (
                    <li key={scene.time}>
                      <span className="scene-time">{scene.time}</span>
                      <p><strong>Visual:</strong> {scene.visual}</p>
                      <p><strong>Voiceover:</strong> {scene.audio}</p>
                    </li>
                  ))}
                </ol>
                <ContentActions
                  content={formatVideoScript(script)}
                  filename={`cakematch-video-script-${script.number}.txt`}
                  label={`Video script ${script.number}`}
                  assetType="video_script"
                  assetTitle={`Video script ${script.number}: ${script.title}`}
                />
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-section campaign-section" aria-labelledby="campaign-title">
          <div className="marketing-section-heading">
            <p className="eyebrow">06 · Campaign calendar</p>
            <h2 id="campaign-title">A complete 14-day introduction.</h2>
            <p className="marketing-section-note">A balanced two-week mix of practical planning tips, product education, and appreciation for independent bakeries.</p>
          </div>
          <ol className="campaign-calendar">
            {campaignDays.map((item) => (
              <li className="marketing-card campaign-day" key={item.day}>
                <div className="campaign-day-heading">
                  <span className="campaign-day-number">Day {String(item.day).padStart(2, "0")}</span>
                  <span className="campaign-channel">{item.channel} · {item.format}</span>
                </div>
                <h3>{item.focus}</h3>
                <p>{item.content}</p>
                <p className="post-action"><strong>Call to action:</strong> {item.action}</p>
              </li>
            ))}
          </ol>
          <ContentActions
            content={campaignCalendarCopy}
            filename="cakematch-14-day-campaign-calendar.txt"
            label="Complete 14-day campaign calendar"
            assetType="campaign_calendar"
            assetTitle="Complete 14-day campaign calendar"
          />
        </section>

        <AbHeadlineTester />
      </div>
      </MarketingAssetsProvider>

      <footer className="site-footer">
        <p>CakeMatch AI — Project created by Camila Gutiérrez</p>
        <p>AI-Native Builder 2026</p>
      </footer>
    </main>
  );
}
