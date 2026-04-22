# Three.js + WebGL Resume Evolution Roadmap
## From “cool 3D sections” to a seamless game-like portfolio experience

## 1. Purpose of this document

This document is the working strategy for evolving the portfolio from its current state into a more cohesive, performant, story-driven, game-inspired experience.

It now also serves as a running implementation log for:
- architecture decisions already made
- UI layers that were added and later simplified
- performance issues encountered during real local review
- build issues encountered during production validation
- what has been completed
- what is still partial
- what should be implemented next to make the project comprehensive rather than just visually ambitious

It is designed to help you:

- identify what is currently working
- identify what is currently failing
- define a better creative direction
- prioritize implementation in safe phases
- avoid overbuilding something as heavy as `bruno-simon.com`
- track progress, decisions, risks, and validation results over time

This is not just a brainstorm doc. It is meant to be updated as the source of truth while you redesign the experience.

---

## 2. Current situation summary

The portfolio was recently upgraded with Three.js / WebGL elements and a mini-game layer. That already moved the project beyond a standard resume site, but the current setup still has three major problems:

### Problem 1 — The 3D background lacks meaning
Right now, the hero background reads more like “random floating 3D objects” than a deliberate world. Even if the visuals are technically nice, they do not yet communicate a clear narrative about you, your work, or your skills.

### Problem 2 — Performance is not good enough
Scrolling stutters in some sections, and the experience can feel sluggish. That is dangerous for a portfolio because recruiters and hiring managers will judge polish very quickly. If the site feels heavy, the 3D work becomes a liability instead of a differentiator.

### Problem 3 — The game/UI concept is fragmented
The current mini-game exists as a separate thing you launch, rather than feeling like the website itself is a playable, game-like interface. Also, the Three.js presence is section-limited, so the experience does not feel seamless across the whole site.

---

## 3. Core design goal

The goal is **not** to build a full browser game.

The goal is to build a **lightweight, coherent, game-inspired portfolio UI** where:

- the whole site feels like one world
- the 3D layer supports the story instead of distracting from it
- interactions feel playful and intentional
- performance stays smooth on normal laptops
- the portfolio still works as a resume first, experience second

### Target feeling
Think:

- “interactive mission dashboard”
- “navigable developer universe”
- “career journey as a playable map”
- “light game shell around a professional portfolio”

Not:

- physics sandbox
- full 3D driving game
- heavy WebGL demo
- recruiter-hostile experiment

---

## 4. Product vision

### One-sentence vision
Build a portfolio that feels like a **developer mission control interface**, where scrolling and interaction move the visitor through your skills, experience, and projects as if they are progressing through a game world.

### Experience pillars

#### Pillar A — Narrative coherence
Every visual element should map to something real:
- stars = opportunities / exploration
- nodes = skills
- routes = career progression
- project zones = missions
- ship/avatar = your developer identity
- collectibles = technologies / achievements

#### Pillar B — Seamless continuity
The site should feel like one connected environment, not separate sections with unrelated effects.

#### Pillar C — Performance-first immersion
If an effect hurts scroll smoothness, it fails the portfolio test.

#### Pillar D — Resume clarity
A recruiter should still be able to:
- understand who you are in under 10 seconds
- scan your experience quickly
- find projects and contact info easily
- ignore the playful layer if they want

---

## 5. Recommended creative direction

## Chosen direction: “Mission Control / Career Galaxy”

This is the strongest direction because it matches what already exists and can be improved without rebuilding everything from zero.

### Concept
The portfolio is a navigable “career galaxy” or “mission control” interface.

You are represented by a ship / signal / cursor-guided explorer moving through a structured world:
- **Hero** = launch bay / mission start
- **About** = identity profile / pilot dossier
- **Skills** = constellation map
- **Experience** = route through completed missions
- **Projects** = mission cards / unlocked sectors
- **Contact** = docking / transmission terminal

### Why this works
It gives meaning to the 3D layer:
- floating objects become landmarks, not random decoration
- movement becomes progression
- the mini-game becomes part of the world logic
- section transitions can feel like moving through one map

### What to avoid
Avoid mixing too many themes:
- cyberpunk dashboard + fantasy world + arcade shooter + abstract geometry
- random 3D icons with no semantic role
- multiple visual metaphors fighting each other

Pick one world language and stay disciplined.

---

## 6. What is already good and should be preserved

The current implementation already has useful building blocks.

### Keep / refine
- Hero Three.js background as the main immersive entry point
- Skill constellation concept
- Persistent ship continuity idea
- 2D canvas mini-game approach instead of another heavy WebGL game
- CSS/SVG hologram previews instead of per-card WebGL canvases
- DOM-first content for accessibility and SEO
- adaptive DPR and reduced WebGL scope

### Why preserve these
These choices already move in the right direction:
- they reduce GPU pressure
- they keep content readable
- they avoid the worst multi-canvas performance traps
- they provide a foundation for a more unified experience

---

## 7. Main diagnosis of the current UX issues

## 7.1 Why the hero feels random
The current hero has:
- galaxy particles
- floating wireframe glyphs
- story nodes
- a mini ship

Individually these are fine, but together they still risk reading as “visual effects” rather than “world design.”

### Root cause
There is not yet a strong enough semantic mapping between:
- object type
- object placement
- section meaning
- user progression

### Fix
Every visible object in the hero should answer:
- what is it?
- why is it here?
- what does it represent?
- how does it connect to the rest of the site?

---

## 7.2 Why performance still struggles
Likely causes include:
- continuous render loops
- bloom/postprocessing cost
- multiple animated systems running at once
- expensive scroll + animation overlap
- too much always-on motion even when offscreen
- React state updates mixed with animation-heavy sections
- large particle counts on weaker devices

### Root cause
The site still behaves like several animated experiences stacked together, instead of one carefully budgeted system.

### Fix
Move to a strict performance budget:
- one primary WebGL canvas for the global world
- one optional lightweight 2D game overlay
- pause or degrade effects when offscreen
- reduce postprocessing
- prefer shader-light / geometry-light visuals
- use CSS transforms where possible
- only animate what contributes meaning

---

## 7.3 Why the game concept feels disconnected
The mini-game is currently launched separately, so it feels like an extra feature rather than the site’s interaction model.

### Root cause
The game loop and the portfolio navigation are not yet conceptually integrated.

### Fix
Turn the site into a **game-like shell**, not a separate game:
- scrolling = travel
- hovering = scanning
- clicking = entering missions
- project cards = mission terminals
- mini-game = optional challenge mode inside the same world

---

## 8. Strategic direction: what the final experience should become

## 8.1 High-level UX model

### Layer 1 — Resume layer
The actual content:
- headings
- text
- achievements
- project details
- contact actions

This must remain clean and readable.

### Layer 2 — World layer
A persistent visual system behind and around the content:
- starfield / route lines / beacons / ship / subtle parallax
- one shared visual language across sections

### Layer 3 — Interaction layer
Game-like affordances:
- scanning
- unlocking
- route progression
- mission states
- optional challenge interactions

### Layer 4 — Optional mini-game layer
A focused overlay or embedded challenge that feels native to the world.

---

## 8.2 Final target behavior by section

### Hero — “Launch Sequence”
Current issue:
- visually interesting but not meaningful enough

Target:
- the visitor enters a launch bay / mission map
- the ship is central and purposeful
- visible beacons correspond to later sections
- subtle labels or route hints imply where the journey goes next

Recommended changes:
- replace random glyph distribution with named world landmarks
- add faint route lines from hero to later section anchors
- make the ship orientation and movement feel like “navigation”
- reduce object count, increase intentionality
- add one short line of copy that frames the experience:
  - “Navigate my work, systems, and shipped products.”
  - or “A developer portfolio presented as a mission map.”

### About — “Pilot Profile”
Target:
- this section should feel like a dossier or profile terminal
- use subtle UI framing, not heavy 3D

Recommended changes:
- keep mostly DOM/CSS
- add subtle world continuity in the background
- use profile card / system panel styling
- show identity, strengths, and focus areas as “core systems”

### Skills — “Constellation Map”
Current issue:
- good concept, but it should connect more clearly to the rest of the world

Target:
- skills are discoverable nodes in a structured map
- categories feel like sectors or systems
- the same colors and labels should appear elsewhere in the site

Recommended changes:
- connect skill clusters to hero beacons
- reduce unnecessary motion
- add “scan” behavior on hover/focus
- use the same taxonomy everywhere:
  - frontend
  - backend
  - desktop/3D
  - databases
  - tools
  - languages

### Experience — “Career Route”
Current issue:
- currently more performant, but not fully integrated into the world metaphor

Target:
- experience should feel like a route through completed missions
- each role is a checkpoint on a path

