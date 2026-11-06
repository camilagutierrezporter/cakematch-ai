
# CakeMatch AI — Week 4 Build Discipline Packet
## Marketing Engine + Content System

### 1. Problem Definition

People planning celebrations can have trouble finding the right cake for their event. Independent bakeries can also have trouble reaching new customers.

This week, I want to improve how CakeMatch AI explains its value and create marketing content that can help promote the platform.

### 2. User Definition

CakeMatch AI has two main users:

- People planning birthdays, weddings, and other celebrations who need help choosing a cake or cupcakes.
- Independent bakeries that want to reach more customers.

The marketing page will help organize content for promoting CakeMatch AI to these users.

### 3. Success

By the end of this week:

- The homepage will explain CakeMatch AI more clearly.
- The /marketing page will work.
- The page will show a brand system and target persona.
- It will include landing page copy.
- It will include 10 social media posts.
- It will include 3 video scripts.
- It will include a 14-day campaign calendar.
- Users will be able to compare headlines.
- Users will be able to copy, export, and save marketing content.

### 4. UX Concept

I want the marketing page to be simple and easy to use.

The design will use the same colors as my current website: cream, soft pink, and burgundy.

The page will have clear sections for the brand, target customer, marketing content, headline testing, and saved results.

I will include an image-generated mockup in my final evidence packet and compare it with the finished page.

### 5. Scope Cut

This week, I will not build:

- Paid advertising tools.
- Automatic posting to social media.
- Advanced marketing analytics.
- AI image generation inside the website.
- User accounts or payment features.

I want to focus on the required features and make sure they work correctly.

### 6. Product Spec and Acceptance Criteria

**Homepage**
- Show a clear headline, product description, and call to action.
- Keep the original CakeMatch AI colors and design.
- Include a link to /marketing.

**Marketing Page**
- Open successfully at /marketing.
- Show the brand identity and target persona.
- Show the landing page headline, description, and call to action.
- Display exactly 10 social posts and 3 video scripts.
- Display a complete 14-day campaign calendar.
- Allow users to copy and export marketing content.
- Allow users to save and reload marketing assets.

**A/B Testing**
- Compare two headline options.
- Allow the user to record or compare test results.
- Complete and document two different A/B comparisons.
- Clearly identify simulated results if real visitor data is unavailable.

**Saving**
- Save marketing assets using Supabase.
- Load saved assets when the page is reopened.
- Show an error message if saving fails.

### 7. Architecture Sketch

User
↓
Next.js and React pages
↓
Marketing content cards and A/B tester
↓
Save and load functions
↓
Supabase database

Vercel will host the website.

The marketing content can use prepared templates and editable text. No paid AI API is required.

### 8. Tech Stack

| Tool | Why I will use it |
| --- | --- |
| Next.js / React | Build the homepage and marketing page |
| Tailwind CSS | Help with page styling |
| GitHub | Save code and track changes |
| Vercel | Publish my website |
| Supabase | Save and load marketing assets |
| Codex / Claude Code | Help implement and fix the features |

All tools will use free options.

### 9. DevOps Plan

1. Finish the Build Discipline Packet before coding.
2. Keep the existing features from previous weeks.
3. Make at least 5 meaningful GitHub commits.
4. Create at least 2 Vercel deployments.
5. Use the existing Supabase connection when possible.
6. Check environment variables without sharing secret keys.
7. Test the live website after deployment.
8. Fix any problems and deploy again.

### 10. Test Plan

**A/B Test 1: Homepage headline**
- Compare two headlines about finding the right cake.
- Record the comparison method and results.
- Explain which headline is better supported by the results.

**A/B Test 2: Marketing message**
- Compare a message about easy cake planning with a message about discovering independent bakeries.
- Record the comparison method and results.
- Explain the decision.

**Software Test 1**
- Check that /marketing opens without errors and displays all required content.

**Software Test 2**
- Check that copy and export buttons work correctly.

**Software Test 3**
- Save a marketing asset, refresh the page, and check that the saved asset can be loaded.

After testing, I will document at least one improvement and test it again.

### 11. Coding Agent Implementation Prompt

ROLE: You are my disciplined AI-native product architect and coding partner.

COURSE RULE: Do not start coding until the Build Discipline Packet and acceptance criteria are complete.

TASK: Help me implement Week 4 of CakeMatch AI.

Use my existing Next.js, React, Tailwind, GitHub, Vercel, and Supabase project.

First, review the existing code. Do not remove or break the features from previous weeks.

Upgrade the homepage and create /marketing.

Include:
- Brand system
- Target persona
- Landing page copy
- 10 social posts
- 3 video scripts
- 14-day campaign calendar
- A/B headline tester
- Copy and export buttons
- Saved marketing assets using Supabase

Keep the existing cream, pink, and burgundy colors.

Use free tools only. Do not require paid APIs.

Use prepared or template-based content if necessary and clearly label any simulated AI output or test results.

Build small, testable features. Check the acceptance criteria and fix errors.

Help me document at least 5 meaningful coding prompts, 5 commits, 2 deployments, 2 A/B tests, and 3 software tests.

Explain what changed after testing.

