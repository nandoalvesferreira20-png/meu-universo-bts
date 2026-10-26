import assert from "node:assert/strict";
import test from "node:test";
import { history, serviceRecords } from "../src/data/bts-history";

test("serviço: sete trajetórias únicas com datas conferidas e fontes", () => {
  const expected = [
    ["Jin", "2022-12-13", "2024-06-12"],
    ["j-hope", "2023-04-18", "2024-10-17"],
    ["SUGA", "2023-09-22", "2025-06-21"],
    ["RM", "2023-12-11", "2025-06-10"],
    ["V", "2023-12-11", "2025-06-10"],
    ["Jimin", "2023-12-12", "2025-06-11"],
    ["Jung Kook", "2023-12-12", "2025-06-11"],
  ];
  assert.deepEqual(
    serviceRecords.map((r) => [r.name, r.start, r.end]),
    expected,
  );
  assert.equal(new Set(serviceRecords.map((r) => r.name)).size, 7);
  for (const record of serviceRecords) {
    assert.ok(record.start < record.end);
    assert.ok(record.sources.length >= 2);
    assert.ok(
      record.sources.every((source) => source.url.startsWith("https://")),
    );
  }
  assert.deepEqual(
    serviceRecords.map((r) => r.start),
    serviceRecords.map((r) => r.start).toSorted(),
  );
});

test("serviço: SUGA é o único em serviço alternativo e os retornos estão ordenados", () => {
  assert.deepEqual(
    serviceRecords.filter((r) => r.kind === "alternative").map((r) => r.name),
    ["SUGA"],
  );
  assert.deepEqual(
    [...serviceRecords]
      .sort((a, b) => a.end.localeCompare(b.end))
      .map((r) => r.name),
    ["Jin", "j-hope", "RM", "V", "Jimin", "Jung Kook", "SUGA"],
  );
});

test("história: integração preserva os 14 marcos anuais e a passagem a ARIRANG", () => {
  assert.deepEqual(
    history.map((entry) => entry.year),
    Array.from({ length: 14 }, (_, index) => 2013 + index),
  );
  assert.equal(history.find((entry) => entry.year === 2026)?.era, "ARIRANG");
  for (const year of [2022, 2023, 2024, 2025])
    assert.equal(history.filter((entry) => entry.year === year).length, 1);
});
