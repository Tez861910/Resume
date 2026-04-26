# Game Design Document: Portfolio "Mission Control"

## 1. High-Level Vision & Core Concept
**Concept:** A lightweight, coherent, game-inspired portfolio UI that frames a developer's career as a navigable "Career Galaxy" or "Mission Control" interface. 
**Goal:** To build a web experience where scrolling and interaction move the visitor through skills, experience, and projects as if they are progressing through a game world, without compromising the readability of a professional resume or crushing browser performance.

**Target Feeling:** Interactive mission dashboard, navigable developer universe, career journey as a playable map.
**Anti-Goals:** Physics sandbox, heavy WebGL demo, recruiter-hostile layout, resource-heavy 3D driving game.

## 2. Narrative & Theme
**Theme:** "Mission Control / Career Galaxy"
The user (visitor/recruiter) is positioned as an operator or explorer navigating through a structured developer universe.
- **Stars/Galaxies:** Opportunities and exploration.
- **Nodes/Beacons:** Skills and core competencies.
- **Routes:** Career progression and timelines.
- **Ship/Avatar:** The developer's identity and guide.
- **Missions/Sectors:** Shipped projects and roles.

**Visual Language:**
- **Amber:** Primary mission, identity, highlights.
- **Cyan:** Systems, frontend, signal, interaction.
- **Emerald:** Backend, stability, completed systems.
- **Dark Slate:** Space, control room, contrast base.

## 3. Core Experience Pillars
1. **Narrative Coherence:** Every 3D/visual element maps to something real (skills, projects). Nothing is purely "random decoration".
2. **Seamless Continuity:** One persistent background world system across the site. Sections reveal different overlays and interaction states rather than completely isolated scene loads.
3. **Performance-First Immersion:** If it stutters, it fails. Use dynamic capability-tier degradation (Lite/Heavy modes) to keep scrolling smooth.
4. **Resume Clarity:** DOM-first content. The interactive layer is a shell *around* the resume, not an obstacle to reading it.

## 4. Key Features & Mechanics
### 4.1. Navigation & Traversal
- **Scroll as Travel:** Moving down the page updates the active "Sector".
- **Persistent Ship:** A visual avatar that changes scale, glow, and behavior based on the active section.

### 4.2. World States & Shell UI
- **Active Section Tracking:** The background scene emphasizes elements based on the current viewport (e.g., skill nodes brighten when in the Skills section).
- **HUD & Progress Dock:** A compact status bar and bottom progress dock to indicate the current sector and route progression.

### 4.3. Cockpit Module System
- **Concept:** A narrative-driven 3D space flight simulator framing the portfolio discovery.
- **Phases:** Base (Briefing) -> Space Sandbox (Combat/Collection) -> Base (Review Data).
- **Integration:** The 6 "Resume Hard Drives" are scattered across sectors. Combat and exploration are required to "decrypt" the resume.

### 4.4. Capability Modes
- **Heavy Mode:** Full immersive WebGL experience (bloom, rich particles, 3D scenes).
- **Lite Mode / Recruiter Mode:** Disables WebGL scenes, immersive shell layers, and persistent ship, defaulting to clean CSS fallbacks and static mission panels for maximum performance and readability.

## 5. Level / Section Design
1. **Hero ("Launch Sequence"):** 
   - *Visuals:* Launch bay with visible route lines connecting to section landmarks. Ship is focal.
   - *Mechanics:* Sets the tone, introduces the world.
2. **About ("Pilot Profile"):** 
   - *Visuals:* Dossier/profile terminal UI. Subtle background grid.
   - *Mechanics:* DOM-first, readable "core systems" readout.
3. **Skills ("Constellation Map"):** 
   - *Visuals:* Structured node map representing taxonomy (frontend, backend, tools).
   - *Mechanics:* Scan/inspect affordances on hover.
4. **Experience ("Career Route"):** 
   - *Visuals:* Route lines, checkpoints, and completed mission statuses.
   - *Mechanics:* Scroll progression lights up the route.
5. **Projects ("Mission Select"):** 
   - *Visuals:* Mission terminal cards with holograms.
   - *Mechanics:* Rich metadata inspection, "Inspect Mission" CTAs, external action links.
6. **Contact ("Transmission Terminal"):** 
   - *Visuals:* Docking UI, channel-open badges, communication grid.
   - *Mechanics:* Clear, distraction-free CTAs.

## 6. Ideas & Improvements
- **Sound Design:** Add a toggle for subtle, low-volume UI audio (e.g., soft blips on hover, ambient hum).
- **Progress Map Overview:** A miniaturized map in the HUD that shows the full site layout and current position.
- **Analytics Integration:** Track which "missions" (projects) get the most inspect time to refine portfolio presentation.

## 7. Identified Gaps & Risks
- **Performance in Heavy Mode:** The Skills 3D constellation and Projects section layout still cause scroll jank on mid-to-low tier devices. 
  *Mitigation:* Optimize 3D asset loading, leverage instanced meshes, and aggressively utilize intersection observers to pause off-screen rendering.
- **Shell UI Overload:** Previous iterations suffered from UI clutter (too many overlapping HUD elements).
  *Mitigation:* Keep the HUD minimal. Use the 70/20/10 split (70% clean resume, 20% game UI, 10% delight).
- **Context Switching Cost:** Moving between heavy DOM layouts and active WebGL canvases can block the main thread.
  *Mitigation:* Maintain strict separation between DOM repaints and WebGL render loops.

## 8. Implementation Checklist

### Core Architecture
- [x] Define global state for World Mapping (Active Section, Mode).
- [x] Implement Lite / Heavy Mode toggle (Recruiter Mode).
- [x] Set up shared `WorldStateProvider`.

### Visuals & UI
- [x] Refactor Hero to use Semantic Landmarks instead of random glyphs.
- [x] Add Route Lines from Hero to subsequent sections.
- [x] Create compact HUD and Progress Dock.
- [x] Implement "Mission Terminal" styling for Project cards.
- [x] Implement "Transmission Terminal" styling for Contact section.
- [ ] Implement seamless persistent WebGL background (merging isolated scenes into one).

### Performance Optimization
- [x] Setup capability-tier detection.
- [ ] Optimize Skills Constellation WebGL performance (lazy load/instancing).
- [ ] Audit Projects section for scroll-jank (reduce DOM layout thrashing).
- [ ] Ensure 100% stable 60fps in Lite Mode on mobile.

### Game Integration (Cockpit Module)
- [x] Implement First-Person and Third-Person Camera toggle system.
- [x] Implement comprehensive Health & Shield System, enabling enemy AI firing and structural collisions.
- [x] Build an Asset Pipeline to asynchronously load GLTF models (player, enemy, station, asteroid).
- [x] Build Narrative Sandbox: Create a Base / Command Center UI to frame gameplay.
- [x] Implement Scene Dialogues: Negotiation UI with enemy factions before combat initiates.
- [x] Implement Audio System: Integrated synthesized engine hum, laser fire, radio static, and impact sounds.
- [x] Implement Visual Effects: Added Warp-in streaks and high-performance particle explosion system.
- [x] Implement HUD Minimap/Radar: Real-time top-down tracking of off-screen enemies and pips for targets.
- [ ] Implement multi-stage mission objectives (Escort, Destroy, Scan).
- [ ] Implement Boss Battles: Larger cruisers guarding the final drives.
- [ ] Add post-game summary that routes user to the Projects section.