Recommended changes:
- keep this mostly CSS/DOM for performance
- visually connect entries with route lines, checkpoints, and status markers
- use language like:
  - mission completed
  - systems built
  - impact delivered
- do not overdo the game language; keep it professional

### Projects — “Mission Select”
Current issue:
- project cards are good candidates for game UI, but they need stronger integration

Target:
- each project card feels like a mission terminal or unlocked sector
- previews feel alive without needing WebGL per card

Recommended changes:
- keep CSS/SVG hologram previews
- add mission metadata:
  - stack
  - role
  - impact
  - status
- add hover states like “inspect mission”
- optionally add a project progression map above the grid

### Contact — “Transmission Terminal”
Target:
- final section feels like docking / communication terminal
- simple, polished, low-cost

Recommended changes:
- terminal-inspired UI
- subtle animated signal lines or scan pulse
- clear CTA hierarchy:
  - email
  - LinkedIn
  - GitHub
  - resume download

---

## 9. Recommended architecture shift

## Move from “section-specific 3D scenes” to “one persistent world system”

This is the most important strategic change.

### Current pattern
- hero has one 3D scene
- skills has another 3D scene
- game is separate
- continuity is simulated

### Better pattern
Use one persistent background world system across the site, then let sections reveal different overlays and interaction states.

### Benefits
- stronger continuity
- fewer context switches
- easier performance budgeting
- more coherent storytelling
- easier to make the site feel like one game-like interface

### Practical interpretation
This does **not** mean a giant full-screen 3D app with complex physics.

It means:
- one lightweight persistent canvas
- section-aware states
- DOM content layered above it
- optional local enhancements only where justified

---

## 10. Performance strategy

This project will fail if performance is not treated as a first-class feature.

## 10.1 Performance principles

### Principle 1 — Scroll smoothness beats visual complexity
If an effect causes scroll jank, remove or simplify it.

### Principle 2 — Persistent low-cost world beats many local expensive scenes
One cheap global system is better than many isolated expensive systems.

### Principle 3 — Motion should be sparse and meaningful
Not everything needs to move all the time.

### Principle 4 — DOM content should do the heavy information work
Use WebGL for atmosphere, spatial metaphor, and delight.
Use DOM/CSS for content, readability, and most UI.

---

## 10.2 Concrete performance rules

- Keep only one main WebGL canvas active for the page background
- Avoid per-card WebGL canvases
- Avoid multiple bloom-heavy scenes
- Reduce particle counts further on low-end devices
- Pause or reduce animation when tab is hidden
- Reduce animation intensity when sections are offscreen
- Prefer `frameloop="demand"` where realistic
- Use intersection/visibility logic to disable nonessential updates
- Cap DPR aggressively on weaker devices
- Consider disabling bloom entirely on mobile / low-power mode
- Avoid expensive transparent overdraw where possible
- Keep geometry simple and counts low
- Avoid large texture dependencies unless compressed and necessary

---

## 10.3 Suggested quality tiers

### Tier A — High capability devices
- persistent world canvas
- subtle bloom
- richer particles
- ship trail
- section transitions
- constellation interactions

### Tier B — Mid capability devices
- persistent world canvas
- no bloom or reduced bloom
- fewer particles
- simplified trail
- reduced animation frequency

### Tier C — Low capability / mobile fallback
- CSS gradient / starfield fallback
- no heavy WebGL interactions
- optional static or lightly animated ship
- mini-game disabled or simplified if needed

---

## 11. Proposed implementation roadmap

## Phase 0 — Define the world language
### Goal
Stop random visuals and establish a coherent visual grammar.

### Deliverables
- choose one theme: `Mission Control / Career Galaxy`
- define color roles
- define object roles
- define section metaphors
- define copy tone

### Output
A short design spec covering:
- what stars mean
- what nodes mean
- what routes mean
- what the ship means
- what project cards mean
- what labels/statuses mean

### Success criteria
You can explain every major visual element in one sentence.

---

## Phase 1 — Rebuild the hero around meaning
### Goal
Turn the hero from “random 3D coolness” into a clear launch scene.

### Tasks
- reduce random floating glyphs
- replace them with intentional landmarks
- align beacon positions with actual section categories
- add subtle route lines or mission arcs
- make the ship the focal point
- add one line of copy framing the experience
- simplify postprocessing

### Success criteria
A first-time visitor should feel:
- this is a world
- this world represents the developer
- the rest of the page is connected to it

---

## Phase 2 — Introduce a persistent world layer
### Goal
Make the site feel seamless.

### Tasks
- create one persistent background system across the page
- keep DOM sections above it
- make section changes update the world state
- use scroll position to shift emphasis, not spawn entirely new scenes
- keep the persistent ship or evolve it into a section-aware navigator

### Example behaviors
- hero: launch beacons visible
- about: profile grid / signal pulse emphasized
- skills: constellation nodes brighten
- experience: route path highlights
- projects: mission sectors activate
- contact: transmission beacon pulses

### Success criteria
The site feels like one continuous environment.

---

## Phase 3 — Convert the mini-game into a native world mechanic
### Goal
Make the game feel integrated instead of separate.

### Recommended direction
Keep the current 2D canvas game architecture, but reposition it conceptually.

### Better framing
Instead of “launch mini-game,” make it:
- “challenge mode”
- “skill collection run”
- “systems calibration”
- “mission sprint”

### Integration ideas
- collectibles correspond to actual skills on the site
- score summary links back to projects or skills
- game unlocks a fun badge or alternate UI state
- game can be launched from hero, navbar, or project terminal
- game visuals reuse the same palette and world language

### Success criteria
The game feels like part of the portfolio universe, not a detached arcade widget.

---

## Phase 4 — Make projects the strongest game-like UI section
### Goal
This is where the game-inspired design should shine most.

### Tasks
- redesign project cards as mission terminals
- add status chips:
  - shipped
  - production
  - prototype
  - desktop
  - full-stack
- add “inspect mission” CTA language
- add mission metadata layout
- add subtle scan-line / hologram / targeting UI
- optionally add a mission map overview above the cards

### Success criteria
Projects become the clearest payoff of the game-inspired concept.

---

## Phase 5 — Add section-aware progression and feedback
### Goal
Make navigation feel like progression through a world.

### Tasks
- track active section
- update background emphasis based on section
- animate route progress subtly as user scrolls
- highlight current “sector”
- optionally show a compact progress HUD

### Example HUD
- current sector
- mission progress
- active system
- challenge mode button

### Success criteria
Scrolling feels like traversal, not just page movement.

---

## Phase 6 — Accessibility and recruiter mode
### Goal
Ensure the site remains usable and professional.

### Tasks
- preserve semantic HTML
- ensure keyboard navigation works
- provide reduced motion behavior
- ensure game overlay is dismissible
- ensure content is readable without interacting with 3D
- optionally add a “minimal mode” toggle

### Success criteria
The portfolio still works excellently as a resume.

---

## 12. Recommended feature set for the next version

## Must-have
- coherent world theme
- meaningful hero scene
- persistent world continuity
- improved performance budget
- integrated game framing
- stronger project mission UI
- section-aware transitions

## Nice-to-have
- compact HUD
- unlockable easter egg
- recruiter/minimal mode
- sound toggle with subtle UI audio
- progress map overview

## Avoid for now
- physics-heavy 3D navigation
- full 3D character controller
- complex collision world across the whole page
- many independent canvases
- texture-heavy cinematic scenes
- anything that makes mobile miserable

---

## 13. Detailed implementation strategy

## 13.1 UX strategy
Use a **70 / 20 / 10 split**:

- 70% clean professional portfolio
- 20% game-like UI framing
- 10% delight / surprise

That balance keeps the site impressive without becoming gimmicky.

---

## 13.2 Visual strategy
### Use fewer objects, but make them more meaningful
Replace:
- many random floating meshes

With:
- a few named beacons
- route lines
- sector markers
- one ship/avatar
- one consistent starfield language

### Visual consistency rules
- amber = primary mission / identity / highlights
- cyan = systems / frontend / signal / interaction
- emerald = backend / stability / completed systems
- dark slate = space / control room / contrast base

---

## 13.3 Interaction strategy
### Primary interactions
- scroll = travel
- hover = inspect
- click = enter / inspect mission
- game launch = challenge mode

### Secondary interactions
- ship follows cursor subtly
- section transitions update world emphasis
- project cards feel like terminals
- skill nodes feel scannable

### Avoid
- forcing users to “play” to access content
- hidden essential information
- overcomplicated controls

---

## 13.4 Technical strategy
### Recommended architecture
- one persistent background canvas
- section state manager
- DOM-first content sections
- CSS/SVG for most card-level effects
- 2D canvas for challenge mode
- progressive enhancement based on device capability

