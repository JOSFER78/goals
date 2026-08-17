# Verification Protocol

## Functional
- Can the user select target entities?
- Can they navigate/zoom/orbit as specified?
- Do interactions work at every intended scale?
- Do timelines/date changes update the correct state?

## Data
- Are key quantities source-backed?
- Are units explicit?
- Are dates and coordinate conventions documented?
- Are uncertain/reconstructed values labeled?

## Visual
- Does the result match the intended spatial metaphor?
- Does detail increase continuously when zooming?
- Are transitions free of obvious popping, jitter, or clipping?
- Is UI subordinate to the exploration view when immersion is the goal?

## Performance
- Initial load is bounded.
- Large assets stream/lazy-load.
- Frame pacing is acceptable at intended scale.
- Memory growth is controlled during travel.

## Accessibility
- Keyboard path exists when practical.
- Text alternatives exist for critical information.
- Color is not the only signal.
- Motion can be reduced when feasible.

## Completion rule
A feature is complete only when the user-visible behavior works end-to-end and the relevant acceptance criterion is checked.
