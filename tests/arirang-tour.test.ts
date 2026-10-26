import { test } from "node:test";
import assert from "node:assert/strict";
import {
  tourStops,
  datedTourStops,
  getTourStatus,
  groupTourMonths,
  localDate,
} from "../src/data/arirang-tour";
test("turnê: 25 paradas, 62 datas, ordem, meses e fusos válidos; Seul não integra a agenda", () => {
  assert.equal(tourStops.length, 25);
  assert.equal(tourStops.flatMap((s) => s.dates).length, 62);
  assert.equal(new Set(tourStops.map((s) => s.id)).size, 25);
  let previous = "";
  for (const [i, stop] of tourStops.entries()) {
    assert.equal(stop.order, i + 1);
    assert.ok(stop.dates[0] > previous);
    assert.equal(new Set(stop.dates).size, stop.dates.length);
    assert.deepEqual([...stop.dates].sort(), stop.dates);
    for (const date of stop.dates) {
      assert.equal(date.slice(0, 7), stop.month);
      assert.equal(
        new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10),
        date,
      );
    }
    assert.match(
      localDate(new Date("2026-10-26T12:00:00Z"), stop.timeZone),
      /^2026-10-26$/,
    );
    previous = stop.dates.at(-1)!;
  }
  assert.equal(tourStops[0].dates[0], "2026-04-09");
  assert.equal(previous, "2026-10-31");
  assert.ok(!tourStops.some((s) => s.id === "seoul"));
  assert.deepEqual(
    groupTourMonths(datedTourStops(new Date("2026-10-26T12:00:00Z"))).map(
      (g) => g.stops.length,
    ),
    [3, 4, 2, 4, 6, 1, 5],
  );
});
test("turnê: em 26/10, 24 paradas passadas e São Paulo futuro com três datas", () => {
  const stops = datedTourStops(new Date("2026-10-26T12:00:00Z"));
  assert.equal(stops.filter((s) => s.status === "past").length, 24);
  const brazil = stops.at(-1)!;
  assert.equal(brazil.status, "upcoming");
  assert.equal(brazil.venue, "Estádio do MorumBIS");
  assert.deepEqual(brazil.dates, ["2026-10-28", "2026-10-30", "2026-10-31"]);
});
test("turnê: status respeita meia-noite em São Paulo e não encerra o show no início do dia", () => {
  const brazil = tourStops.at(-1)!;
  assert.equal(
    getTourStatus(brazil, new Date("2026-10-28T02:59:59Z")),
    "upcoming",
  );
  assert.equal(
    getTourStatus(brazil, new Date("2026-10-28T03:00:00Z")),
    "today",
  );
  assert.equal(
    getTourStatus(brazil, new Date("2026-10-29T15:00:00Z")),
    "in-progress",
  );
  assert.equal(
    getTourStatus(brazil, new Date("2026-11-01T02:59:59Z")),
    "today",
  );
  assert.equal(getTourStatus(brazil, new Date("2026-11-01T03:00:00Z")), "past");
  const goyang = tourStops[0];
  assert.equal(
    getTourStatus(goyang, new Date("2026-04-08T15:00:00Z")),
    "today",
  );
});