### State model
Track:
- active section
- device capability tier
- reduced motion preference
- game active/inactive
- world emphasis mode

### Rendering model
- persistent world scene updates minimally
- section-specific emphasis changes are data-driven
- expensive effects disabled on low-end devices
- no unnecessary rerenders from React state churn

---

## 14. Suggested backlog

## Immediate backlog
- [ ] define final world metaphor and naming
- [ ] audit all current 3D elements and assign meaning
- [ ] remove any hero objects that do not support the story
- [ ] reduce hero visual noise
- [ ] document section metaphors
- [ ] define performance budget targets

## Short-term backlog
- [ ] create persistent world layer concept
- [ ] make section-aware background states
- [ ] redesign projects as mission terminals
- [ ] integrate game language into hero/navbar/projects
- [ ] add section progression logic
- [ ] add reduced-motion / low-power fallbacks

## Mid-term backlog
- [ ] add compact HUD
- [ ] add mission map overview
- [ ] add recruiter/minimal mode
- [ ] add analytics for interaction usage
- [ ] tune challenge mode onboarding and balance

---

## 15. Suggested performance acceptance criteria

Use these as practical targets.

### Baseline targets
- smooth scrolling on a normal laptop
- no obvious stutter when entering animated sections
- no major frame drops from project grid visibility
- no input lag in the game overlay
- acceptable mobile fallback behavior

### Engineering targets
- one main WebGL context for the page
- no per-project WebGL canvases
- reduced postprocessing on weaker devices
- no unnecessary always-on heavy animation offscreen
- stable interaction responsiveness during scroll

---

## 16. Risks and mitigation

## Risk 1 — Overbuilding
You may be tempted to chase a full Bruno Simon-style experience.

### Mitigation
Keep repeating:
this is a portfolio with game-inspired UX, not a full game.

---

## Risk 2 — Style over clarity
The site may become visually impressive but harder to scan.

### Mitigation
Every section must still pass a recruiter skim test.

---

## Risk 3 — Performance regression
New continuity features may reintroduce jank.

### Mitigation
Add changes in phases and validate performance after each phase.

---

## Risk 4 — Theme inconsistency
Different sections may drift into different visual languages.

### Mitigation
Use this document as the source of truth for metaphor, palette, and interaction rules.

---

## 17. Decision log

Use this section as the project evolves.

### Decision template
- **Date**:
- **Decision**:
- **Reason**:
- **Impact**:
- **Follow-up**:

### Entries
- **Date**: TBD
- **Decision**: Use `Mission Control / Career Galaxy` as the primary metaphor
- **Reason**: Best fit for current implementation and easiest path to coherence
- **Impact**: Hero, skills, projects, and game should all align to this language
- **Follow-up**: Create section-level naming and UI vocabulary

---

## 18. Progress tracker

## Overall status
- Theme definition: `In progress and now visible in multiple sections`
- Hero coherence pass: `Implemented, expanded, simplified, and now split by lite/heavy mode`
- Persistent world layer: `Implemented first lightweight version, then toned down, and now disabled in lite mode`
- Performance optimization pass: `In progress with clearer root-cause findings`
- Game integration pass: `Partially started at the shell/language level and renamed toward challenge mode`
- Project mission UI redesign: `Implemented first major pass`
- Accessibility/recruiter mode: `Implemented first pass and evolved into lite/heavy mode`
- Shared world-state provider: `Implemented first pass`
- Build stability: `Encountered and fixed one Tailwind utility issue`
- Rendering mode split: `Implemented first pass with explicit Lite Mode and Heavy Mode`

## Milestone tracker
| Milestone | Status | Owner | Notes |
|---|---|---|---|
| Define world language | In progress | You | `Mission Control / Career Galaxy` selected as the guiding metaphor and now reflected in Hero, About, Experience, Projects, Contact, HUD, overlay, and shell language |
| Hero redesign for meaning | In progress | You | Hero scene refactored around semantic landmarks, route lines, mission-map copy, capability-aware tuning, shell simplification, and now a lite-mode CSS fallback; still needs stronger visual validation in heavy mode |
| Persistent world continuity | In progress | You | First lightweight persistent overlay, HUD, progress dock, and section-aware ship behavior are implemented; the shell was later simplified after local review showed visual overload and is now disabled in lite mode |
| Performance budget pass | In progress | You | Root cause is now clearer: the hero WebGL scene and the skills WebGL scene are the main heavy regions; lite mode removes both, but heavy mode still needs deeper optimization |
| Game integration strategy | In progress | You | The shell now uses challenge-mode language in navigation and status UI, but the game itself still behaves like a separate overlay and needs deeper integration with rewards, onboarding, and portfolio flow |
| Projects as mission terminals | Implemented first pass | You | Projects section and cards now use mission-terminal framing, richer metadata, and inspect-oriented CTAs; performance issue is not WebGL here, but section load/scroll cost still needs investigation |
| Contact as transmission terminal | Implemented first pass | You | Contact section now matches the world metaphor and acts like a closing communication terminal |
| Accessibility and reduced motion | Implemented first pass | You | Reduced-motion-aware rendering exists in hero and skills, and recruiter mode evolved into lite/heavy mode; a full accessibility audit is still pending |
| Shared world-state provider | Implemented first pass | You | A shared provider now centralizes world state for multiple components and reduces duplicated section-state subscriptions |
| Lite / Heavy mode split | Implemented first pass | You | Lite mode now disables the hero WebGL scene, the skills WebGL scene, immersive shell layers, persistent ship, and challenge overlay; heavy mode keeps the immersive experience |
| Build stability and CSS hygiene | In progress | You | A Tailwind/PostCSS build failure was encountered and fixed; more build validation is still recommended |

---

## 19. Recommended next actions

If you want the smartest order of execution, do this next:

### Step 1
Finalize the world metaphor and naming system.

### Step 2
Redesign the hero so every object has meaning.

### Step 3
Plan a persistent world layer instead of isolated section scenes.

### Step 4
Do a dedicated performance pass before adding more visual complexity.

### Step 5
Redesign projects as the main “game UI payoff” section.

### Step 6
Reframe the mini-game as an integrated challenge mode.

---

## 20. Practical next sprint plan

## Sprint 1 — Coherence + cleanup
### Goals
- remove randomness
- improve meaning
- reduce noise

### Tasks
- audit hero objects
- remove non-semantic meshes
- map beacons to real categories
- simplify bloom and particle density
- write section metaphor labels

### Done when
The hero clearly communicates a structured world.

---

## Sprint 2 — Seamless continuity
### Goals
- make the site feel connected

### Tasks
- define active section state
- create persistent world behavior
- connect hero beacons to later sections
- make ship continuity section-aware

### Done when
The site feels like one environment.

---

## Sprint 3 — Game-native UI
### Goals
- integrate the challenge mode and mission UI

### Tasks
- rename/reframe mini-game
- redesign project cards as mission terminals
- add mission metadata and inspect states
- connect game rewards to portfolio content

### Done when
The game-like concept feels intentional and unified.

---

## 21. Final recommendation

The right move is **not** to add more random Three.js content.

The right move is to:
- reduce randomness
- increase meaning
- unify the world
- keep one lightweight persistent visual system
- make projects and navigation feel game-like
- preserve resume clarity
- treat performance as a design constraint

If you execute this well, the portfolio can feel:
- memorable
- polished
- technically ambitious
- recruiter-friendly
- distinctly yours

That is the sweet spot.

---

## 22. Update log

### v1
Initial roadmap created to guide the transition from fragmented 3D sections into a seamless, performant, game-inspired portfolio UI.

### v2
Added technical architecture, system responsibilities, data flow, and a Sprint 1 implementation plan focused on hero coherence, semantic world-building, and performance-safe cleanup.

### v3
Updated roadmap progress tracking to reflect Sprint 1 first-pass implementation. Hero scene semantics were refactored around section landmarks and route lines, hero copy was reframed around the mission-map concept, and performance tuning remains an active follow-up because the local result still feels too close to the previous experience.

### v4
Expanded the implementation record substantially. Added section-aware world-state architecture, a lightweight persistent world overlay, a visible mission-control HUD, a route-progress rail, section-aware persistent ship behavior, a hero world-status banner, a pilot-profile About section, mission-terminal Projects UI, a transmission-terminal Contact section, and capability-aware performance fallbacks for the hero and skills scenes. Also recorded a production build issue caused by an invalid Tailwind utility (`border-white/8`) and its fix (`border-white/10`).

