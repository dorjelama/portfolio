import { test } from "node:test";
import assert from "node:assert/strict";
import { tenure, uptime } from "./profile.js";

test("uptime counts calendar time since Sep 1 2017", () => {
  assert.equal(uptime(new Date(2017, 8, 1)), "0y 0mo 0d 00:00:00");
  assert.equal(uptime(new Date(2026, 10, 5, 13, 22, 7)), "9y 2mo 4d 13:22:07");
  assert.equal(uptime(new Date(2018, 7, 31, 23, 59, 59)), "0y 11mo 30d 23:59:59");
});

test("tenure reads like a person would say it", () => {
  const now = new Date(2026, 10, 5);
  assert.equal(tenure("Mar 2024", "Present", now), "2 yrs 8 mos");
  assert.equal(tenure("Jul 2020", "Apr 2024", now), "3 yrs 9 mos");
  assert.equal(tenure("Sep 2017", "Sep 2018", now), "1 yr");
  assert.equal(tenure("Sep 2017", "Oct 2017", now), "1 mo");
  assert.equal(tenure("Sep 2017", "Sep 2017", now), "under a month");
});
