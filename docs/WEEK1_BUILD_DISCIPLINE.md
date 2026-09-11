# Week 1 Build Discipline Packet

## Problem

People planning a celebration may not know whether to order a cake or cupcakes, how much they need, or what flavor and design fits their event and budget.

## Week 1 Goal

I will create a simple Generative Core that gives a demo cake or cupcake recommendation and allows me to save the result.

## In Scope

- A `/core` page
- Form fields for occasion, cake or cupcakes, guests, flavor, style, and budget
- A structured demo recommendation
- Cake size or cupcake quantity
- Suggested flavor and design
- Estimated price
- A short explanation
- Saving results to Supabase
- A small saved-results dashboard
- A prompt library entry in `/docs`
- A mobile-friendly layout

## Out of Scope

- Login
- Payments
- Real orders
- External AI APIs
- Image generation
- Delivery scheduling
- Advanced animations

## Acceptance Criteria

1. The `/core` page renders fields for occasion, product type, guests, flavor, style, and budget. Product type offers cake and cupcakes.
2. Submitting valid inputs displays a clearly labeled demo recommendation with size or quantity, flavor, design, estimated price, and explanation.
3. The recommendation changes appropriately for cake versus cupcakes and reflects the submitted guest count and preferences.
4. Clicking Save inserts the form and recommendation data into `core_outputs` and shows the saved item in the dashboard preview.
5. The page works on mobile and desktop, keeps the existing CakeMatch AI colors, and contains no login, payment, ordering, or external AI API functionality.

## Tech Plan

- **Next.js:** I will use Next.js for the web application and the `/core` route.
- **React:** I will use React to build the form, recommendation state, save action, and dashboard preview.
- **Tailwind CSS:** I will use Tailwind CSS for the responsive layout and styling while keeping the current CakeMatch AI visual direction.
- **Supabase:** I will use Supabase to store and read records from the `core_outputs` table.
- **GitHub:** I will use GitHub to track the work and keep the Week 1 changes reviewable.
- **Vercel:** I will use Vercel as the planned deployment platform for the Next.js application.

## Data Plan

I will use the Supabase table `core_outputs` with these fields:

- `id`
- `created_at`
- `occasion`
- `product_type`
- `guests`
- `flavor`
- `style`
- `budget`
- `recommendation`

## Human Decision

I chose to include both cakes and cupcakes because some celebrations need individual portions. I kept the recommendation as a clearly labeled demo because a paid AI service is too much for this week.