### v5
Recorded the next major integration pass. Added a shared world-state provider, implemented recruiter mode as a simplified portfolio view, reframed the game trigger language toward `Challenge Mode`, simplified the shell after local visual review showed that the site looked broken and over-layered, replaced the large left route rail with a compact bottom progress dock, simplified the top HUD, simplified the hero status banner, and documented that the persistent overlay and shell UI had to be toned down because they were overpowering the actual portfolio content.

### v6
Recorded the first explicit performance-mode split. Recruiter mode evolved into a real `Lite Mode / Heavy Mode` system. Lite mode now disables the hero WebGL scene, disables the skills WebGL scene, disables immersive shell layers, disables the persistent ship, and prevents the challenge overlay from mounting. Heavy mode keeps the immersive experience. Local testing also clarified the main performance findings: the skills 3D constellation is expensive during load and while scrolling through that region, and the projects section still feels slow in heavy mode even though the hologram itself is CSS/SVG-based, which suggests the remaining issue there is broader section/rendering cost rather than per-card WebGL.

---

## 23. Technical architecture
## Goal
Define a practical engineering architecture that supports:
- one coherent world language
- future persistent world continuity
- low-risk incremental implementation
- strong performance discipline
- DOM-first resume usability

This architecture is intentionally lighter than a full interactive 3D application. It is designed for a portfolio, not a game engine.

---

## 23.1 Architecture principles

### Principle A — One world, many states
The site should behave like one world system whose emphasis changes by section, rather than many unrelated scenes.

### Principle B — DOM owns content, WebGL owns atmosphere
The DOM should continue to render:
- headings
- body copy
- cards
- buttons
- forms
- semantic structure

The WebGL layer should render:
- spatial mood
- beacons
- route lines
- starfield
- ship presence
- subtle world transitions

### Principle C — Section awareness should be data-driven
The world should react to section changes through a small state model, not through hardcoded one-off scene logic spread everywhere.

### Principle D — Performance budgets are architectural constraints
Performance should not be treated as a later polish pass. It must shape:
- scene complexity
- animation frequency
- postprocessing usage
- fallback behavior
- device-tier behavior

---

## 23.2 Target system layers

### Layer 1 — Content layer
This is the existing React section structure:
- `Hero`
- `About`
- `Skills`
- `Experience`
- `Projects`
- `Contact`

Responsibilities:
- semantic content
- recruiter readability
- accessibility
- SEO
- CTA flow

### Layer 2 — World orchestration layer
This is the future coordination layer that decides:
- which section is active
- which world mode is emphasized
- whether challenge mode is active
- whether reduced motion / low power mode is active
- what quality tier should be used

Responsibilities:
- section state
- capability state
- world mode state
- transition timing
- feature gating

### Layer 3 — World rendering layer
This is the Three.js / WebGL layer.

Responsibilities:
- starfield
- beacons
- route lines
- ship presence
- subtle ambient motion
- section emphasis changes

### Layer 4 — Local enhancement layer
This includes:
- CSS/SVG holograms
- timeline route styling
- terminal UI effects
- scan lines
- card hover states

Responsibilities:
- section-level polish without extra WebGL contexts
- low-cost visual reinforcement of the world metaphor

### Layer 5 — Challenge mode layer
This is the current 2D canvas game overlay.

Responsibilities:
- optional challenge interaction
- world-consistent palette and terminology
- no interference with core resume usability

---

## 23.3 Recommended module architecture

### Current useful modules
The current codebase already has good building blocks:
- `src/three/scenes/HeroScene.tsx`
- `src/three/scenes/SkillConstellation.tsx`
- `src/three/game/DevSprintGame.tsx`
- `src/components/PersistentShip.tsx`
- `src/three/utils/colorPalette.ts`
- `src/three/utils/geometryHelpers.ts`

### Recommended future architecture
Use the following conceptual split:

- `world config`
- `world state`
- `world scene primitives`
- `section mapping`
- `capability / performance policy`
- `challenge mode integration`

### Proposed structure
- `src/three/world/`
  - `worldConfig.ts`
  - `worldTypes.ts`
  - `sectionWorldMap.ts`
  - `useWorldState.ts`
  - `capabilityTier.ts`
- `src/three/primitives/`
  - `Starfield.tsx`
  - `BeaconNodes.tsx`
  - `RouteLines.tsx`
  - `ShipPresence.tsx`
  - `SectorLabels.tsx`
- `src/three/scenes/`
  - `HeroScene.tsx` stays as the current launch scene
  - future persistent scene can evolve from the same visual language
- `src/components/world/`
  - `WorldHUD.tsx`
  - `SectionProgress.tsx`
  - `ChallengeModeEntry.tsx`

This does not all need to be built now. It is the target architecture so future work stays organized.

---

## 23.4 World state model

### Minimum state model
The world system should eventually track:

- `activeSection`
- `previousSection`
- `isChallengeModeActive`
- `isReducedMotion`
- `capabilityTier`
- `worldTheme`
- `worldIntensity`

### Suggested type shape
Use a simple model like:

- `activeSection`: `home | about | skills | experience | projects | contact`
- `capabilityTier`: `high | medium | low`
- `worldIntensity`: `full | reduced | minimal`

### Why this matters
Without a shared state model, the site will keep drifting into isolated effects and duplicated logic.

---

## 23.5 Section-to-world mapping

Each section should map to a world emphasis mode.

### Home
World mode:
- launch sequence
- visible beacons
- route preview
- strongest ship presence

### About
World mode:
- profile signal
- calmer background
- subtle grid / scan pulse
- low motion

### Skills
World mode:
- constellation emphasis
- brighter skill nodes
- scan/inspect affordances

### Experience
World mode:
- route progression
- checkpoint emphasis
- completed mission tone

### Projects
World mode:
- mission select
- sector activation
- terminal / hologram reinforcement

### Contact
World mode:
- transmission beacon
- docking / terminal tone
- low-noise finish

This mapping should eventually live in one configuration file instead of being implied across many components.

---

## 23.6 Rendering strategy

### Near-term rendering model
For now, keep:
- `HeroScene` as the main immersive WebGL scene
- `SkillConstellation` as a secondary scene
- `PersistentShip` as continuity support
- `DevSprintGame` as the challenge overlay

### Mid-term rendering model
Move toward:
- one persistent world canvas
- section-aware emphasis changes
- fewer isolated scene responsibilities
- more CSS/SVG for local section polish

### Why not force the persistent canvas immediately
Because the safest path is:
1. fix meaning
2. reduce noise
3. improve performance
4. then unify architecture

That avoids a risky rewrite before the visual language is stable.

---

## 23.7 Performance architecture policy

### Hard rules
- no per-card WebGL canvases
- no new heavy postprocessing stacks
- no decorative 3D objects without semantic purpose
- no always-on expensive animation if it does not support the story
- no section-level WebGL additions unless they outperform CSS/SVG alternatives in value

### Soft rules
- prefer fewer, larger semantic elements over many tiny decorative ones
- prefer opacity/transform-based UI polish over render-loop-heavy effects
- prefer static geometry with subtle motion over many independently animated meshes
- prefer capability-tier degradation over one-size-fits-all rendering

### Current likely hotspots
Based on the current implementation, the main likely hotspots are:
- hero particle count
- bloom cost
- multiple animated glyph floats
- always-on constellation rendering
- overlapping motion systems during scroll

---

## 23.8 Capability-tier strategy

### High tier
Use:
- richer starfield
- route lines
- ship trail
- subtle bloom
- more ambient motion

### Medium tier
Use:
- reduced particles
- reduced bloom or no bloom
- fewer animated landmarks
- simplified trail

### Low tier
Use:
- CSS fallback backgrounds where needed
- minimal ship continuity
- no expensive postprocessing
- reduced or disabled secondary 3D interactions

### Inputs for tiering
Eventually capability tier can be inferred from:
- viewport width
- pointer type
- reduced motion preference
- measured frame stability
- device memory / hardware hints where safe and available

---

## 23.9 Responsibility map for current components

### `HeroScene.tsx`
Current role:
- launch scene
- strongest immersive moment
- world language prototype

Future role:
- source of truth for visual language
- basis for persistent world primitives

### `SkillConstellation.tsx`
Current role:
- isolated skill map

Future role:
- either remain a focused section scene
- or donate its node/cluster logic to a persistent world system

### `PersistentShip.tsx`
Current role:
- continuity bridge

Future role:
- section-aware navigator / world avatar indicator

### `DevSprintGame.tsx`
Current role:
- separate mini-game overlay

Future role:
- challenge mode inside the same world language

### `colorPalette.ts`
Current role:
- visual consistency token source

Future role:
- continue as the palette source of truth

### `geometryHelpers.ts`
Current role:
- reusable geometry math

Future role:
- continue as low-level world primitive support

---

## 23.10 Data flow recommendation

