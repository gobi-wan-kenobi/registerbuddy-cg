# RegisterBuddy Capacity Planner

A static, interactive product prototype demonstrating phased investment in testing-center capacity planning. All institution names, operational records, demand estimates, costs, and results are synthetic. No confidential interview documents or real student information are included.

## Explore

- **Phase 1 — Forecast:** switch the forecast date, resource type and demand case; inspect demand components; edit capacity; simulate insufficient history; review material readiness; export CSV.
- **Phase 2 — Scenarios:** adjust rooms, proctors and hours; inspect staffing bottlenecks, incremental costs and residual shortfalls; save scenarios locally; export a funding brief.
- **Phase 3 — Recommendations:** inspect a rule-based recommendation and cost breakdown; adjust it; record a demo approval after reviewing prerequisites.
- **Delivery gates:** inspect proposed continue, narrow and stop criteria. No research or pilot results are claimed.

## Hosting

No build process, server, authentication, external packages or network calls are required. `index.html` is the complete application. Open it locally, or enable GitHub Pages for the `main` branch and root directory. Hash navigation works under a repository subpath.

## Model boundaries

Expected resource-hours are fixed synthetic values. Moving the as-of date converts part of known unbooked demand into bookings without double-counting. Additional demand represents late accommodation requests and other needs. The higher-demand scenario applies an illustrative 25–35% uplift, not a calibrated confidence interval. Daily resource-hours do not establish appointment-level feasibility.

Individual rooms use a deliberately simplified one-proctor-per-room rule. Scenario capacity is the minimum of physical room-hours and proctor coverage. The recommendation enumerates a bounded set of 0–3 extra rooms, 0–3 extra proctors and 0–2 extended hours. It selects the cheapest option meeting daily room-hour totals; it does not solve a full scheduling problem. Empty and insufficient-data states withhold recommendations appropriately.

Materials readiness is independent of capacity. Marking materials received does not erase demand. Approval does not reserve rooms, schedule staff, notify anyone or commit spending. Saved scenarios use this browser's local storage only; approvals last only for the current session.

## Checks

Run `node tests/model.test.cjs` for model invariants, coverage/cost checks and data-readiness behavior. Browser QA should cover the three views, dialogs, exports, keyboard navigation and a narrow viewport.
