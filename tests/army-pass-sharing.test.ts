import test from "node:test";
import assert from "node:assert/strict";
import {
  armyPassCaption,
  armyPassShareData,
} from "../src/features/army-pass/share-caption";

test("legenda preserva texto completo e só acrescenta URL pública configurada", () => {
  const caption = armyPassCaption();
  assert.equal(
    caption,
    "💜 Meu ARMY PASS está pronto!\n\nEscolhi minha era favorita do BTS e criei meu passaporte personalizado no ARMY PASS BRASIL! ✨\n\nCrie o seu também e compartilhe com a gente!\n\n💜 @meuuniversobts\n💻 @fernandev.tech\n\n#ArmyPassBrasil #BTS #BTSARMY",
  );
  // Test fixture only; no production URL is invented or configured.
  assert.equal(
    armyPassCaption("https://example.org/"),
    `${caption}\n\nhttps://example.org/`,
  );
  for (const url of [
    "",
    "invalid",
    "javascript:alert(1)",
    "http://localhost:3001",
    "https://localhost",
    "https://user:secret@example.org",
  ])
    assert.equal(armyPassCaption(url), caption);
});

test("compartilhamento mantém o mesmo arquivo PNG com ou sem suporte à legenda", () => {
  const file = new File(["png fixture"], "army-pass-persona.png", {
    type: "image/png",
  });
  const caption = armyPassCaption();
  const full = armyPassShareData(file, caption, () => true);
  assert.equal(full.files![0], file);
  assert.equal(full.text, caption);
  for (const canShare of [
    (data: ShareData) => !data.text,
    (data: ShareData) => !(data.files && data.text),
    () => {
      throw new Error("unsupported");
    },
  ]) {
    const data = armyPassShareData(file, caption, canShare);
    assert.equal(data.files![0], file);
    assert.equal(data.text, undefined);
    assert.equal(data.title, "Meu Army Pass Brasil");
  }
});