### Current practical flow
- scroll changes visible section
- shared world state now tracks active section and previous section
- multiple shell components consume the same world-state source
- hero and skills still own their own scene logic, but now receive or consume shared world state
- game state is still isolated in its own provider, but challenge-mode activity is now passed into the world-state layer

### Recommended future flow
- section observer determines active section
- world state updates once
- world renderer adjusts emphasis
- local DOM sections respond visually
- challenge mode overlays without breaking world continuity

### Desired flow summary
`scroll/visibility -> activeSection -> worldState -> world emphasis + local UI emphasis`

This is the key architectural shift.

---

## 23.11 Technical debt to avoid

Avoid introducing:
- duplicated section naming across many files
- hardcoded colors outside palette tokens
- one-off animation constants scattered everywhere
- new decorative meshes with no semantic role
- more independent render loops than necessary
- recruiter-critical content hidden behind interaction
- shell UI layers that visually overpower the actual portfolio content
- multiple large floating panels on the same screen without a strict hierarchy

---

## 24. Sprint 1 implementation plan
## Sprint name
Hero Coherence + Semantic World Cleanup

## Sprint goal
Transform the current hero from “random cool 3D background” into a clearer launch scene with meaningful landmarks, lower visual noise, and safer performance characteristics.

This sprint is intentionally narrow. It does not attempt the persistent world rewrite yet.

---

## 24.1 Sprint 1 scope

### In scope
- define semantic meaning for current hero objects
- reduce or replace random glyphs
- align hero landmarks with actual portfolio categories
- introduce route logic visually
- simplify visual noise
- reduce likely performance cost where possible
- update roadmap/progress tracking

### Out of scope
- full persistent world canvas
- full section-aware world state system
- complete game integration rewrite
- major redesign of all sections
- full capability-tier implementation across the app

---

## 24.2 Sprint 1 design target

After Sprint 1, the hero should read as:

- a launch map
- a structured developer universe
- a preview of the rest of the portfolio
- a cleaner and more intentional scene

A visitor should be able to feel:
- there is a ship
- there are destinations
- those destinations represent real parts of the portfolio
- the scene is guiding them somewhere

---

## 24.3 Sprint 1 implementation strategy

### Step 1 — Rename the hero mental model
Treat the hero as:
- launch bay
- mission map
- route preview

Not:
- abstract particle playground

### Step 2 — Audit every hero object
For each object currently in `HeroScene`, answer:
- what does it represent?
- does the user need it?
- does it support the world metaphor?
- is it worth its render cost?

If the answer is weak, remove or simplify it.

### Step 3 — Replace random glyph logic with landmark logic
The current floating glyphs are the biggest source of “randomness.”

Replace the mental model:
- from random wireframe shapes
- to intentional landmarks / sector markers

Examples:
- frontend beacon ring
- backend core node
- desktop/3D structure marker
- database relay
- tools satellite
- language anchor

The exact geometry can still be abstract, but the placement and role should be intentional.

### Step 4 — Add route preview cues
The hero should preview the journey through the site.

Add:
- faint route lines between major beacons
- a subtle path from ship origin toward the network
- optional low-opacity labels or directional hints

### Step 5 — Reduce visual competition
The ship, beacons, particles, glyphs, and bloom should not all compete equally.

Priority should be:
1. ship
2. beacons / route
3. starfield / particles
4. secondary ambient geometry

### Step 6 — Lower likely performance cost
Reduce:
- particle count if still visually dense
- number of floating glyphs
- bloom intensity
- unnecessary float/rotation intensity
- any animation that does not reinforce the launch scene

---

## 24.4 Sprint 1 concrete code tasks

### Task A — Introduce semantic landmark definitions
Refactor hero object definitions so they are described by role, not just shape.

Instead of thinking:
- `GLYPH_DEFS`

Move toward:
- `LANDMARK_DEFS`
- each with:
  - `id`
  - `label`
  - `section`
  - `position`
  - `shape`
  - `color`
  - `scale`
  - `motionProfile`

### Task B — Reduce landmark count
Target:
- 4 to 6 meaningful landmarks
- not 8 decorative floating objects

### Task C — Add route line primitive
Create a lightweight line system connecting:
- ship origin
- major beacons
- section destinations

This should be subtle and low-opacity.

### Task D — Tune particle field
Target:
- enough atmosphere to feel alive
- not enough density to distract from landmarks

### Task E — Tune bloom and motion
Reduce bloom and float intensity until the scene feels crisp instead of hazy.

### Task F — Update hero copy
Add one line in the hero content that frames the experience as a mission map / navigable developer world.

---

## 24.5 Sprint 1 recommended file touch list

### Primary file
- `src/three/scenes/HeroScene.tsx`

### Likely supporting files
- `src/components/Hero.tsx`
- `src/three/utils/colorPalette.ts`
- `src/three/utils/geometryHelpers.ts`

### Optional documentation updates
- this roadmap file
- future architecture notes if implementation decisions change

---

## 24.6 Sprint 1 acceptance criteria

### UX acceptance
- the hero no longer feels random
- the hero clearly suggests destinations / structure
- the ship feels central to the scene
- the scene better previews the rest of the portfolio

### Visual acceptance
- fewer but more meaningful objects
- clearer hierarchy of attention
- less clutter
- more coherent palette usage

### Performance acceptance
- no worse than current hero performance
- ideally improved smoothness due to reduced object noise
- no new heavy rendering systems introduced

### Product acceptance
- still recruiter-friendly
- still readable
- still impressive without becoming gimmicky

---

## 24.7 Sprint 1 implementation checklist

- [x] define landmark roles for hero objects
- [x] reduce decorative glyph count
- [x] rename hero object model around landmarks/sectors
- [x] connect beacons with subtle route lines
- [x] tune particle density
- [x] tune bloom intensity
- [x] tune float/rotation intensity
- [x] update hero copy to frame the world
- [ ] validate readability over the scene
- [ ] validate scroll smoothness after changes
- [x] add stronger capability-aware hero fallbacks after first-pass feedback
- [x] document that the first-pass visual difference was not strong enough in local review

---

## 24.8 Sprint 1 validation plan

### Visual review
Check:
- does the hero read as a world map?
- can you explain each major object?
- does the scene feel guided rather than random?

### Performance review
Check:
- scroll into and out of hero
- idle on hero for 20–30 seconds
- move cursor aggressively
- test on smaller laptop viewport
- compare before/after smoothness subjectively

### Resume review
Check:
- can a recruiter still understand the page immediately?
- is the text still dominant enough?
- are CTAs still obvious?

---

## 24.9 Sprint 1 risks

### Risk
You may overcorrect and make the hero too empty.

### Mitigation
Keep atmosphere, but make atmosphere subordinate to landmarks.

### Risk
You may add labels or route lines that become visually noisy.

### Mitigation
Keep them subtle, sparse, and low-opacity.

### Risk
You may improve semantics but not performance.

### Mitigation
Treat object count, bloom, and motion intensity as mandatory tuning points.

---

## 24.10 Sprint 1 definition of done

Sprint 1 is done when:
- the hero has a clear semantic structure
- random-feeling decorative geometry has been reduced or reframed
- route/destination logic is visible
- the scene is cleaner and more intentional
- performance is at least stable relative to the current version
- the roadmap is updated with implementation outcomes

### Current Sprint 1 status
Sprint 1 is partially complete.

Implemented:
- hero scene refactored from generic glyphs to semantic landmarks
- route lines added to reinforce destination logic
- particle, bloom, and motion values reduced in the hero
- hero copy updated to frame the page as a mission map
- hero scene later upgraded again with capability-aware fallbacks for particles, stars, bloom, route opacity, trail intensity, landmark motion, and parallax strength

Still open:
- validate that the visual difference is strong enough to be felt immediately
- validate that performance improvement is noticeable in real browsing conditions
- continue tuning or simplifying if the hero still feels too similar to the old version
- decide whether the hero should remain a dedicated scene or eventually donate more of its logic to a shared persistent world renderer

---

## 25. Post-Sprint 1 next step
After Sprint 1, the next engineering step should be:

### Sprint 2
Persistent World State + Section Awareness

That sprint should introduce:
- active section tracking
- world emphasis mapping
- continuity rules across sections
- the first real move toward a seamless site-wide world layer

This order is important:
1. fix meaning
2. stabilize visuals
3. then unify the system

That is the safest and smartest path.

### Current Sprint 2 status
Sprint 2 is now actively underway and partially implemented.

Implemented:
- a dedicated world-state foundation under `src/three/world/`
- typed section, capability, intensity, and world-mode models
- a section-to-world mapping configuration
- capability-tier detection utilities
- a `useWorldState` hook that tracks active section, previous section, reduced motion, touch/coarse pointer state, low-power hints, capability tier, and challenge-mode activity
- app-shell integration of world state
- a visible `WorldHUD`
- a visible `SectionProgress` route rail
- section-aware `PersistentShip` behavior
- a lightweight `PersistentWorldOverlay`
- a hero `WorldStatusBanner`

Still open:
- decide whether the persistent overlay should remain CSS/SVG/DOM-based or evolve into a single persistent WebGL world layer
- connect more section visuals directly to world-state transitions
- validate whether the new continuity layer is strong enough to be felt as a seamless environment
- decide how much shell UI should remain visible in immersive mode versus only in lite mode or non-hero sections
- decide whether heavy mode should keep both hero and skills WebGL scenes active by default on lower-end hardware

---

## 26. Detailed implementation progress since the initial roadmap

This section records what has actually been built since the original planning document, what changed in the architecture, what issues were encountered, and what still remains.

### 26.1 What has been implemented

#### A. Hero scene semantic refactor
The hero was originally one of the biggest sources of conceptual weakness because it felt like a collection of random floating 3D objects.

Implemented changes:
- replaced generic glyph thinking with semantic landmark thinking
- introduced `LANDMARK_DEFS` with section-oriented meaning
- added route lines connecting ship origin and destination landmarks
- reduced decorative density
- reframed hero copy around a mission-map concept
- tuned bloom, particles, and motion
- later added capability-aware degradation for hero rendering

Result:
- the hero is more intentional than before
- the code structure is more aligned with the roadmap
- however, local feedback showed that the visual difference still did not feel strong enough yet, so this remains only a partial success

#### B. World-state architecture foundation
A major architectural step was completed by introducing a dedicated world-state layer.

Implemented files:
- `src/three/world/worldTypes.ts`
- `src/three/world/sectionWorldMap.ts`
- `src/three/world/capabilityTier.ts`
- `src/three/world/useWorldState.ts`

What this added:
- typed section IDs
- typed capability tiers
- typed world intensity levels
- typed world modes
- section-to-world configuration
- capability assessment logic
- active-section tracking
- reduced-motion awareness
- low-power/touch-device awareness

Result:
- the project now has a real orchestration foundation instead of only isolated section logic
- this is one of the most important long-term improvements made so far

#### C. Visible mission-control shell UI
The site now has a visible section-aware shell layer.

Implemented components:
- `WorldHUD`
- `SectionProgress`
- `WorldStatusBanner`

What this added:
- active sector display
- route progress display
- world mode display
- capability/intensity display
- challenge-mode awareness in the shell
- hero-level mission-control status banner

Important follow-up:
- local visual review showed that the first shell version was too heavy
- the combination of top HUD, left route rail, right-side status panel, hero banner, persistent overlay, and hero scene made the site feel broken rather than immersive
- the shell therefore had to be simplified

What changed after that review:
- the top HUD was reduced to a compact status bar
- the large left route rail was replaced with a compact bottom progress dock
- the hero status banner was simplified into a smaller pill-style strip
- shell visibility was reduced on smaller screens and in recruiter mode

Result:
- the site now feels more like a system with state, not just a page with animations
- however, the shell had to be rebalanced so it would support the portfolio instead of overpowering it

#### D. Persistent continuity layer
A lightweight persistent world overlay was added.

Implemented component:
- `PersistentWorldOverlay`

What it currently provides:
- ambient grid
- route arcs
- section beacons
- section wash/accent glow
- overlay legend

Important follow-up:
- the first overlay pass was visually too strong on the hero
- it contributed to the “broken layered dashboard” feeling when combined with the hero scene and shell UI

What changed after that review:
- hero-specific overlay intensity was reduced
- grid opacity was lowered
- route arc opacity was lowered
- beacon intensity was lowered
- hero overlay behavior was made lighter than non-hero sections
- the overlay legend was hidden on the hero
- recruiter mode now disables the overlay entirely

Result:
- this is the first real implementation of persistent continuity across sections
- it is intentionally lightweight and DOM/CSS/SVG-style rather than a heavy new WebGL scene
- it improves continuity, but it is still an early version rather than the final persistent world system

#### E. Section-aware persistent ship
The persistent ship is no longer just a generic cursor follower.

Implemented changes:
- ship scale changes by section
- ship glow changes by section
- ship opacity behavior is influenced by active section
- ship now participates in the world-state system
- ship now respects recruiter mode and hides entirely in simplified viewing mode

Result:
- continuity is stronger
- the ship is beginning to behave like a world-aware navigator
- recruiter mode now has a cleaner, less distracting fallback path

#### F. About section reframed as “Pilot Profile”
The About section was redesigned to better match the chosen metaphor.

Implemented changes:
- added “Pilot Profile” framing
- converted the section into a more panel-like system
- added profile panels such as focus, desktop track, operating style, and current mission
- preserved readable resume content

Result:
- About now fits the world language much better than before
- it remains DOM-first and recruiter-friendly

#### G. Projects redesigned as “Mission Select”
The Projects section received one of the strongest thematic upgrades.

Implemented changes:
- added mission-control framing
- added mission stats
- added terminal-style container
- added inspect-oriented copy
- redesigned project cards as mission terminals

Project card improvements:
- mission type inference
- impact label inference
- richer metadata layout
- stack summary
- skills summary
- stronger CTA language (`Inspect Mission`)
- external action icons for GitHub/live links
- status tone system

Result:
- Projects is now one of the clearest payoffs of the game-inspired concept
- this is one of the strongest completed section-level upgrades so far

#### H. Contact redesigned as “Transmission Terminal”
The Contact section was also brought into the world language.

Implemented changes:
- added transmission-terminal framing
- added channel-open / response-ready badges
- reframed contact methods as communication channels
- added preferred transmission panel
- improved CTA language

Result:
- the site now ends in a way that matches the world metaphor instead of dropping back into a generic portfolio section

#### I. Capability-aware performance fallbacks
Performance work moved from theory into implementation.

Implemented changes:
- hero scene now degrades by capability tier and reduced-motion preference
- skills constellation now degrades by capability tier and reduced-motion preference
- DPR, antialiasing, bloom, star count, particle count, motion intensity, and trail intensity are now adjusted more aggressively
- shell UI and persistent overlay were later simplified because visual overload was also contributing to the feeling that the site was “broken”
- lite mode now disables the hero WebGL scene entirely and replaces it with a CSS fallback
- lite mode now disables the skills WebGL scene entirely and replaces it with a static mission-panel fallback
- lite mode now disables immersive shell layers, persistent ship behavior, and challenge overlay mounting

Result:
- the architecture now supports progressive enhancement more meaningfully than before
- local testing confirms that lite mode behaves much better on lower-end hardware
- however, heavy mode still has unresolved performance issues in the skills region and around the projects section
- performance perception is now understood as both a rendering problem and a visual-complexity problem

---

### 26.2 Issues encountered and how they were handled

#### Issue 1 — First-pass hero changes did not feel strong enough
After the first hero refactor, local feedback indicated that the site still looked and struggled too much like the old version.

What this revealed:
- semantic cleanup alone was not enough
- the visual delta was too subtle
- performance tuning needed to be more aggressive

Response:
- documented this honestly in the roadmap
- avoided pretending Sprint 1 was fully successful
- followed up with stronger capability-aware performance fallbacks
- moved forward with shell-level continuity work instead of endlessly polishing the hero in isolation

#### Issue 2 — Production build failure from invalid Tailwind utility
A production build failed with a PostCSS/Tailwind error caused by:
- `border-white/8`

Why it happened:
- that utility was not valid in the current Tailwind setup

Fix:
- replaced it with:
  - `border-white/10`

Impact:
- build stability was restored
- this also highlighted the need for more frequent production-build validation during UI refactors

#### Issue 3 — Risk of adding more complexity before solving performance
As more world-shell features were added, there was a risk of making the site more complex before the performance story was stable.

Response:
- kept the persistent continuity layer lightweight
- used DOM/CSS/SVG-style overlays instead of adding another heavy WebGL scene
- added capability-aware degradation before pushing further into richer rendering

#### Issue 4 — The site looked broken because the shell was louder than the content
A local browser review showed that the site looked broken, not because the idea was wrong, but because too many shell layers were visible at once.

Observed causes:
- top HUD
- left route rail
- right-side status panel
- hero status banner
- persistent overlay
- hero 3D scene
- navbar
- hero content cards

Why this mattered:
- the shell was visually louder than the actual resume content
- the hero had too many competing focal points
- the site felt like multiple dashboards stacked together instead of one coherent portfolio

Response:
- simplified the top HUD
- replaced the large left route rail with a compact bottom progress dock
- simplified the hero status banner
- toned down the persistent overlay
- reduced hero-only shell clutter
- introduced recruiter mode as a clean fallback path

Result:
- the project now has a clearer understanding of visual hierarchy
- “comprehensive” implementation now explicitly includes subtraction and simplification, not just adding more layers

#### Issue 5 — Heavy mode is still too expensive on lower-end hardware
After introducing lite mode, local testing made the remaining heavy-mode bottlenecks much clearer.

Observed findings:
- the skills section 3D constellation is expensive to load
- once loaded, the constellation is comparatively smoother to interact with than it is to initially enter and scroll through
- the projects section still feels slow in heavy mode even though the hologram itself is CSS/SVG-based
- lite mode performs much better, which strongly suggests the main unresolved cost is still the heavy rendering path and surrounding section complexity

Why this matters:
- the problem is not just “the whole site is slow”
- the problem is now narrowed down to specific heavy-mode regions
- this means future optimization should be targeted, not broad and random

Current interpretation:
- the hero and skills WebGL scenes are the clearest GPU-heavy regions
- the projects slowdown is likely not caused by per-card WebGL anymore, but by broader section cost such as layout, motion, layered effects, and the cumulative cost of the immersive shell while entering that region

#### Issue 6 — State duplication risk
The new world-state hook was initially used in multiple places.

Why this mattered:
- repeated subscriptions can become harder to reason about
- future tuning can become fragmented if every component computes world state independently

Response:
- introduced a shared world-state provider
- migrated multiple shell and scene consumers to the shared provider

Current status:
- first-pass centralization is now implemented
- future cleanup may still be needed, but the architecture is in a much better place than before

---

### 26.3 What has been solved from the initial planning

The following initial planning goals now have meaningful implementation progress:

- chosen world metaphor is defined and visible
- hero randomness has been reduced
- route/destination logic exists in the hero
- section-aware world state exists
- persistent continuity has started
- projects have been redesigned as mission terminals
- contact has been redesigned as a transmission terminal
- experience has been reframed as a career route panel
- shell-level progression UI exists
- capability-aware performance fallbacks exist
- challenge mode is now represented in the shell language even though the game itself is not fully reframed yet
- recruiter mode evolved into a real lite/heavy mode split
- lite mode now disables the two heaviest WebGL regions
- a shared world-state provider now exists to reduce duplicated state logic

---

### 26.4 What is still not solved from the initial planning

The following major goals remain incomplete or only partially complete:

#### A. Hero still needs stronger validation
Even after refactoring and fallback tuning:
- the hero may still not feel dramatically different enough
- the hero may still not feel performant enough on some machines

Needed:
- real device validation
- possibly more aggressive simplification
- possibly a stronger visual hierarchy shift

#### B. Persistent world is still lightweight, not final
The current persistent overlay is a first implementation, not the final architecture.

Still needed:
- decide whether to keep a lightweight overlay approach
- or evolve toward a single persistent world renderer
- unify more section visuals under one shared system

#### C. Game integration is still incomplete
The mini-game still exists conceptually as a separate feature even though the shell now acknowledges challenge mode.

What has been done:
- the navigation and shell language now use `Challenge Mode` instead of only `Dev Sprint`
- lite mode now prevents the challenge overlay from mounting, which protects lower-end devices from an additional heavy layer

Still needed:
- connect rewards or outcomes back into the portfolio
- make the game feel native to the world rather than optional and detached
- add onboarding that explains why challenge mode exists
- connect challenge mode to skills, projects, or HUD state in a meaningful way
- redesign the user flow so challenge mode feels like part of the site journey instead of a separate space

#### D. Accessibility and recruiter mode are still pending
What has been done:
- reduced-motion-aware rendering exists in hero and skills
- recruiter mode now exists as a first-pass simplified viewing mode
- recruiter mode hides several immersive shell layers and provides a cleaner portfolio-first path

Still needed:
- reduced-motion audit across the whole app
- keyboard and focus review
- validate recruiter mode across all sections and routes
- ensure recruiter mode also behaves well on project detail pages
- clearer non-interactive fallback experience

#### E. Experience section could be integrated further
The Experience section is already more performant than before, but it still has room to align more strongly with the world-state system.

Still needed:
- stronger route-state linkage
- more explicit checkpoint language or visuals
- optional world-state-driven emphasis

#### F. Shared world-state provider is still maturing
What has been done:
- a shared world-state provider now exists
- multiple shell and scene components now consume the same world-state source
- challenge-mode activity is now passed into the world-state layer

Still needed:
- finish migrating any remaining direct world-state consumers if necessary
- validate that provider composition remains clean and predictable
- decide whether recruiter mode should eventually influence world intensity directly through the same orchestration layer

---

### 26.5 New opportunities that were not fully captured in the initial plan

The implementation work revealed several new opportunities that could make the project more comprehensive.

#### Opportunity 1 — Lite mode / heavy mode
This opportunity has now started and is more explicit than the earlier recruiter-only framing.

Implemented first pass:
- explicit `Lite Mode` and `Heavy Mode`
- persistent storage of selected mode
- lite mode disables the hero WebGL scene
- lite mode disables the skills WebGL scene
- lite mode disables immersive shell layers
- lite mode disables persistent ship behavior
- lite mode prevents challenge overlay mounting

Still possible:
- auto-suggest lite mode on weaker devices
- add a short explanation tooltip describing what lite mode changes
- make project detail pages respect lite mode more explicitly if needed
- add a third “auto” mode that chooses based on capability tier
- let heavy mode progressively degrade instead of staying fully expensive until the user manually switches

Why it matters:
- gives lower-end devices a real fallback path
- improves accessibility and usability
- makes performance control explicit instead of hidden
- helps isolate whether the main bottleneck is WebGL or broader UI/layout cost

#### Opportunity 2 — World-state provider and developer tooling
Introduce a shared provider for world state and optionally a small debug panel in development.

Why it matters:
- easier tuning
- easier debugging of active section / capability tier / intensity
- cleaner architecture

#### Opportunity 3 — Mission map overview
Add a compact overview map that shows:
- all sections
- current position
- challenge mode entry
- maybe project clusters

Why it matters:
- would make the “career galaxy” concept much clearer
- could become a signature interaction without requiring heavy 3D

#### Opportunity 4 — Challenge mode rewards
Let challenge mode unlock:
- a badge
- an alternate ship skin
- a hidden project note
- a fun “systems calibrated” state in the HUD

Why it matters:
- makes the game feel connected to the portfolio
- adds delight without blocking core content

#### Opportunity 5 — Analytics and validation instrumentation
Track:
- challenge mode launches
- section dwell time
- project card opens
- recruiter-mode usage
- device capability distribution

Why it matters:
- helps decide which features are actually valuable
- helps tune performance and UX based on real usage

#### Opportunity 6 — Stronger low-tier fallback strategy
If runtime still feels sluggish, add a more aggressive fallback mode:
- near-static hero
- no bloom in more cases
- reduced or disabled constellation motion
- simplified persistent overlay
- optional CSS-only fallback for some devices

Why it matters:
- protects the portfolio experience on weaker hardware
- keeps the project impressive without punishing users

---

### 26.6 Recommended next implementation order from here

Given current progress, the smartest next order is:

1. validate heavy mode and lite mode separately on real target hardware
2. optimize the heavy-mode skills region specifically
3. investigate why the projects region still feels slow in heavy mode even without per-card WebGL
4. deepen challenge-mode integration beyond naming
5. connect Experience and Skills more tightly to shared world-state transitions
6. add analytics and validation instrumentation
7. decide whether the persistent overlay is enough or whether a richer shared renderer is justified

This order keeps the project grounded in performance, hierarchy, and usability while continuing to improve coherence.

---

### 26.7 Current overall assessment
The project has moved meaningfully beyond the original fragmented state.

What is now true:
- the architecture is much stronger
- the world metaphor is visible in multiple sections
- the shell now behaves like a system
- projects and contact are much more aligned with the concept
- performance-aware rendering logic now exists

What is not yet true:
- the site is not fully seamless yet
- the hero is not fully validated yet
- the game is not fully integrated yet
- accessibility/recruiter mode is not done yet
- the final persistent world architecture is not settled yet

So the project is no longer at the “idea only” stage.
It is now in a real implementation phase with visible progress, but it still needs validation, simplification, and integration work before it reaches the original vision.

---

## 27. Revised backlog after implementation progress

## Immediate backlog
- [ ] validate production build after latest UI and world-shell changes
- [ ] validate runtime smoothness on real target devices
- [x] validate whether the latest shell simplification solved the “broken layered dashboard” feeling
- [ ] optimize the heavy-mode skills region, especially initial load and scroll-through cost
- [ ] investigate the heavy-mode projects region slowdown even though project holograms are CSS/SVG-based
- [ ] decide whether hero needs a harder simplification pass in heavy mode
- [ ] decide whether the persistent overlay is strong enough or needs a richer shared renderer
- [x] centralize world state with a provider
- [x] implement explicit lite/heavy mode split

## Short-term backlog
- [ ] integrate Experience more deeply with world-state transitions
- [x] reframe the mini-game as challenge mode in actual UI copy and flow
- [ ] connect challenge mode outcomes back into the portfolio shell
- [ ] redesign challenge mode entry so it feels integrated into the site journey
- [x] add recruiter/minimal mode
- [ ] validate lite mode on project detail pages
- [ ] add a mission map overview

## Mid-term backlog
- [ ] add analytics for interaction usage and device capability distribution
- [ ] add a development/debug world-state panel
- [ ] add unlockable challenge-mode rewards or easter eggs
- [ ] refine low-tier CSS-only fallback strategy
- [ ] evaluate whether a single persistent world renderer is worth the complexity
- [ ] consider an `Auto Mode` that chooses lite/heavy based on capability tier

---

## 28. Revised recommendation
The project is now at a more advanced stage than the original roadmap assumed.

The next goal is no longer just “add cool Three.js.”
The next goal is to:
- validate what has been built
- simplify where needed
- protect hierarchy so the shell never overpowers the content
- finish integration
- protect performance and accessibility
- make the game layer feel native to the world

If that is done well, the portfolio can become:
- visually distinctive
- technically ambitious
- structurally coherent
- recruiter-friendly
- performant enough to support the concept instead of undermining it

---

## 29. Latest implementation pass — recruiter mode, shared provider, challenge-mode reframing, and shell simplification

This section records the most recent implementation pass after local browser review showed that the site looked broken because too many shell layers were visible at once.

### 29.1 What triggered this pass
A local visual review revealed that the site felt broken for a specific reason:
- the shell UI had become louder than the actual portfolio content

Visible causes included:
- top HUD
- left route rail
- hero status banner
- persistent overlay
- hero 3D scene
- navbar
- hero content cards

This created:
- too many focal points
- too much floating UI
- too much competition around the hero
- a “stacked dashboards” feeling instead of a coherent portfolio

### 29.2 What was implemented in response

#### A. Shared world-state provider
Implemented:
- `WorldStateProvider`
- shared world-state consumption across multiple components

Why it matters:
- reduces duplicated world-state subscriptions
- makes shell and scene coordination cleaner
- gives the project a stronger architectural base for future continuity work

#### B. Recruiter mode
Implemented:
- recruiter mode provider
- recruiter mode toggle
- persistent recruiter mode preference
- hiding of immersive shell layers in recruiter mode

Current recruiter-mode behavior:
- hides persistent overlay
- hides shell HUD
- hides progress dock
- hides persistent ship
- hides hero status banner
- preserves core content and navigation

Why it matters:
- gives the site a cleaner portfolio-first mode
- reduces risk that the experience feels too experimental
- improves accessibility and recruiter usability

#### C. Challenge-mode reframing
Implemented:
- navigation and shell language now use `Challenge Mode`

What this solved:
- the game is no longer framed only as a detached “Dev Sprint” gimmick in the main navigation

What still remains:
- connect challenge mode outcomes back into the portfolio
- add onboarding and purpose
- make challenge mode feel like a native part of the world

#### D. Shell simplification
Implemented:
- top HUD simplified into a compact status bar
- large left route rail replaced with a compact bottom progress dock
- hero status banner simplified
- persistent overlay toned down
- hero-only shell clutter reduced

Why it matters:
- this was necessary to restore visual hierarchy
- the portfolio content must remain the primary focus
- the shell should support the experience, not dominate it

### 29.3 What this pass solved
This pass solved or improved:
- duplicated world-state logic
- lack of recruiter/minimal mode
- detached game naming in the main shell
- excessive shell clutter
- the most obvious reason the site looked broken in local review

### 29.4 What still needs validation after this pass
Still needs validation:
- whether the latest simplification is enough
- whether the hero still feels too busy
- whether recruiter mode behaves correctly across all routes
- whether challenge mode now feels clearer in the UI
- whether runtime smoothness is acceptable after the latest changes

### 29.5 What still remains for comprehensive completion
To reach a more comprehensive implementation, the following still remain:
- validate and tune the hero further if needed
- validate lite mode on project detail pages
- optimize the heavy-mode skills region
- investigate the heavy-mode projects region slowdown
- connect challenge mode outcomes back into the shell
- redesign challenge mode so it feels integrated into the site journey
- add a mission map overview if it improves clarity
- complete a broader accessibility pass
- decide whether the lightweight persistent overlay is sufficient long-term

---

## 30. Latest performance findings after introducing Lite Mode / Heavy Mode

This section records the most recent performance findings after local testing made the difference between lite mode and heavy mode much clearer.

### 30.1 What Lite Mode proved
Lite mode now works as intended.

Observed result:
- browsing is much smoother
- the site becomes usable on lower-end hardware
- the biggest lag sources are clearly reduced when the hero WebGL scene and the skills WebGL scene are removed

Interpretation:
- the main unresolved performance problem is not the entire site equally
- the main unresolved performance problem is the heavy rendering path

### 30.2 Heavy mode findings
Heavy mode still has two clear problem regions.

#### Region 1 — Skills section
Observed behavior:
- entering the technical skills section is expensive
- the 3D constellation takes time to load
- scrolling through that region still causes lag and stutter
- once the scene is fully loaded, direct interaction with the constellation is comparatively smoother than the initial load/scroll-through experience

Interpretation:
- the main issue is not only interaction cost
- the main issue is scene startup cost, asset/setup cost, and the cost of keeping that region active while scrolling

Likely causes:
- a second large WebGL canvas becomes active in the page flow
- stars, bloom, orbit controls, and many animated nodes all become active together
- the scene still uses `frameloop="always"`
- postprocessing and continuous animation remain expensive even after capability-tier reductions

#### Region 2 — Projects section
Observed behavior:
- the projects section still feels slow in heavy mode
- entering the project-card region causes lag and delayed responsiveness
- this happens even though the hologram implementation itself is CSS/SVG-based and no longer uses per-card WebGL

Interpretation:
- the remaining slowdown in this region is likely not caused by the hologram component itself
- the issue is more likely cumulative section cost:
  - many animated cards entering at once
  - layered gradients and blur
  - tilt transforms on multiple cards
  - shell/background effects still active
  - overall page complexity while scrolling into that region

### 30.3 Why other Three.js/WebGL sites feel smoother
Well-performing Three.js/WebGL sites usually do one or more of the following:
- keep a single main scene instead of multiple large section scenes
- use on-demand rendering where possible instead of always-on rendering
- aggressively reduce draw calls and animated objects
- avoid expensive postprocessing unless absolutely necessary
- use instancing or merged geometry for repeated objects
- reduce scene complexity during movement or scrolling
- degrade quality automatically based on device performance
- keep DOM/UI layers visually simple so the browser is not juggling too many expensive systems at once

### 30.4 Best-practice implications for this project
Based on the current implementation and the latest findings, the most important best-practice implications are:

- avoid multiple large always-on WebGL regions in the normal page flow
- prefer one primary immersive scene plus static/CSS fallbacks elsewhere
- treat the skills scene as optional enhancement, not mandatory heavy content
- keep project cards DOM/CSS-first and reduce simultaneous motion
- reduce or remove postprocessing in secondary scenes
- consider on-demand rendering for scenes that do not need constant animation
- reduce work during scroll, because scroll smoothness matters more than scene richness

### 30.5 Recommended next technical direction
The next optimization direction should be:

1. make the skills scene much cheaper in heavy mode
   - consider removing bloom entirely there
   - consider reducing stars further
   - consider reducing node animation
   - consider switching away from always-on rendering if possible
   - consider replacing the heavy scene with a lighter hybrid version

2. investigate the projects region as a broader section-performance problem
   - reduce simultaneous card motion
   - reduce tilt cost or disable it on lower-end devices
   - reduce layered blur and gradient cost
   - validate whether the slowdown is from card entry animation rather than hologram rendering

3. keep lite mode as the safe baseline for weaker hardware
   - lite mode is now the proof that the project can remain usable
   - heavy mode should become an enhancement, not the default assumption for all devices

### 30.6 Strategic conclusion
The project now has a much clearer performance story:
- lite mode proves the portfolio can be smooth
- heavy mode proves the current immersive implementation is still too expensive in specific regions
- the next phase should focus on targeted heavy-mode optimization, not broad random changes
- the long-term architecture should bias toward one main immersive scene and lighter secondary sections wherever possible